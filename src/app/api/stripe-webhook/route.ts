import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { appUrl, stripeClient, supabaseAdmin } from "@/lib/services";
import { findProduct } from "@/lib/catalog";

export const runtime = "nodejs";

async function sendDeliveryEmail(to: string, productName: string, sessionId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;
  const link = `${appUrl()}/sucesso?session_id=${encodeURIComponent(sessionId)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Seu arquivo digital: ${productName}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#17212c"><h1>Seu pedido está pronto.</h1><p>Obrigado pela compra de <strong>${productName}</strong>.</p><p><a href="${link}" style="background:#142538;color:white;display:inline-block;padding:15px 25px;border-radius:7px;text-decoration:none">Acessar meu produto</a></p><p>Este link dá acesso ao seu pedido. Não compartilhe.</p></div>`,
    }),
  });
  if (!response.ok) throw new Error(`Falha na entrega do e-mail: HTTP ${response.status}`);
  return true;
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = stripeClient().webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "Assinatura Stripe inválida." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid") return NextResponse.json({ received: true });
      const productId = session.metadata?.product_id;
      const product = productId ? findProduct(productId) : undefined;
      if (!product) throw new Error("Produto Stripe não corresponde ao catálogo");
      const db = supabaseAdmin();
      const { data: existing, error: readError } = await db.from("orders")
        .select("email_sent_at,status").eq("stripe_session_id", session.id).maybeSingle();
      if (readError) throw readError;
      if (existing?.status === "refunded") return NextResponse.json({ received: true });
      const customerEmail = session.customer_details?.email || session.customer_email || null;
      const paymentIntent = typeof session.payment_intent === "string"
        ? session.payment_intent : session.payment_intent?.id || null;
      const { error: upsertError } = await db.from("orders").upsert({
        stripe_session_id: session.id,
        stripe_payment_intent_id: paymentIntent,
        product_id: product.id,
        customer_email: customerEmail,
        amount_total: session.amount_total ?? product.priceCents,
        currency: session.currency || "brl",
        status: "paid",
      }, { onConflict: "stripe_session_id" });
      if (upsertError) throw upsertError;
      if (customerEmail && !existing?.email_sent_at) {
        const sent = await sendDeliveryEmail(customerEmail, product.name, session.id);
        if (sent) {
          const { error: updateError } = await db.from("orders")
            .update({ email_sent_at: new Date().toISOString() })
            .eq("stripe_session_id", session.id);
          if (updateError) throw updateError;
        }
      }
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntent = typeof charge.payment_intent === "string"
        ? charge.payment_intent : charge.payment_intent?.id;
      if (paymentIntent) {
        const { error } = await supabaseAdmin().from("orders")
          .update({ status: "refunded" }).eq("stripe_payment_intent_id", paymentIntent);
        if (error) throw error;
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Falha ao processar webhook", error instanceof Error ? error.message : error);
    // Stripe tentará novamente. Não marcar processamento incompleto como sucesso.
    return NextResponse.json({ error: "Erro ao registrar pagamento." }, { status: 500 });
  }
}

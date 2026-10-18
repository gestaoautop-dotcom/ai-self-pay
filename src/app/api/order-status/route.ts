import { NextRequest, NextResponse } from "next/server";
import { findProduct } from "@/lib/catalog";
import { createDownloadUrl, stripeClient, supabaseAdmin } from "@/lib/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return NextResponse.json({ error: "Identificador de compra inválido." }, { status: 400 });
  }
  try {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.mode !== "payment" || session.payment_status !== "paid") {
      return NextResponse.json({ status: "pending" }, { headers: { "Cache-Control": "no-store" } });
    }
    const id = session.metadata?.product_id;
    const product = id ? findProduct(id) : undefined;
    if (!product) return NextResponse.json({ error: "Produto desconhecido." }, { status: 404 });

    // Negar downloads de compras já marcadas como estornadas.
    const { data: order, error: dbError } = await supabaseAdmin().from("orders")
      .select("status").eq("stripe_session_id", sessionId).maybeSingle();
    if (dbError) throw dbError;
    if (order?.status === "refunded") {
      return NextResponse.json({ error: "Esta compra foi estornada." }, { status: 403 });
    }

    const downloadUrl = await createDownloadUrl(product.assetPath);
    return NextResponse.json({ status: "paid", downloadUrl }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Erro ao validar compra", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Pagamento ou arquivo ainda indisponível. Tente novamente mais tarde." }, { status: 503 });
  }
}

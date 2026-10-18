import { NextRequest, NextResponse } from "next/server";
import { appUrl, stripeClient } from "@/lib/services";
import { findProduct, isProductEnabled } from "@/lib/catalog";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Checkout deliberadamente desabilitado até revisão manual e publicação dos arquivos.
  if (process.env.ENABLE_CHECKOUT !== "true") {
    return NextResponse.json({ error: "Loja ainda em preparação." }, { status: 503 });
  }

  try {
    const { productId } = await request.json() as { productId?: unknown };
    if (typeof productId !== "string") {
      return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
    }
    const product = findProduct(productId);
    if (!product) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    if (!isProductEnabled(product)) {
      return NextResponse.json({ error: "Produto ainda indisponível." }, { status: 503 });
    }

    const priceId = process.env[product.stripePriceEnv]!;
    const site = appUrl();
    const session = await stripeClient().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      locale: "pt-BR",
      customer_creation: "always",
      metadata: { product_id: product.id },
      success_url: `${site}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/cancelado`,
    });
    if (!session.url) throw new Error("Stripe não retornou o link de checkout.");
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Erro ao criar checkout", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento." }, { status: 500 });
  }
}

export type DigitalProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string[];
  priceCents: number;
  stripePriceEnv: "STRIPE_PRICE_AI_OFFICE";
  assetPath: string;
  accent: string;
  index: string;
};

// Produto comercial. A versao integral deve permanecer em armazenamento PRIVADO.
// A existencia desta entrada NAO autoriza vendas antes de validação ponta a ponta.
export const products: DigitalProduct[] = [{
  id: "ai-office",
  name: "SMEZI AI Office — Sistema portátil",
  category: "Sistema de IA personalizável",
  description: "Atendimento, vendas e orçamentos adaptáveis ao seu negócio, com instalação guiada na IA que você já utiliza.",
  details: ["ChatGPT · Gemini · Claude", "6 módulos de nicho", "Ativação guiada"],
  priceCents: 29700,
  stripePriceEnv: "STRIPE_PRICE_AI_OFFICE",
  assetPath: "smezi-ai-office-v1.zip",
  accent: "blue",
  index: "01",
}];

export function findProduct(id: string) {
  return products.find(product => product.id === id);
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function isProductEnabled(product: DigitalProduct) {
  return Boolean(
    process.env.ENABLE_CHECKOUT === "true" &&
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_WEBHOOK_SECRET &&
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env[product.stripePriceEnv]
  );
}

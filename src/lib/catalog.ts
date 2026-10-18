export type DigitalProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string[];
  priceCents: number;
  stripePriceEnv: "STRIPE_PRICE_BRAND_KIT" | "STRIPE_PRICE_SOCIAL_PACK" | "STRIPE_PRICE_PRESENTATION";
  assetPath: string;
  accent: string;
  index: string;
};

// Catálogo inicial demonstrativo. Arquivos comerciais reais precisam ser criados
// e publicados no bucket privado do Supabase antes de ativar o checkout.
export const products: DigitalProduct[] = [
  {
    id: "brand-kit",
    name: "Brand Kit Express",
    category: "Identidade visual",
    description: "Um ponto de partida elegante para uma marca com presença consistente.",
    details: ["Paleta de cores", "Guia de aplicação", "Arquivos editáveis"],
    priceCents: 19700,
    stripePriceEnv: "STRIPE_PRICE_BRAND_KIT",
    assetPath: "brand-kit-express.zip",
    accent: "violet",
    index: "01",
  },
  {
    id: "social-pack",
    name: "Social Media Essentials",
    category: "Conteúdo digital",
    description: "Composições editoriais para comunicar com clareza e personalidade.",
    details: ["Modelos para publicações", "Hierarquia de textos", "Instruções de uso"],
    priceCents: 9700,
    stripePriceEnv: "STRIPE_PRICE_SOCIAL_PACK",
    assetPath: "social-media-essentials.zip",
    accent: "blue",
    index: "02",
  },
  {
    id: "presentation",
    name: "Pitch Deck Minimal",
    category: "Apresentações",
    description: "Uma apresentação objetiva, refinada e pronta para personalização.",
    details: ["Estrutura de slides", "Layouts editáveis", "Guia de composição"],
    priceCents: 14700,
    stripePriceEnv: "STRIPE_PRICE_PRESENTATION",
    assetPath: "pitch-deck-minimal.zip",
    accent: "mint",
    index: "03",
  },
];

export function findProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function isProductEnabled(product: DigitalProduct) {
  // A interface não garante a existência de um arquivo: valide os ZIPs antes de vender.
  return Boolean(
    process.env.ENABLE_CHECKOUT === "true" &&
    process.env.STRIPE_SECRET_KEY &&
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env[product.stripePriceEnv]
  );
}

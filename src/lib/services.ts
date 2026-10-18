import Stripe from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function stripeClient(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY não configurada");
  return new Stripe(secret);
}

export function supabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase não configurado");
  // Credenciais somente em rotas server-side. Nunca com NEXT_PUBLIC_.
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function createDownloadUrl(assetPath: string): Promise<string> {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "digital-products";
  const { data, error } = await supabaseAdmin()
    .storage.from(bucket)
    .createSignedUrl(assetPath, 120, { download: true });
  if (error || !data?.signedUrl) throw new Error("Arquivo digital ainda não disponível");
  return data.signedUrl;
}

export function appUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = new URL(raw);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("Use HTTPS para NEXT_PUBLIC_APP_URL em produção");
  }
  return url.origin;
}

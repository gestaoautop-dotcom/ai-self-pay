"use client";

import { useState } from "react";

export default function BuyButton({ id, enabled }: { id: string; enabled: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Não foi possível iniciar a compra.");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="buy-block">
      <button type="button" className="buy-button" disabled={!enabled || loading} onClick={checkout}>
        {loading ? "Preparando pagamento..." : enabled ? "Comprar produto ↗" : "Em preparação ↗"}
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!enabled && <p className="micro-muted">Pagamento desativado até configurar os produtos reais.</p>}
    </div>
  );
}

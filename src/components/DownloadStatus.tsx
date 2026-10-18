"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DownloadStatus() {
  const query = useSearchParams();
  const sessionId = query.get("session_id");
  const [state, setState] = useState<{ status: string; downloadUrl?: string; message?: string }>({ status: "loading" });

  useEffect(() => {
    if (!sessionId) { setState({ status: "error", message: "Código da compra não encontrado." }); return; }
    let active = true;
    fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" })
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Não foi possível verificar a compra.");
        if (active) setState({ status: d.status, downloadUrl: d.downloadUrl, message: d.message });
      }).catch(e => { if (active) setState({ status: "error", message: String(e.message) }); });
    return () => { active = false; };
  }, [sessionId]);

  if (state.status === "loading") return <div className="status-result">Validando sua compra...</div>;
  if (state.status === "paid" && state.downloadUrl) return <div className="status-result ok"><strong>Pagamento confirmado.</strong><p>Seu produto está pronto. O link expira em dois minutos; recarregue esta página para gerar outro.</p><a className="primary-link" href={state.downloadUrl} rel="noopener noreferrer">Baixar meus arquivos ↓</a></div>;
  if (state.status === "pending") return <div className="status-result"><strong>Pagamento pendente.</strong><p>Atualize esta página após a confirmação.</p></div>;
  return <div className="status-result"><strong>Ainda não conseguimos liberar o arquivo.</strong><p>{state.message || "Confira o pagamento ou contate o suporte."}</p></div>;
}

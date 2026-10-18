import { Suspense } from "react";
import DownloadStatus from "@/components/DownloadStatus";

export default function SuccessPage() {
  return <main className="state-page shell"><span className="eyebrow">ENTREGA DIGITAL</span><h1>Obrigado por sua compra.</h1><p>Vamos conferir o pagamento antes de liberar o seu arquivo.</p><Suspense fallback={<p>Conferindo pagamento...</p>}><DownloadStatus /></Suspense></main>;
}

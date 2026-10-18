import Link from "next/link";

export default function Canceled() {
  return <main className="state-page shell"><span className="eyebrow">PAGAMENTO NÃO CONCLUÍDO</span><h1>Seu pedido não foi finalizado.</h1><p>Nenhum produto foi liberado. Você pode voltar e tentar novamente quando quiser.</p><Link className="primary-link" href="/#produtos">Voltar à loja ↗</Link></main>;
}

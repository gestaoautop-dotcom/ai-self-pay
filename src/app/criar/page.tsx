import Link from "next/link";
import OfficeBuilder from "@/components/OfficeBuilder";

export const metadata = { title: "Criar prévia do seu sistema | SMEZI AI Office", robots: { index: false, follow: false } };

export default function CreatePage() {
  return <main className="shell builder-page">
    <div className="builder-intro"><Link href="/" className="back-link">← Voltar à loja</Link><span className="eyebrow">SMEZI AI SYSTEMS / LAB</span><h1>Um sistema que<br /><i>entende seu negócio.</i></h1><p>Experimente o fluxo de personalização antes de comprar. A demonstração gera instruções portáteis para usar na sua própria conta de IA.</p></div>
    <OfficeBuilder />
    <p className="builder-footnote">Os conteúdos gerados podem conter erros e não substituem ferramentas operacionais, validação profissional ou armazenamento seguro de dados. Nenhuma informação deste formulário é enviada a modelos externos.</p>
  </main>;
}

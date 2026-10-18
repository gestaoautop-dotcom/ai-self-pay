import Link from "next/link";
import BudgetCalculator from "@/components/BudgetCalculator";

export const metadata = { title: "Painel demonstrativo | AI Self-Pay", robots: { index: false, follow: false } };

export default function Dashboard() {
  return <main className="dashboard shell">
    <div className="dashboard-head"><span className="eyebrow">AI REVENUE ENGINE / DEMONSTRAÇÃO</span><h1>As IAs precisam<br /><i>pagar a conta.</i></h1><p>O painel inicial calcula o ponto de equilíbrio de produtos digitais. Nenhum número abaixo representa vendas ou receita reais.</p></div>
    <BudgetCalculator />
    <div className="dashboard-foot"><div><h2>Próxima integração</h2><p>Autenticação administrativa e conciliação financeira com pedidos reais, pagamentos, anúncios e despesas.</p></div><Link href="/">Voltar para a loja ↗</Link></div>
  </main>;
}

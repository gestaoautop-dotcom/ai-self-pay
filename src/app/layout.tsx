import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Self-Pay · SMEZI AI Systems",
  description: "Sistemas conversacionais portáteis por nicho. Personalize e use na sua própria conta de IA. Pré-lançamento, sem vendas ativas.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>
    <header className="header shell"><Link href="/" className="brand" aria-label="AI Self-Pay — início"><span className="brand-mark">C<span>W</span></span><span className="brand-title">AI SELF<span>—</span>PAY <small>POWERED BY SMEZI</small></span></Link>
      <nav className="nav" aria-label="Navegação principal"><Link href="/#produto">AI Office</Link><Link href="/#nichos">Segmentos</Link><Link href="/painel">Painel</Link><Link href="/criar" className="nav-cta">Criar prévia <span>↗</span></Link></nav>
    </header>
    {children}
    <footer className="footer shell"><span>AI SELF—PAY <i>×</i> SMEZI</span><span>Sistemas inteligentes. Feitos para facilitar.</span><small>2026 · Pré-lançamento · Nenhuma venda habilitada</small></footer>
  </body></html>;
}

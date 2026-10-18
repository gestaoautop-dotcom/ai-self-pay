import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Self-Pay — Caroline Wilhelm × SMEZI",
  description: "Uma loja de produtos digitais criada para transformar inteligência, design e automação em receita.",
  robots: { index: false, follow: false }, // Alterar somente ao publicar com produtos reais.
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="header shell">
          <Link href="/" className="brand" aria-label="AI Self-Pay - início">
            <span className="brand-mark">C<span>W</span></span>
            <span className="brand-title">AI SELF<span>—</span>PAY <small>BY SMEZI</small></span>
          </Link>
          <nav className="nav" aria-label="Navegação principal">
            <Link href="/#produtos">Produtos</Link>
            <Link href="/#metodo">Como funciona</Link>
            <Link href="/painel" className="nav-cta">Painel demo <span>↗</span></Link>
          </nav>
        </header>
        {children}
        <footer className="footer shell">
          <span>AI SELF—PAY <i>×</i> SMEZI</span>
          <span>Design, sistemas e ideias que trabalham.</span>
          <small>2026 · MVP em desenvolvimento · Sem checkout ativo por padrão</small>
        </footer>
      </body>
    </html>
  );
}

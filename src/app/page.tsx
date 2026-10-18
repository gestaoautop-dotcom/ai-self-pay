import Link from "next/link";
import BuyButton from "@/components/BuyButton";
import { formatBRL, isProductEnabled, products } from "@/lib/catalog";

export default function Home() {
  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot" /> O SEU NEGÓCIO DIGITAL. EM MOVIMENTO.</span>
          <h1>Crie uma vez.<br /><em>Venda muitas.</em></h1>
          <p>Produtos digitais, identidade visual e ferramentas criativas para negócios que valorizam boas ideias — sem complexidade.</p>
          <div className="hero-actions">
            <a href="#produtos" className="primary-link">Explorar produtos <span>↗</span></a>
            <Link href="/painel" className="text-link">Ver o painel financeiro <span>→</span></Link>
          </div>
        </div>
        <div className="hero-art" aria-label="Composição gráfica minimalista">
          <div className="art-glow art-glow-one" />
          <div className="art-glow art-glow-two" />
          <div className="art-glass"><div className="art-icon">S<span>↗</span></div><div className="art-dots">•••</div><span>SMART SYSTEMS.<br />MADE EASY.</span></div>
          <div className="art-orbit" /><div className="art-stamp">IDEAS<br />IN MOTION ↗</div>
        </div>
      </section>
      <section className="metrics-strip shell" aria-label="Indicadores do projeto">
        <div><strong>01</strong><span>Compra única</span></div>
        <div><strong>100%</strong><span>Entrega digital planejada</span></div>
        <div><strong>24/7</strong><span>Vitrine sempre disponível</span></div>
        <div><strong>R$ 5 mil</strong><span>Meta mensal de cobertura</span></div>
      </section>
      <section className="collection shell" id="produtos">
        <div className="section-heading"><div><span className="eyebrow">COLEÇÃO 001</span><h2>Design pronto para<br /><i>ser seu.</i></h2></div><p>Um catálogo inicial para testar a operação. Produtos comerciais e pagamentos reais serão ativados após a publicação dos arquivos.</p></div>
        <div className="product-grid">
          {products.map((product) => <article className="product-card" key={product.id}>
            <div className={`product-graphic ${product.accent}`}>
              <span className="graphic-top">SMEZI / STUDIO EDITION <b>{product.index}</b></span>
              <div className="graphic-shape"><span>{product.index}</span></div>
              <span className="graphic-bottom">VISUAL SYSTEMS <span>↗</span></span>
            </div>
            <div className="product-content">
              <span className="product-tag">{product.category}</span>
              <h3>{product.name}</h3><p>{product.description}</p>
              <div className="product-details">{product.details.map((detail) => <span key={detail}>✓ {detail}</span>)}</div>
              <div className="product-buy"><strong>{formatBRL(product.priceCents)}</strong><BuyButton id={product.id} enabled={isProductEnabled(product)} /></div>
            </div>
          </article>)}
        </div>
      </section>
      <section className="method shell" id="metodo"><div className="section-heading"><div><span className="eyebrow">SIMPLES, COMO DEVERIA SER.</span><h2>Do clique à criação.</h2></div></div><div className="method-grid"><div><span>01 /</span><h3>Escolha</h3><p>Encontre um kit que combine com o seu negócio.</p></div><div><span>02 /</span><h3>Compre</h3><p>Pagamento seguro, quando os produtos estiverem disponíveis.</p></div><div><span>03 /</span><h3>Receba</h3><p>Acesse seus arquivos digitais sem entrega manual.</p></div></div></section>
      <section className="closing shell"><span>AI SELF—PAY</span><h2>Mais criação.<br /><i>Menos operação.</i></h2><Link href="/painel">Explorar simulação financeira ↗</Link></section>
    </main>
  );
}

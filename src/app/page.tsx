import Link from "next/link";
import BuyButton from "@/components/BuyButton";
import { formatBRL, isProductEnabled, products } from "@/lib/catalog";
import { niches } from "@/lib/office";

export default function Home() {
  const firstProduct = products[0];
  return <main>
    <section className="hero shell portable-hero">
      <div className="hero-copy"><span className="eyebrow"><span className="status-dot"/> SMEZI AI SYSTEMS · COLEÇÃO 001</span>
        <h1>Seu negócio.<br/>Seu sistema.<br/><em>Sua IA.</em></h1>
        <p>Um sistema de trabalho que você compra uma vez, adapta ao seu negócio e utiliza no ChatGPT, Gemini ou Claude. Sem mensalidade da SMEZI.</p>
        <div className="hero-actions"><Link href="/criar" className="primary-link">Criar minha prévia <span>↗</span></Link><a className="text-link" href="#produto">Conhecer o AI Office <span>→</span></a></div>
        <div className="hero-disclaimer">PRÉ-LANÇAMENTO · Versão demonstrativa · Checkout desativado</div>
      </div>
      <div className="office-hero-art" role="img" aria-label="Ilustração de um painel do SMEZI AI Office com dados do negócio e destinos ChatGPT, Gemini e Claude">
        <div className="office-aurora aurora-one"/><div className="office-aurora aurora-two"/>
        <div className="floating-badge floating-one">01 / CONTEXTO</div><div className="floating-badge floating-two">02 / FLUXOS</div>
        <div className="office-mock"><div className="mock-head"><span className="mock-logo">S<span>↗</span></span><span>SMEZI AI OFFICE</span><span className="mock-dots">● ● ●</span></div>
          <div className="mock-content"><div className="mock-label">SEU ASSISTENTE DE NEGÓCIOS</div><div className="mock-title">Organize o que importa.</div><p>Uma inteligência. Diferentes negócios.</p><div className="mock-task"><span className="mock-check">✓</span><div><b>Atendimento</b><small>Respostas com contexto</small></div><span>↗</span></div><div className="mock-task"><span className="mock-check">✓</span><div><b>Orçamentos</b><small>Modelos adaptáveis</small></div><span>↗</span></div><div className="mock-task"><span className="mock-check">✓</span><div><b>Propostas</b><small>Rascunhos organizados</small></div><span>↗</span></div></div>
          <div className="mock-foot"><span>PRONTO PARA ADAPTAR</span><span>V 1.0</span></div>
        </div>
        <div className="platform-float"><small>USE NA SUA IA FAVORITA</small><div><span>ChatGPT</span><span>Gemini</span><span>Claude</span></div></div>
      </div>
    </section>

    <section className="metrics-strip shell"><div><strong>01</strong><span>Compra única</span></div><div><strong>03</strong><span>Plataformas previstas</span></div><div><strong>06</strong><span>Segmentos na V1</span></div><div><strong>R$ 5 mil</strong><span>Meta mensal da operação</span></div></section>

    <section id="produto" className="spotlight shell"><div className="spotlight-heading"><span className="eyebrow">PRODUTO 01 · SISTEMA PORTÁTIL</span><h2>SMEZI <i>AI Office.</i></h2><p>Mais que um prompt isolado. Um conjunto de instruções, processos e modelos que orienta uma IA a trabalhar dentro da lógica da sua empresa.</p></div>
      <div className="spotlight-content"><div className="spotlight-visual"><span className="spotlight-index">S / 001</span><div className="spotlight-letter">S<span>↗</span></div><span className="spotlight-bottom">SMART SYSTEMS<br/>MADE EASY.</span></div>
        <div className="spotlight-details"><span className="eyebrow">EDIÇÃO MULTINICHO</span><h3>Uma estrutura.<br/>Mil possibilidades.</h3><p>Atendimento, relacionamento, propostas e rotinas comerciais adaptadas ao tipo de negócio. Comece com um dos seis segmentos ou evolua para novos módulos.</p>
          <div className="feature-checks"><span>✓ Instruções organizadas</span><span>✓ Implantação guiada</span><span>✓ Modelos e comandos por nicho</span><span>✓ Uso na própria conta de IA</span></div>
          <div className="spotlight-buy"><div><small>PREÇO DE TESTE · COMPRA ÚNICA</small><strong>{formatBRL(firstProduct.priceCents)}</strong></div><BuyButton id={firstProduct.id} enabled={isProductEnabled(firstProduct)}/></div>
          <Link className="underlined-link" href="/criar">Experimentar prévia gratuita →</Link>
        </div>
      </div>
    </section>

    <section className="niche-section shell" id="nichos"><div className="section-heading"><div><span className="eyebrow">ADAPTÁVEL POR SEGMENTO</span><h2>O mesmo motor.<br/><i>Outras rotinas.</i></h2></div><p>Os exemplos abaixo são fluxos conversacionais, não substituem um CRM, prontuário ou agenda integrados.</p></div><div className="niche-grid">{niches.map((niche) => <article className="niche-card" key={niche.id}><div className={`niche-symbol ${niche.accent}`}><span>{niche.initials}</span><span>↗</span></div><span className="product-tag">SMEZI / {niche.short}</span><h3>{niche.name}</h3><p>{niche.description}</p><div className="niche-flows">{niche.workflows.map(f => <span key={f}>{f}</span>)}</div><Link href="/criar">Personalizar prévia <span>↗</span></Link></article>)}</div></section>

    <section className="method shell" id="metodo"><div className="section-heading"><div><span className="eyebrow">SEM COMPLICAÇÃO</span><h2>Compre. Configure.<br/><i>Use.</i></h2></div><p>Sem precisar contratar uma implementação manual para receber seu primeiro sistema conversacional.</p></div><div className="method-grid"><div><span>01 /</span><h3>Escolha seu nicho</h3><p>Um pacote com processos de atendimento, propostas e comunicação adaptáveis ao seu tipo de negócio.</p></div><div><span>02 /</span><h3>Personalize</h3><p>Responda às perguntas sobre serviços, regras e linguagem. A IA completa o contexto com você.</p></div><div><span>03 /</span><h3>Ative em sua IA</h3><p>Adicione as instruções e arquivos em um Projeto ChatGPT ou Claude, ou em um Gem do Gemini.</p></div></div>
      <p className="method-caution">* A ativação depende dos recursos disponíveis na conta do comprador. A SMEZI não controla preços, limites nem condições de uso das plataformas terceiras.</p>
    </section>

    <section className="closing shell"><span>AI SELF—PAY / BY SMEZI</span><h2>Menos ferramentas.<br/><i>Mais autonomia.</i></h2><Link href="/criar">Testar o AI Office agora ↗</Link></section>
  </main>;
}

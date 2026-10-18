"use client";

import { useMemo, useState } from "react";
import {
  AiPlatform, blankProfile, installationSteps, makeDemoInstructions,
  niches, OfficeProfile, platformLabels,
} from "@/lib/office";

const allPlatforms: AiPlatform[] = ["chatgpt", "gemini", "claude"];

function TextField({ label, value, onChange, placeholder, multiline = false, hint }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  hint?: string;
}) {
  return <label className="office-field">
    <span>{label}</span>
    {multiline ? <textarea rows={3} maxLength={480} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
      : <input maxLength={120} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />}
    {hint && <small>{hint}</small>}
  </label>;
}

export default function OfficeBuilder() {
  const [profile, setProfile] = useState<OfficeProfile>(blankProfile);
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<AiPlatform>("chatgpt");
  const [copyMessage, setCopyMessage] = useState("");
  const niche = niches.find((item) => item.id === profile.nicheId) || niches[0];
  const currentPreview = useMemo(() => makeDemoInstructions(profile, platform), [profile, platform]);
  const canAdvance = profile.businessName.trim().length >= 2 && profile.services.trim().length >= 4;

  function update<K extends keyof OfficeProfile>(key: K, value: OfficeProfile[K]) {
    setProfile(previous => ({ ...previous, [key]: value }));
    setCopyMessage("");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(currentPreview);
      setCopyMessage("Prévia copiada. Abra sua IA e cole nas instruções do espaço selecionado.");
    } catch {
      setCopyMessage("Seu navegador bloqueou a cópia. Selecione o texto da prévia e copie manualmente.");
    }
  }

  function downloadDemo() {
    const text = currentPreview;
    const file = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `SMEZI-AI-OFFICE-DEMO-${platform}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopyMessage("Arquivo de demonstração gerado no navegador.");
  }

  return <div className="office-builder">
    <div className="wizard-top">
      <div><span className="eyebrow">PERSONALIZADOR · VERSÃO DEMO</span><h2>Configure sua prévia.</h2></div>
      <span className="wizard-counter">0{step + 1} <span>/ 03</span></span>
    </div>
    <div className="wizard-progress" aria-label={`Etapa ${step + 1} de 3`}>
      {[0, 1, 2].map(index => <div key={index} className={index <= step ? "on" : ""} />)}
    </div>
    {step === 0 && <div className="wizard-body">
      <h3>Qual é o tipo de negócio?</h3>
      <p>Um mesmo motor de IA, ajustado aos fluxos de trabalho de cada segmento.</p>
      <div className="niche-select-grid">
        {niches.map(item => <button type="button" className={`niche-choice ${profile.nicheId === item.id ? "selected" : ""}`} key={item.id} onClick={() => update("nicheId", item.id)} aria-pressed={profile.nicheId === item.id}>
          <span className={`niche-choice-mark ${item.accent}`}>{item.initials}</span>
          <span className="niche-choice-text"><strong>{item.name}</strong><small>{item.description}</small></span>
          <span className="choice-indicator">{profile.nicheId === item.id ? "●" : "○"}</span>
        </button>)}
      </div>
      <div className="wizard-actions"><span>6 segmentos disponíveis nesta demonstração.</span><button className="primary-link" type="button" onClick={() => setStep(1)}>Continuar <span>→</span></button></div>
    </div>}
    {step === 1 && <div className="wizard-body">
      <h3>Vamos conhecer sua empresa.</h3>
      <p>Essas informações ficam nesta sessão do navegador e não são enviadas aos nossos servidores nesta demonstração.</p>
      <div className="office-form-grid">
        <TextField label="Nome do negócio *" value={profile.businessName} onChange={v => update("businessName", v)} placeholder="Ex.: Espaço Aurora" />
        <label className="office-field"><span>Tom de comunicação</span><select value={profile.tone} onChange={e => update("tone", e.target.value as OfficeProfile["tone"])}><option value="claro">Claro e profissional</option><option value="elegante">Elegante</option><option value="acolhedor">Acolhedor</option><option value="objetivo">Objetivo e direto</option></select></label>
        <TextField label="Serviços principais *" value={profile.services} onChange={v => update("services", v)} placeholder={niche.suggestedServices} multiline />
        <TextField label="Seu público" value={profile.audience} onChange={v => update("audience", v)} placeholder="Ex.: empresas locais e pequenos empreendedores" multiline />
        <TextField label="Descrição do negócio" value={profile.about} onChange={v => update("about", v)} placeholder="O que torna seu atendimento diferente?" multiline />
        <TextField label="Política comercial" value={profile.prices} onChange={v => update("prices", v)} placeholder="Ex.: orçamento após avaliação, sem informar valores sem aprovação" multiline />
        <div className="office-wide"><TextField label="Regras e limites" value={profile.rules} onChange={v => update("rules", v)} placeholder="Ex.: nunca prometer disponibilidade; confirmar prazo com a equipe" multiline hint="Não insira nomes de clientes, senhas nem dados sensíveis nesta prévia." /></div>
      </div>
      <div className="wizard-actions"><button type="button" className="back-link" onClick={() => setStep(0)}>← Voltar</button><button type="button" className="primary-link" disabled={!canAdvance} onClick={() => { setStep(2); setCopyMessage(""); }}>Gerar prévia <span>↗</span></button></div>
      {!canAdvance && <p className="validation-note">Informe o nome da empresa e ao menos um serviço para continuar.</p>}
    </div>}
    {step === 2 && <div className="wizard-body">
      <div className="preview-heading"><div><span className="preview-ready-dot" /> PRÉVIA GERADA</div><h3>{profile.businessName} <span>× SMEZI AI Office</span></h3><p>Escolha a plataforma para adaptar as instruções da demonstração.</p></div>
      <div className="platform-tabs" role="group" aria-label="Escolha a plataforma de IA">
        {allPlatforms.map(item => <button type="button" key={item} className={platform === item ? "active" : ""} onClick={() => { setPlatform(item); setCopyMessage(""); }} aria-pressed={platform === item}>{platformLabels[item]}</button>)}
      </div>
      <div className="preview-grid"><div className="preview-console"><div className="console-head"><span>INSTRUÇÕES · {platform.toUpperCase()}</span><span>DEMO / READ-ONLY</span></div><pre>{currentPreview}</pre></div>
        <aside className="installation-card"><span className="eyebrow">ATIVAÇÃO MANUAL</span><h4>{platformLabels[platform]}</h4><ol>{installationSteps[platform].map(item => <li key={item}>{item}</li>)}</ol><div className="info-note">Não é um aplicativo instalado com um clique. O comprador usa os recursos e as condições da própria plataforma de IA.</div></aside>
      </div>
      <div className="wizard-actions wizard-actions-preview"><button type="button" className="back-link" onClick={() => setStep(1)}>← Editar respostas</button><div className="preview-buttons"><button type="button" className="button-outline" onClick={copy}>Copiar instruções</button><button type="button" className="primary-link" onClick={downloadDemo}>Baixar demo .md <span>↓</span></button></div></div>
      {copyMessage && <p className="copy-notice" role="status">{copyMessage}</p>}
      <div className="paid-note"><strong>O que muda na versão comercial?</strong><p>O pacote comprado terá onboarding guiado, módulos completos do nicho, biblioteca de comandos, modelos de propostas e manuais de ativação. A demonstração acima contém apenas três rotinas resumidas.</p><span>Produto completo: R$ 297 · pagamentos ainda desativados</span></div>
    </div>}
  </div>;
}

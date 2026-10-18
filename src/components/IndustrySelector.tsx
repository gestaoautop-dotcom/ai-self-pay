"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { type IndustryOption, industryCatalogCount, normalizeSearch, searchIndustries } from "@/lib/industry-catalog";

type Props = {
  value: string;
  selectionCode: string;
  onInput: (value: string) => void;
  onSelect: (industry: IndustryOption) => void;
};

const POPULAR = ["Padaria", "Imobiliária", "Clínica de estética", "Pet shop", "Loja de roupas", "Barbearia", "Restaurante", "Oficina mecânica"];

export default function IndustrySelector({ value, selectionCode, onInput, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [limit, setLimit] = useState(12);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const matches = useMemo(() => searchIndustries(value, limit), [value, limit]);
  const query = value.trim();
  const custom = query.length >= 2 && !matches.some(item => normalizeSearch(item.name) === normalizeSearch(query));
  const count = matches.length + (custom ? 1 : 0);
  const active = Math.min(activeIndex, Math.max(0, count - 1));

  useEffect(() => {
    function closeOnOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, []);

  function type(value: string) {
    onInput(value);
    setOpen(true);
    setActiveIndex(0);
    setLimit(12);
  }

  function choose(item: IndustryOption) {
    onSelect(item);
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function chooseCustom() {
    onInput(query);
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function keyboard(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" || event.key === "Tab") { setOpen(false); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (!count) return;
      setActiveIndex(index => event.key === "ArrowDown" ? (index + 1) % count : (index + count - 1) % count);
    }
    if (event.key === "Enter" && open) {
      event.preventDefault();
      if (active < matches.length) choose(matches[active]);
      else if (custom) chooseCustom();
    }
  }

  return <div className="industry-selector" ref={rootRef}>
    <div className="industry-search-area">
      <label htmlFor="industry-search" className="industry-label">PESQUISE O SEGMENTO DO SEU NEGÓCIO</label>
      <div className={"industry-search-box" + (open ? " is-open" : "")}>
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7.1"/><path d="m16 16 5 5"/></svg>
        <input
          ref={inputRef}
          id="industry-search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && count > 0 ? listId + "-option-" + active : undefined}
          aria-describedby="industry-hint"
          type="search"
          placeholder="Ex.: padaria, imobiliária, veterinária, tecnologia..."
          value={value}
          maxLength={120}
          autoComplete="off"
          onChange={event => type(event.target.value)}
          onFocus={() => { setOpen(true); setActiveIndex(0); }}
          onKeyDown={keyboard}
        />
        {query && <button type="button" className="industry-clear" aria-label="Limpar busca" onClick={() => { type(""); inputRef.current?.focus(); }}>×</button>}
      </div>
      <div className="industry-subline" id="industry-hint">
        <span><strong>{industryCatalogCount.toLocaleString("pt-BR")}</strong> atividades e segmentos disponíveis</span>
        <span>CNAE · ISIC Rev. 5 · nomes populares</span>
      </div>
      {open && <div className="industry-dropdown" id={listId} role="listbox" aria-label="Sugestões de segmentos">
        <div className="industry-dropdown-caption">{query ? "RESULTADOS PARA SUA BUSCA" : "SEGMENTOS POPULARES"}<span>↑↓ navegar · Enter escolher</span></div>
        {matches.map((item, index) => <button
          type="button" role="option" tabIndex={-1} key={item.id}
          id={listId + "-option-" + index}
          aria-selected={index === active}
          className={"industry-result" + (index === active ? " is-active" : "")}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => choose(item)}
        ><span className="industry-result-dot" aria-hidden="true"/><span className="industry-result-text"><strong>{item.name}</strong><small>{item.category}</small></span><span className="industry-result-source">{item.source === "Popular" ? "SEGMENTO" : item.source}</span></button>)}
        {custom && <button type="button" role="option" tabIndex={-1} id={listId + "-option-" + matches.length} aria-selected={active === matches.length} className={"industry-result industry-result-custom" + (active === matches.length ? " is-active" : "")} onClick={chooseCustom}><span className="industry-custom-plus">+</span><span className="industry-result-text"><strong>Usar “{query}”</strong><small>Meu segmento não aparece na lista</small></span><span>↗</span></button>}
        {!matches.length && !custom && <p className="industry-empty">Descreva seu segmento para continuar.</p>}
        {query && matches.length === limit && limit < industryCatalogCount && <button type="button" className="industry-more" onClick={() => { setLimit(value => value + 20); setActiveIndex(0); }}>Mostrar mais resultados ↓</button>}
      </div>}
    </div>
    {!open && query && <div className="industry-selected" role="status"><span>✓</span> Segmento informado: <strong>{query}</strong>{selectionCode && <small>{selectionCode}</small>}</div>}
    <div className="industry-popular">
      <span>OU SELECIONE UMA OPÇÃO POPULAR</span>
      <div className="industry-popular-chips">{POPULAR.map(name => <button type="button" key={name} aria-pressed={normalizeSearch(value) === normalizeSearch(name)} onClick={() => { const option = searchIndustries(name, 1)[0]; if (option) choose(option); }}>{name} <span>↗</span></button>)}</div>
    </div>
    <p className="industry-help">Não encontrou sua atividade? Digite qualquer segmento — mesmo que ele não apareça no catálogo — e continue a personalização.</p>
  </div>;
}

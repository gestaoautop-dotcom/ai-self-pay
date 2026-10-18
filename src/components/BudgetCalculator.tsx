"use client";
import { useState } from "react";

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

export default function BudgetCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [price, setPrice] = useState(197);
  const [variable, setVariable] = useState(5);
  const [fee, setFee] = useState(5);
  const [sales, setSales] = useState(0);
  const perSale = price * (1 - fee / 100) - variable;
  const needed = perSale > 0 ? Math.ceil(monthly / perSale) : null;
  const contribution = Math.max(0, sales * perSale);
  const profit = sales * perSale - monthly;
  const progress = monthly > 0 ? Math.min(100, contribution / monthly * 100) : 100;
  return <div className="calculator">
    <div className="calculator-stats">
      <div><span>CUSTO MENSAL</span><strong>{money(monthly)}</strong></div>
      <div><span>CONTRIBUIÇÃO DA SIMULAÇÃO</span><strong>{money(contribution)}</strong></div>
      <div><span>RESULTADO SIMULADO</span><strong className={profit >= 0 ? "green" : "red"}>{money(profit)}</strong></div>
    </div>
    <div className="progress-head"><span>Cobertura das mensalidades</span><b>{Math.round(progress)}%</b></div>
    <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
    <div className="calc-grid">
      <label>Custo mensal total de IA <input type="number" min="0" max="1000000" step="100" value={monthly} onChange={e => setMonthly(Math.max(0, Number(e.target.value) || 0))} /></label>
      <label>Preço por produto <input type="number" min="1" max="100000" step="1" value={price} onChange={e => setPrice(Math.max(1, Number(e.target.value) || 1))} /></label>
      <label>Custo variável por venda <input type="number" min="0" max="100000" step="1" value={variable} onChange={e => setVariable(Math.max(0, Number(e.target.value) || 0))} /></label>
      <label>Taxa de pagamento (%) <input type="number" min="0" max="99" step="0.5" value={fee} onChange={e => setFee(Math.max(0, Math.min(99, Number(e.target.value) || 0)))} /></label>
      <label>Vendas mensais hipotéticas <input type="number" min="0" max="100000" step="1" value={sales} onChange={e => setSales(Math.max(0, Math.floor(Number(e.target.value) || 0)))} /></label>
    </div>
    <div className="calc-outcome"><span>Vendas para cobrir as assinaturas</span><strong>{needed ?? "—"}</strong><p>{needed === null ? "Com esses custos, cada venda gera contribuição nula ou negativa." : `Meta aproximada de ${Math.ceil(needed / 4)} por semana · contribuição de ${money(perSale)} por venda.`}</p></div>
    <p className="calculator-note">Esta é uma simulação sem pedidos reais. Impostos, anúncios, estornos, assinaturas adicionais e remuneração do trabalho ainda não foram incluídos.</p>
  </div>;
}

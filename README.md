# AI SELF-PAY · SMEZI AI SYSTEMS

Loja demonstrativa para **sistemas conversacionais portáteis**, adaptáveis por nicho, com compra única e ativação manual em plataformas de IA que o cliente já utiliza. Uma realização independente de Caroline Wilhelm × SMEZI.

## Situação atual

- ✅ Site comercial demonstrativo e configurador funcional de prévia, com seis segmentos.
- ✅ Rotinas de demonstração específicas para ChatGPT Projetos, Gemini Gems e Claude Projetos.
- ✅ Formulário local de personalização (sem envio dos dados desta página a um servidor ou LLM).
- ✅ Cópia/download local da prévia Markdown (gratuita, limitada).
- ✅ Painel de simulação da meta mensal de R$ 5.000 (não são vendas reais).
- ✅ Código para checkout Stripe, webhooks verificados e entrega via Supabase Storage privado.
- ⛔ Checkout desabilitado (`ENABLE_CHECKOUT=false`). **Não há venda, entrega paga ou assinatura ativa.**
- ⛔ Pacote **comercial completo** deve ser enviado a `digital-products/smezi-ai-office-v1.zip` no Supabase Storage **privado** antes de vender. Nunca comitar no GitHub público.
- ⛔ Não há conexão OAuth, instalação com um clique, CRM real, agendamento, envio de mensagens, banco de clientes ou leitura do conteúdo das contas de IA.

## Produto 001 — SMEZI AI Office

- **Preço sugerido de teste:** R$ 297, compra única.
- **Entrega:** arquivo ZIP privado, obtido após pagamento confirmado.
- **Instalação:** o próprio cliente configura Projeto do ChatGPT, Gem do Gemini ou Projeto Claude, conforme funcionalidades de sua conta. Não usamos senhas ou tokens da conta do cliente.
- **Contexto:** negócio, serviços, público, preços/regras comerciais e tom de voz.
- **Rotinas:** triagem de demanda, propostas, atendimento e fluxos especializados de cada segmento.
- **Limites:** assistente **conversacional**. Não substitui ERP/CRM ou ferramentas médicas/financeiras, não armazena dados de clientes permanentemente e não executa ações externas por conta própria.

Segmentos na V1: imobiliárias, clínicas de estética, oficinas automotivas, salões de beleza, agências de marketing e prestadores de serviços.

## Stack

Next.js 15 / React 19 / TypeScript. Integração server-side de Stripe, Supabase e Resend opcional. O fluxo demonstrativo funciona sem credenciais de API.

```bash
npm install
cp .env.example .env.local
npm run dev
npm run typecheck
npm run build
```

## Rotas

| Rota | Função |
|---|---|
| `/` | Vitrine AI Office e seis segmentos |
| `/criar` | Personalizador de prévia com instruções por plataforma |
| `/painel` | Simulador de ponto de equilíbrio (dados fictícios) |
| `/api/checkout` | Sessão Stripe, desativada por padrão |
| `/api/stripe-webhook` | Evento Stripe verificado e pedido salvo |
| `/api/order-status` | Confirma sessão paga e cria URL temporária no Storage |
| `/sucesso` | Status pós-pagamento e link de download |
| `/cancelado` | Cancelamento |

## Preparação para pagamentos reais

1. Manter o repositório livre de credenciais e arquivos pagos; usar ambiente na Vercel e bucket **privado** no Supabase.
2. Criar o produto de pagamento único **SMEZI AI Office**, preço R$ 297, em modo teste na Stripe; informar o Price ID em `STRIPE_PRICE_AI_OFFICE`.
3. Executar `supabase/schema.sql` e criar bucket privado `digital-products`.
4. Subir o arquivo comercial real, licenciado e revisado como `smezi-ai-office-v1.zip` nesse bucket.
5. Configurar `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL` e, opcionalmente, Resend.
6. Configurar webhook assinado para `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`.
7. Testar pagamento aprovado, pendente, cancelado, contestado e estornado, entrega de arquivo, concorrência e erros de configuração; revisar autenticação e controles de abuso antes da ativação.
8. Apenas após passar nos testes mudar `ENABLE_CHECKOUT=true` no ambiente pretendido.

### Cuidados para lançamento

- Revisar política de privacidade/LGPD, termos de licença/reembolso e tributos.
- Proteger links de download contra compartilhamento; um `session_id` Stripe é um segredo de posse. Futuramente criar área do comprador com autenticação e controle de acesso.
- Adicionar idempotência transacional para notificações de e-mail e limitar taxa de requisições nas APIs.
- Verificar disponibilidade do conteúdo digital e integridade do ZIP antes de habilitar preço real.
- Não expor o painel real de receita sem autenticação. O painel atual é público e **simulado**.
- Lembrar que plataformas terceiras alteram planos, interfaces, limites e políticas independentemente da SMEZI.
- A Vercel pode ser acessível publicamente, mas o site permanece `noindex` durante o pré-lançamento.

## Economia do projeto

Custo mensal informado pela proprietária: **R$ 5.000**. O simulador aceita ticket, custo variável e tarifa. A margem gerada por vendas deve cobrir os custos fixos, impostos, marketing e devoluções; nenhuma meta de vendas é garantia de retorno.

## Estrutura do conteúdo comercial

A versão **comercial** do AI Office é entregue como um ZIP apartado do código do site e armazenado no bucket privado. Contém instaladores textuais por plataforma, onboarding, regras, processos por nicho, prompts de uso, modelos de resposta, guia de segurança e licença de uso. Não publique esses arquivos neste repositório público.

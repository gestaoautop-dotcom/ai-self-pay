# AI SELF-PAY — Caroline Wilhelm × SMEZI

MVP independente para comercializar produtos digitais com pagamento único e entrega automatizada. Planejado para integrar futuramente ao site pessoal e ao ecossistema SMEZI, **sem alterar os projetos existentes**.

> **Situação deste pacote:** código inicial preparado para publicação no GitHub, SEM domínio próprio, SEM chaves reais, SEM produtos comerciais finais e SEM vendas reais. O checkout permanece desativado por padrão.

## O que já existe no código

- Landing page responsiva e catálogo demonstrativo de 3 produtos.
- Painel de simulação para o custo mensal de IA de **R$ 5.000**, preços, taxas e margem.
- Endpoint de criação de sessão Stripe Checkout (compra única, servidor).
- Webhook com verificação de assinatura Stripe e registro de pedidos no Supabase.
- Tratamento básico de reembolso por `charge.refunded`.
- Página pós-compra que confere pagamento com Stripe antes de gerar URL temporária para arquivo privado no Supabase Storage.
- E-mail transacional opcional via Resend (link para a página pós-compra).
- Produtos e pagamentos desativados até configuração e validação finais.

## Estrutura

```text
src/app/
  page.tsx                  loja e catálogo
  painel/page.tsx           simulador público de exemplo (SEM dados reais)
  sucesso/page.tsx          verificação e download após pagamento
  cancelado/page.tsx        checkout cancelado
  api/checkout/route.ts     cria sessão com preço configurado no servidor
  api/stripe-webhook/route.ts verifica assinatura e persiste pedidos
  api/order-status/route.ts valida sessão e gera link temporário
src/lib/catalog.ts         catálogo e arquivos correspondentes
src/lib/services.ts        acesso seguro a Stripe e Supabase
supabase/schema.sql        tabela de pedidos privada (RLS)
produto-demo/              espaço para protótipos, não publicar como produto final
```

## Repositório GitHub

Repositório: https://github.com/gestaoautop-dotcom/ai-self-pay

**Atenção:** o repositório foi criado como **público** no GitHub. Não enviar chaves reais, `.env.local`, arquivos comerciais privados, dados pessoais ou segredos. A visibilidade pode ser alterada nas configurações do repositório pelo proprietário.

Para publicar alterações futuras, utilize o fluxo GitHub/Vercel ou um `git push` autorizado. O projeto é independente de outros repositórios.

## Executar localmente

Requer Node.js 20+ e npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000. **Não precisa de chaves para visualizar a vitrine e o painel demo.**

## Preparar o checkout real

1. Configure um projeto Stripe e crie três produtos com **preços únicos em BRL** correspondentes ao catálogo. Os valores na interface devem ser exatamente os preços configurados na Stripe: R$ 197, R$ 97 e R$ 147, respectivamente. Defina seus Price IDs nas variáveis `STRIPE_PRICE_*`.
2. Crie um projeto Supabase e execute `supabase/schema.sql` no SQL Editor.
3. Crie um bucket Storage **privado** chamado `digital-products`.
4. Produza os ZIPs comerciais reais e carregue no bucket com os nomes definidos em `src/lib/catalog.ts` (`assetPath`). Não exponha os arquivos pagos em `/public`.
5. Configure `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` **somente no servidor**, usando segredos de ambiente.
6. Configure `STRIPE_SECRET_KEY` em modo teste primeiro.
7. Configure webhook Stripe para `https://SEU_DOMINIO/api/stripe-webhook` e assine os eventos `checkout.session.completed`, `checkout.session.async_payment_succeeded` e `charge.refunded`. Defina `STRIPE_WEBHOOK_SECRET`.
8. Opcionalmente configure `RESEND_API_KEY` e `RESEND_FROM_EMAIL` com um domínio de envio verificado. Sem Resend, o comprador recebe o link de download pela página de sucesso, não por e-mail.
9. Configure `NEXT_PUBLIC_APP_URL=https://SEU_DOMINIO` na Vercel, sem barra final.
10. Execute compra Stripe de teste, confirmação, webhook, reembolso, download e e-mail (se ativado).
11. **Somente após validar todo o fluxo**, altere `ENABLE_CHECKOUT=true` no ambiente desejado.

### Segurança e pontos a concluir antes do lançamento público

- As chaves Secret e Service Role jamais devem ser enviadas ao GitHub, expostas no navegador ou passadas como `NEXT_PUBLIC_`.
- Quem conhece o ID da sessão de pagamento consegue gerar novo link temporário do produto após confirmação. Trate esse link como privado; futura área do cliente com autenticação é recomendada.
- O webhook é idempotente no registro de pedidos por `stripe_session_id`, mas o disparo de e-mail pode duplicar em condições raras de concorrência; implementar fila transacional antes de operar em escala.
- Adicionar limitação de requisições e proteção antiabuso em endpoints públicos antes de divulgar amplamente.
- Refinar cancelamentos, disputas e reembolsos parciais para sincronizar direito de acesso.
- Criar página de privacidade/LGPD, termos de uso, política de reembolso, suporte e regras fiscais conforme orientação profissional.
- O painel `/painel` é **somente um simulador**, aberto e sem dados de clientes. Um painel real de pedidos **precisa de autenticação e permissões administrativas** antes de existir.
- Não há nenhuma estimativa de vendas garantida. O ponto de equilíbrio deve descontar custos de pagamento, produção, anúncios, impostos e outras despesas.
- O projeto não está conectado automaticamente ao site pessoal nem ao repositório SMEZI. Fazer essa integração após validar o MVP.

## Modelo financeiro inicial

- Mensalidades de IA: **R$ 5.000** (valor informado).
- Exemplo: kit de R$ 197, taxa ilustrativa de 5% + custo variável de R$ 5 por venda.
- Contribuição simulada: **R$ 182,15** por venda.
- Ponto de equilíbrio simulado: **28 vendas por mês**, antes de impostos, marketing, estornos e demais despesas.

## Desenvolvimento e publicação

Desenvolvimento planejado em Next.js e TypeScript. Conectar este repositório no Vercel para publicação. Ambiente de homologação (preview) primeiro; não apontar domínio do site pessoal até confirmação.

Este pacote foi preparado sem execução de `npm install` ou `next build` porque o ambiente de criação não teve acesso à rede npm; **a compilação precisa ser validada em uma máquina com acesso às dependências**.

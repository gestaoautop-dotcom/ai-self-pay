-- Rode no SQL Editor do Supabase. Nunca publique a SERVICE_ROLE_KEY.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  product_id text not null,
  customer_email text,
  amount_total integer not null check (amount_total >= 0),
  currency text not null default 'brl',
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_payment_intent_idx on public.orders(stripe_payment_intent_id);
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
-- O servidor opera exclusivamente com a chave service_role.
-- Crie manualmente um bucket PRIVADO chamado digital-products no Storage.

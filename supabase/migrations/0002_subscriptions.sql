-- Ballpark — subscriptions / Pro entitlement (Dodo Payments)
-- Run in Supabase → SQL Editor after 0001_init.sql.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free',              -- 'free' | 'pro'
  status text not null default 'inactive',         -- Dodo status: active, on_hold, cancelled, expired, failed, ...
  dodo_customer_id text,
  dodo_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_dodo_sub_idx
  on public.subscriptions (dodo_subscription_id);

alter table public.subscriptions enable row level security;

-- Users may read ONLY their own subscription (to show Pro status / gate the UI).
create policy "subscriptions: read own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- NOTE: there is deliberately no insert/update/delete policy for users.
-- Writes happen only from the Dodo webhook route on the server, using the
-- Supabase service-role key (which bypasses RLS). The service-role key is
-- SERVER-ONLY and must never be exposed to the browser or prefixed NEXT_PUBLIC_.

-- Ballpark initial schema (PRD Section 10.4)
-- Run in Supabase → SQL Editor → New query → Run.

-- PROFILES -----------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id);

-- auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ATTEMPTS -----------------------------------------------------------
create type public.question_category as enum ('revenue_profit','mathematical','market_sizing','unconventional');
create type public.difficulty_level  as enum ('easy','medium','challenging');
create type public.attempt_status    as enum ('in_progress','evaluated','abandoned');

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category public.question_category not null,
  difficulty public.difficulty_level not null,
  geography text not null default 'India',
  question text not null,
  clarifications jsonb not null default '[]',
  expected_answer_range text,
  key_drivers jsonb not null default '[]',
  source text not null default 'ai',            -- 'ai' | 'bank'
  answer_html text,
  answer_text text,
  time_spent_seconds int,
  status public.attempt_status not null default 'in_progress',
  score int check (score between 0 and 10),
  rubric jsonb,
  feedback jsonb,                               -- full evaluation JSON
  helpful boolean,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  evaluated_at timestamptz
);

create index attempts_user_created_idx on public.attempts (user_id, created_at desc);

alter table public.attempts enable row level security;

create policy "attempts: read own"   on public.attempts for select using (auth.uid() = user_id);
create policy "attempts: insert own" on public.attempts for insert with check (auth.uid() = user_id);
create policy "attempts: update own" on public.attempts for update using (auth.uid() = user_id);

-- USAGE (daily limits) ------------------------------------------------
create table public.usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default (now() at time zone 'Asia/Kolkata')::date,
  generations int not null default 0,
  evaluations int not null default 0,
  primary key (user_id, day)
);

alter table public.usage_daily enable row level security;
create policy "usage: read own" on public.usage_daily for select using (auth.uid() = user_id);
-- writes happen server-side through the increment function below

create or replace function public.increment_usage(kind text, max_allowed int)
returns boolean language plpgsql security definer set search_path = public as $$
declare current_count int;
begin
  insert into public.usage_daily (user_id) values (auth.uid())
  on conflict (user_id, day) do nothing;

  if kind = 'generation' then
    update public.usage_daily set generations = generations + 1
     where user_id = auth.uid() and day = (now() at time zone 'Asia/Kolkata')::date
       and generations < max_allowed
     returning generations into current_count;
  else
    update public.usage_daily set evaluations = evaluations + 1
     where user_id = auth.uid() and day = (now() at time zone 'Asia/Kolkata')::date
       and evaluations < max_allowed
     returning evaluations into current_count;
  end if;

  return current_count is not null;   -- false = limit reached
end; $$;

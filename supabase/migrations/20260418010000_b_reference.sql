-- Migration B — Reference data
-- Countries, public holidays, tax forms, FX pairs.
-- These tables are readable by anyone authenticated; no RLS needed.

create table public.countries (
  id uuid primary key default gen_random_uuid(),
  iso_code text not null unique check (length(iso_code) = 2),
  name text not null,
  currency text not null check (length(currency) = 3),
  tax_authority text not null,
  timezone text not null,
  filing_forms jsonb not null default '[]'::jsonb,
  flag_emoji text,
  cycle_cutoff_day integer not null check (cycle_cutoff_day between 1 and 31),
  ach_lag_days integer not null default 2,
  created_at timestamptz not null default now()
);
create index idx_countries_iso on public.countries(iso_code);

create table public.public_holidays (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries(id) on delete cascade,
  holiday_date date not null,
  name text not null,
  holiday_type text not null default 'public',
  created_at timestamptz not null default now(),
  unique (country_id, holiday_date)
);
create index idx_holidays_country_date on public.public_holidays(country_id, holiday_date);

create table public.tax_forms (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries(id) on delete cascade,
  form_code text not null,
  form_name text not null,
  frequency text not null check (frequency in ('monthly','quarterly','annual','per_event')),
  due_rule jsonb not null default '{}'::jsonb,
  penalty_structure jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (country_id, form_code)
);

create table public.fx_pairs (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null check (length(base_currency) = 3),
  quote_currency text not null check (length(quote_currency) = 3),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (base_currency, quote_currency)
);

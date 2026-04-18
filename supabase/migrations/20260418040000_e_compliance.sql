-- Migration E — Compliance
-- Statutory filings tracker (EMP201, EMP501, P60, P11D, W-2, 941, 940, etc.)

create table public.filings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  country_id uuid not null references public.countries(id),
  form_code text not null,
  period_start date not null,
  period_end date not null,
  due_date date not null,
  status text not null default 'not_started' check (status in (
    'not_started','prepared','submitted','confirmed','penalty'
  )),
  submitted_at timestamptz,
  confirmation_ref text,
  penalty_amount numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_filings_due_date on public.filings(due_date);
create index idx_filings_status on public.filings(status);
create index idx_filings_org_country on public.filings(organization_id, country_id);

create trigger touch_filings before update on public.filings
  for each row execute procedure public.touch_updated_at();

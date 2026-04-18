-- Migration D — Payroll operations
-- Cycles (monthly per country), runs (regular/off-cycle), line items (per employee).

create table public.payroll_cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  country_id uuid not null references public.countries(id),
  cycle_month date not null,
  cutoff_at timestamptz not null,
  scheduled_pay_at timestamptz not null,
  status text not null default 'planned' check (status in (
    'planned','inputs_open','cutoff','posting','reconciling',
    'approved','paid','closed'
  )),
  total_gross_amount numeric(14,2),
  total_net_amount numeric(14,2),
  employee_count integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, country_id, cycle_month)
);
create index idx_cycles_status on public.payroll_cycles(status);
create index idx_cycles_country_month on public.payroll_cycles(country_id, cycle_month desc);

create trigger touch_cycles before update on public.payroll_cycles
  for each row execute procedure public.touch_updated_at();

create table public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.payroll_cycles(id) on delete cascade,
  run_type text not null check (run_type in ('regular','off_cycle')),
  run_date date not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index idx_runs_cycle on public.payroll_runs(cycle_id);

create table public.payroll_line_items (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.payroll_runs(id) on delete cascade,
  employee_id uuid not null references public.employees(id),
  gross numeric(12,2) not null,
  tax_withheld numeric(12,2) not null default 0,
  social_contributions numeric(12,2) not null default 0,
  other_deductions numeric(12,2) not null default 0,
  net numeric(12,2) not null,
  currency text not null check (length(currency) = 3),
  fx_rate_applied numeric(14,8),
  notes jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_line_items_run_employee on public.payroll_line_items(run_id, employee_id);
create index idx_line_items_employee on public.payroll_line_items(employee_id);

-- Migration F — Automation feature tables
-- 10 tables powering the 5 signature innovations:
--   Input Parser, FX Watchdog, Variance Narrator,
--   Termination Checklist Bot, Calendar Sentinel.

-- ─── Input Parser (NP-01) ──────────────────────────────────
create table public.input_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source text not null check (source in ('email','slack','whatsapp')),
  sender text not null,
  received_at timestamptz not null,
  raw_text text not null,
  raw_metadata jsonb default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','parsed','dismissed')),
  created_at timestamptz not null default now()
);
create index idx_input_messages_status on public.input_messages(status, received_at desc);
create index idx_input_messages_org on public.input_messages(organization_id, received_at desc);

create table public.input_parse_results (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.input_messages(id) on delete cascade,
  parsed_fields jsonb not null,
  ambiguity_flags jsonb default '[]'::jsonb,
  confidence_overall numeric(3,2),
  status text not null default 'awaiting_approval' check (status in (
    'awaiting_approval','approved','rejected'
  )),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_parse_results_message on public.input_parse_results(message_id);
create index idx_parse_results_status on public.input_parse_results(status);

-- ─── FX Watchdog (NP-02) ───────────────────────────────────
create table public.fx_rates (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid not null references public.fx_pairs(id),
  rate_date date not null,
  mid_market_rate numeric(14,8) not null,
  provider_applied_rate numeric(14,8),
  spread_bps integer,
  source text not null default 'exchangerate-api',
  created_at timestamptz not null default now(),
  unique (pair_id, rate_date, source)
);
create index idx_fx_rates_pair_date on public.fx_rates(pair_id, rate_date desc);

create table public.fx_leakage (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.payroll_cycles(id) on delete cascade,
  pair_id uuid not null references public.fx_pairs(id),
  cycle_leakage_amount numeric(12,2) not null,
  ytd_leakage_amount numeric(12,2) not null,
  created_at timestamptz not null default now(),
  unique (cycle_id, pair_id)
);

-- ─── Variance Narrator (NP-06) ─────────────────────────────
create table public.variances (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.payroll_cycles(id) on delete cascade,
  country_id uuid not null references public.countries(id),
  line_item_id uuid references public.payroll_line_items(id),
  variance_amount numeric(12,2) not null,
  variance_pct numeric(6,2) not null,
  threshold_crossed boolean not null default false,
  cause_category text check (cause_category in (
    'headcount','rate','fx','statutory','bonus','unexplained'
  )),
  narration_text text,
  narration_model text,
  narration_tokens integer,
  flagged_for_review boolean not null default false,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index idx_variances_cycle on public.variances(cycle_id);
create index idx_variances_country on public.variances(country_id, created_at desc);

-- ─── Termination Checklist (NP-20, NP-07) ──────────────────
create table public.terminations (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  termination_type text not null check (termination_type in (
    'voluntary','involuntary','deceased'
  )),
  notice_date date not null,
  last_working_day date not null,
  jurisdiction_rules_version text not null default '2026-04',
  final_pay_deadline date,
  status text not null default 'pending' check (status in (
    'pending','in_progress','complete'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_terminations_employee on public.terminations(employee_id);
create index idx_terminations_status on public.terminations(status);

create trigger touch_terminations before update on public.terminations
  for each row execute procedure public.touch_updated_at();

create table public.termination_checklist_items (
  id uuid primary key default gen_random_uuid(),
  termination_id uuid not null references public.terminations(id) on delete cascade,
  item_type text not null check (item_type in (
    'final_pay','cobra','pension_dereg','pto_payout',
    'garnishment_release','tax_certificate','direct_deposit_block','other'
  )),
  description text not null,
  statutory_deadline date,
  owner_role text not null check (owner_role in (
    'payroll','hr','finance','legal'
  )),
  status text not null default 'pending' check (status in (
    'pending','in_progress','done','blocked'
  )),
  evidence_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_checklist_term on public.termination_checklist_items(termination_id, position);

-- ─── Calendar Sentinel (NP-19, NP-10) ──────────────────────
create table public.calendar_conflicts (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references public.countries(id),
  cycle_id uuid references public.payroll_cycles(id) on delete cascade,
  conflict_date date not null,
  conflict_type text not null check (conflict_type in (
    'holiday_on_cutoff','timezone_cutoff_miss','approver_unavailable'
  )),
  severity text not null check (severity in ('info','warn','crit')),
  suggested_shift_date date,
  explanation text not null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_conflicts_country_date on public.calendar_conflicts(country_id, conflict_date);
create index idx_conflicts_unresolved on public.calendar_conflicts(severity, conflict_date) where resolved_at is null;

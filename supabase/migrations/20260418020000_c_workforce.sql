-- Migration C — Workforce
-- Employees and the event log that powers variance narration.

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  country_id uuid not null references public.countries(id),
  full_name text not null,
  email text not null,
  role_title text not null,
  start_date date not null,
  termination_date date,
  employment_type text not null check (employment_type in ('employee','contractor')),
  monthly_gross_amount numeric(12,2) not null,
  monthly_gross_currency text not null check (length(monthly_gross_currency) = 3),
  pay_schedule text not null default 'monthly',
  bank_iban_masked text,
  tax_id_masked text,
  status text not null default 'active' check (status in ('active','terminated','on_leave')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_employees_org_country on public.employees(organization_id, country_id);
create index idx_employees_status on public.employees(status);
create index idx_employees_email on public.employees(organization_id, email);

create trigger touch_employees before update on public.employees
  for each row execute procedure public.touch_updated_at();

create table public.employee_events (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  event_type text not null check (event_type in (
    'hire','termination','rate_change','bonus','address_change',
    'tax_code_change','leave_start','leave_end','bank_change'
  )),
  effective_date date not null,
  prior_value jsonb,
  new_value jsonb,
  submitted_by uuid references public.profiles(id),
  submitted_via text not null check (submitted_via in ('hris','input_parser','manual')),
  created_at timestamptz not null default now()
);
create index idx_events_employee on public.employee_events(employee_id, effective_date desc);
create index idx_events_type_date on public.employee_events(event_type, effective_date desc);

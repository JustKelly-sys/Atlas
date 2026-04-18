-- Migration RLS — Row-Level Security policies
-- Org-scoped access pattern: members read, admins write.
-- Reference tables remain readable by anyone authenticated.

-- ─── Helper functions ──────────────────────────────────────
create or replace function public.user_in_org(p_org uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = p_org and user_id = auth.uid()
  );
$$;

create or replace function public.user_is_admin(p_org uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = p_org and user_id = auth.uid()
    and role in ('owner','admin')
  );
$$;

-- ─── Enable RLS on all protected tables ────────────────────
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.employees enable row level security;
alter table public.employee_events enable row level security;
alter table public.payroll_cycles enable row level security;
alter table public.payroll_runs enable row level security;
alter table public.payroll_line_items enable row level security;
alter table public.filings enable row level security;
alter table public.input_messages enable row level security;
alter table public.input_parse_results enable row level security;
alter table public.fx_leakage enable row level security;
alter table public.variances enable row level security;
alter table public.terminations enable row level security;
alter table public.termination_checklist_items enable row level security;
alter table public.calendar_conflicts enable row level security;
alter table public.audit_log enable row level security;
alter table public.alerts enable row level security;

-- ─── profiles ──────────────────────────────────────────────
create policy "profiles: read self or org peer" on public.profiles
  for select using (
    id = auth.uid() or id in (
      select user_id from public.organization_members
      where organization_id in (
        select organization_id from public.organization_members where user_id = auth.uid()
      )
    )
  );
create policy "profiles: update self" on public.profiles
  for update using (id = auth.uid());

-- ─── organizations ─────────────────────────────────────────
create policy "orgs: members read" on public.organizations
  for select using (public.user_in_org(id));
create policy "orgs: admins update" on public.organizations
  for update using (public.user_is_admin(id));

-- ─── organization_members ──────────────────────────────────
create policy "members: read own org" on public.organization_members
  for select using (public.user_in_org(organization_id));
create policy "members: admins write" on public.organization_members
  for all using (public.user_is_admin(organization_id))
  with check (public.user_is_admin(organization_id));

-- ─── Direct org-scoped tables ──────────────────────────────
create policy "employees: members read" on public.employees
  for select using (public.user_in_org(organization_id));
create policy "employees: admins write" on public.employees
  for all using (public.user_is_admin(organization_id))
  with check (public.user_is_admin(organization_id));

create policy "cycles: members read" on public.payroll_cycles
  for select using (public.user_in_org(organization_id));
create policy "cycles: admins write" on public.payroll_cycles
  for all using (public.user_is_admin(organization_id))
  with check (public.user_is_admin(organization_id));

create policy "filings: members read" on public.filings
  for select using (public.user_in_org(organization_id));
create policy "filings: admins write" on public.filings
  for all using (public.user_is_admin(organization_id))
  with check (public.user_is_admin(organization_id));

create policy "input_messages: members read" on public.input_messages
  for select using (public.user_in_org(organization_id));
create policy "input_messages: admins write" on public.input_messages
  for all using (public.user_is_admin(organization_id))
  with check (public.user_is_admin(organization_id));

create policy "audit_log: members read" on public.audit_log
  for select using (public.user_in_org(organization_id));
create policy "audit_log: admins write" on public.audit_log
  for all using (public.user_is_admin(organization_id))
  with check (public.user_is_admin(organization_id));

create policy "alerts: members read" on public.alerts
  for select using (public.user_in_org(organization_id));
create policy "alerts: admins write" on public.alerts
  for all using (public.user_is_admin(organization_id))
  with check (public.user_is_admin(organization_id));

-- ─── Child tables (join through parent for org resolution) ─
create policy "events: members read" on public.employee_events
  for select using (exists (
    select 1 from public.employees e
    where e.id = employee_id and public.user_in_org(e.organization_id)
  ));
create policy "events: admins write" on public.employee_events
  for all using (exists (
    select 1 from public.employees e
    where e.id = employee_id and public.user_is_admin(e.organization_id)
  ));

create policy "runs: members read" on public.payroll_runs
  for select using (exists (
    select 1 from public.payroll_cycles c
    where c.id = cycle_id and public.user_in_org(c.organization_id)
  ));
create policy "runs: admins write" on public.payroll_runs
  for all using (exists (
    select 1 from public.payroll_cycles c
    where c.id = cycle_id and public.user_is_admin(c.organization_id)
  ));

create policy "line_items: members read" on public.payroll_line_items
  for select using (exists (
    select 1 from public.payroll_runs r
    join public.payroll_cycles c on c.id = r.cycle_id
    where r.id = run_id and public.user_in_org(c.organization_id)
  ));
create policy "line_items: admins write" on public.payroll_line_items
  for all using (exists (
    select 1 from public.payroll_runs r
    join public.payroll_cycles c on c.id = r.cycle_id
    where r.id = run_id and public.user_is_admin(c.organization_id)
  ));

create policy "parse_results: members read" on public.input_parse_results
  for select using (exists (
    select 1 from public.input_messages m
    where m.id = message_id and public.user_in_org(m.organization_id)
  ));
create policy "parse_results: admins write" on public.input_parse_results
  for all using (exists (
    select 1 from public.input_messages m
    where m.id = message_id and public.user_is_admin(m.organization_id)
  ));

create policy "fx_leakage: members read" on public.fx_leakage
  for select using (exists (
    select 1 from public.payroll_cycles c
    where c.id = cycle_id and public.user_in_org(c.organization_id)
  ));
create policy "fx_leakage: admins write" on public.fx_leakage
  for all using (exists (
    select 1 from public.payroll_cycles c
    where c.id = cycle_id and public.user_is_admin(c.organization_id)
  ));

create policy "variances: members read" on public.variances
  for select using (exists (
    select 1 from public.payroll_cycles c
    where c.id = cycle_id and public.user_in_org(c.organization_id)
  ));
create policy "variances: admins write" on public.variances
  for all using (exists (
    select 1 from public.payroll_cycles c
    where c.id = cycle_id and public.user_is_admin(c.organization_id)
  ));

create policy "terminations: members read" on public.terminations
  for select using (exists (
    select 1 from public.employees e
    where e.id = employee_id and public.user_in_org(e.organization_id)
  ));
create policy "terminations: admins write" on public.terminations
  for all using (exists (
    select 1 from public.employees e
    where e.id = employee_id and public.user_is_admin(e.organization_id)
  ));

create policy "checklist_items: members read" on public.termination_checklist_items
  for select using (exists (
    select 1 from public.terminations t
    join public.employees e on e.id = t.employee_id
    where t.id = termination_id and public.user_in_org(e.organization_id)
  ));
create policy "checklist_items: admins write" on public.termination_checklist_items
  for all using (exists (
    select 1 from public.terminations t
    join public.employees e on e.id = t.employee_id
    where t.id = termination_id and public.user_is_admin(e.organization_id)
  ));

-- Calendar conflicts are read-all-authenticated (reference-ish behaviour)
create policy "conflicts: authenticated read" on public.calendar_conflicts
  for select to authenticated using (true);
create policy "conflicts: service role write" on public.calendar_conflicts
  for all to service_role using (true) with check (true);

-- ─── Reference tables — grant read to all ──────────────────
grant select on public.countries to authenticated, anon;
grant select on public.public_holidays to authenticated, anon;
grant select on public.tax_forms to authenticated, anon;
grant select on public.fx_pairs to authenticated, anon;
grant select on public.fx_rates to authenticated, anon;

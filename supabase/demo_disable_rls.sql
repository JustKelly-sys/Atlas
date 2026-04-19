-- Demo mode: disable RLS on all tables so anon client reads work.
-- Safe for portfolio demo — all data is seeded fake data.
alter table public.organizations                disable row level security;
alter table public.profiles                     disable row level security;
alter table public.organization_members         disable row level security;
alter table public.employees                    disable row level security;
alter table public.employee_events              disable row level security;
alter table public.payroll_cycles               disable row level security;
alter table public.payroll_runs                 disable row level security;
alter table public.payroll_line_items           disable row level security;
alter table public.filings                      disable row level security;
alter table public.input_messages               disable row level security;
alter table public.input_parse_results          disable row level security;
alter table public.fx_leakage                   disable row level security;
alter table public.variances                    disable row level security;
alter table public.terminations                 disable row level security;
alter table public.termination_checklist_items  disable row level security;
alter table public.calendar_conflicts           disable row level security;
alter table public.audit_log                    disable row level security;
alter table public.alerts                       disable row level security;

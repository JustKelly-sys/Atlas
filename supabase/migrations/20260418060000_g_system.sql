-- Migration G — System
-- Audit log and dashboard alerts.

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  actor_type text not null check (actor_type in ('user','system','mcp')),
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index idx_audit_org_time on public.audit_log(organization_id, occurred_at desc);
create index idx_audit_target on public.audit_log(target_type, target_id);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  severity text not null check (severity in ('info','warn','crit')),
  title text not null,
  body text,
  link_url text,
  source_feature text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index idx_alerts_unresolved on public.alerts(organization_id, resolved_at) where resolved_at is null;

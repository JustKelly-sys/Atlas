"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { StatusTag, type FeatureStatus } from "./StatusTag";
import { Star } from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  status?: FeatureStatus;
  signature?: boolean;
  children?: NavItem[];
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", status: "live" },
  {
    label: "Payroll",
    status: "live",
    children: [
      { label: "Cycle", href: "/app/payroll/cycle", status: "live" },
      { label: "Inputs", href: "/app/payroll/inputs", status: "live", signature: true },
      { label: "Runs", href: "/app/payroll/runs", status: "live" },
      { label: "Variance", href: "/app/payroll/variance", status: "live", signature: true },
      { label: "FX Watchdog", href: "/app/payroll/fx", status: "live", signature: true },
    ],
  },
  {
    label: "People",
    status: "live",
    children: [
      { label: "Directory", href: "/app/people/directory", status: "live" },
      { label: "Onboarding", href: "/app/people/onboarding", status: "prototype" },
      { label: "Terminations", href: "/app/people/terminations", status: "live", signature: true },
    ],
  },
  {
    label: "Compliance",
    status: "live",
    children: [
      { label: "Filings", href: "/app/compliance/filings", status: "live" },
      { label: "Calendar", href: "/app/compliance/calendar", status: "live", signature: true },
      { label: "Audit Trail", href: "/app/compliance/audit", status: "prototype" },
    ],
  },
  { label: "Automations", href: "/app/automations", status: "live" },
  { label: "Integrations", href: "/app/integrations", status: "prototype" },
  { label: "Reports", href: "/app/reports", status: "prototype" },
  { label: "Settings", href: "/app/settings", status: "roadmap" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 bg-[color:var(--sidebar)] border-r border-[color:var(--sidebar-border)] flex flex-col">
      {/* Wordmark */}
      <div className="px-6 py-6 border-b border-[color:var(--sidebar-border)]">
        <Link href="/app/dashboard" className="block">
          <span className="font-display text-2xl tracking-[-0.02em] text-[color:var(--sidebar-foreground)]">
            Atlas
          </span>
          <span className="eyebrow block mt-1">Payroll operations</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
        {NAV.map((item) => (
          <SidebarGroup key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-[color:var(--sidebar-border)] space-y-2">
        <p className="eyebrow">FY 2026 · Q2</p>
        <p className="text-xs text-[color:var(--ink-tertiary)]">
          All systems operational
        </p>
      </div>
    </aside>
  );
}

function SidebarGroup({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isActive = item.href ? pathname.startsWith(item.href) : false;

  if (!item.children) {
    return <SidebarLink item={item} active={isActive} />;
  }

  const anyChildActive = item.children.some(
    (c) => c.href && pathname.startsWith(c.href),
  );

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "px-3 text-xs font-medium tracking-wide",
          anyChildActive
            ? "text-[color:var(--sidebar-foreground)]"
            : "text-[color:var(--ink-tertiary)]",
        )}
      >
        {item.label}
      </div>
      <div className="space-y-0.5">
        {item.children.map((child) => (
          <SidebarLink
            key={child.href ?? child.label}
            item={child}
            active={Boolean(child.href && pathname.startsWith(child.href))}
            indent
          />
        ))}
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  indent = false,
}: {
  item: NavItem;
  active: boolean;
  indent?: boolean;
}) {
  if (!item.href) return null;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between gap-2 rounded-sm px-3 py-1.5 text-sm transition-colors",
        indent ? "pl-5" : "pl-3",
        active
          ? "bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)] font-medium"
          : "text-[color:var(--sidebar-foreground)]/80 hover:text-[color:var(--sidebar-foreground)] hover:bg-[color:var(--sidebar-accent)]/50",
      )}
    >
      <span className="flex items-center gap-2 min-w-0">
        <span className="truncate">{item.label}</span>
        {item.signature ? (
          <Star
            className="h-3 w-3 shrink-0 fill-[color:var(--brand)] stroke-[color:var(--brand)]"
            aria-label="Signature automation"
          />
        ) : null}
      </span>
    </Link>
  );
}

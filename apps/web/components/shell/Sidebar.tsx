"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavChild = { label: string; href: string; tag?: string };
type NavItem =
  | { label: string; href: string; tag?: string; section?: string; children?: never }
  | { label: string; children: NavChild[]; href?: never; tag?: never; section?: never };

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard" },
  {
    label: "Payroll",
    children: [
      { label: "Cycle",       href: "/app/payroll/cycle" },
      { label: "Inputs",      href: "/app/payroll/inputs",   tag: "Live" },
      { label: "Runs",        href: "/app/payroll/runs" },
      { label: "Variance",    href: "/app/payroll/variance", tag: "Live" },
      { label: "FX Watchdog", href: "/app/payroll/fx",       tag: "Live" },
    ],
  },
  {
    label: "People",
    children: [
      { label: "Directory",    href: "/app/people/directory" },
      { label: "Onboarding",   href: "/app/people/onboarding",   tag: "Prototype" },
      { label: "Terminations", href: "/app/people/terminations",  tag: "Live" },
    ],
  },
  {
    label: "Compliance",
    children: [
      { label: "Filings",    href: "/app/compliance/filings",  tag: "Prototype" },
      { label: "Calendar",   href: "/app/compliance/calendar", tag: "Live" },
      { label: "Audit Trail",href: "/app/compliance/audit" },
    ],
  },
  { label: "Automations",  href: "/app/automations",  tag: "Live" },
  { label: "Integrations", href: "/app/integrations", tag: "Prototype" },
  { label: "Reports",      href: "/app/reports",      tag: "Prototype" },
  { label: "Settings",     href: "/app/settings",     tag: "Roadmap" },
];

const REVIEWER_NAV: NavItem[] = [
  { label: "Why Atlas", href: "/app/why-atlas" },
];

function TagPill({ tag }: { tag: string }) {
  const cls =
    tag === "Live"      ? "pill-live"  :
    tag === "Prototype" ? "pill-proto" :
    "pill-road";
  return (
    <span className={`pill ${cls}`} style={{ padding: "1px 7px", fontSize: 11, letterSpacing: "0.08em" }}>
      {tag === "Live" && <span className="dot" />}
      {tag}
    </span>
  );
}

function NavRow({
  label,
  href,
  tag,
  active,
  indent = false,
}: {
  label: string;
  href: string;
  tag?: string;
  active: boolean;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: indent ? "5px 10px 5px 16px" : "6px 10px 6px 8px",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        background: active ? "var(--surface-2)" : "transparent",
        color: active ? "var(--foreground)" : "var(--ink-secondary)",
        borderRadius: 2,
        borderLeft: active ? "2px solid var(--brand)" : "2px solid transparent",
        cursor: "pointer",
        fontWeight: active ? 500 : 400,
        marginBottom: 1,
        textDecoration: "none",
        transition: "background 120ms, border-color 120ms",
      }}
      className="row-hover"
    >
      <span style={{ flex: 1 }}>{label}</span>
      {tag && <TagPill tag={tag} />}
      {active && (
        <span className="mono" style={{ fontSize: 10, color: "var(--brand)" }}>●</span>
      )}
    </Link>
  );
}

export function Sidebar({ userName = "Atlas User" }: { userName?: string }) {
  const initials = userName.slice(0, 2).toUpperCase();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Payroll: true,
    People: true,
    Compliance: true,
  });

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  const renderItem = (item: NavItem, keyPrefix = "") => {
    if (!item.children) {
      const active = pathname.startsWith(item.href!);
      return (
        <NavRow
          key={keyPrefix + item.label}
          label={item.label}
          href={item.href!}
          tag={item.tag}
          active={active}
        />
      );
    }
    const open = !!expanded[item.label];
    const anyActive = item.children.some((c) => pathname.startsWith(c.href));
    return (
      <div key={keyPrefix + item.label}>
        <button
          onClick={() => toggle(item.label)}
          className="row-hover"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 10px 5px",
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: anyActive ? "var(--foreground)" : "var(--ink-tertiary)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
          <span style={{ fontSize: 9 }}>{open ? "−" : "+"}</span>
        </button>
        {open && (
          <div style={{ marginBottom: 6 }}>
            {item.children.map((c) => (
              <NavRow
                key={c.href}
                label={c.label}
                href={c.href}
                tag={c.tag}
                active={pathname.startsWith(c.href)}
                indent
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      style={{
        width: "var(--shell-sidebar, 240px)",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "var(--card)",
        borderRight: "1px solid var(--rule)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Wordmark */}
      <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid var(--rule)" }}>
        <Link href="/app/dashboard" style={{ textDecoration: "none" }}>
          <div
            className="serif"
            style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em", color: "var(--foreground)" }}
          >
            ATLAS
          </div>
          <div
            className="mono"
            style={{ fontSize: 10, color: "var(--ink-tertiary)", letterSpacing: "0.1em", marginTop: 2 }}
          >
            OPERATIONS
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px 14px" }}>
        {NAV.map((item) => renderItem(item))}

        {/* FOR REVIEWERS */}
        <div style={{ marginTop: 22, paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
          <div className="eyebrow" style={{ padding: "0 10px 8px", fontSize: 9.5, color: "var(--ink-tertiary)" }}>
            FOR REVIEWERS
          </div>
          {REVIEWER_NAV.map((item) => renderItem(item, "rv-"))}
          <a
            href="/"
            className="row-hover"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--ink-secondary)",
              textDecoration: "none",
              borderRadius: 2,
            }}
          >
            <span style={{ flex: 1 }}>Marketing site</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)" }}>↗</span>
          </a>
        </div>
      </nav>

      {/* User avatar */}
      <div style={{ borderTop: "1px solid var(--rule)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: 2,
            background: "var(--brand)",
            color: "#FAF5E7",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {userName}
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-tertiary)", letterSpacing: "0.08em" }}>
            DEMO ORG
          </div>
        </div>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)" }}>⌄</span>
      </div>
    </aside>
  );
}

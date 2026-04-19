"use client";

import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

function prettify(seg: string) {
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Header({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const parts = pathname
    .split("/")
    .filter(Boolean)
    .filter((p) => p !== "app");

  const breadcrumb = parts.length
    ? `OPERATIONS › ${parts.map((p) => p.toUpperCase().replace(/-/g, " ")).join(" › ")}`
    : "OPERATIONS › DASHBOARD";

  const initials = userName.slice(0, 2).toUpperCase();

  async function signOut() {
    await fetch("/api/auth/exit", { method: "POST" });
    router.push("/sign-in");
  }

  return (
    <div
      className="header"
      style={{
        height: "var(--shell-header, 56px)",
        borderBottom: "1px solid var(--rule)",
        background: "var(--card)",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Breadcrumb */}
      <div className="mono" style={{ fontSize: 11, color: "var(--ink-tertiary)", letterSpacing: "0.12em" }}>
        {breadcrumb}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Avatar / sign out */}
        <button
          onClick={signOut}
          title={`Sign out (${userName})`}
          style={{
            width: 28,
            height: 28,
            borderRadius: 2,
            background: "var(--brand)",
            color: "#FAF5E7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            marginLeft: 4,
          }}
        >
          {initials}
        </button>
      </div>
    </div>
  );
}

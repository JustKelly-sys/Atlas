"use client";

import { useState } from "react";

export default function SignInPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    const res = await fetch("/api/auth/enter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
      redirect: "follow",
    });
    if (res.redirected) {
      window.location.href = res.url;
    } else if (res.ok) {
      window.location.href = "/app/dashboard";
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="eyebrow">Atlas · Operations</p>
        <h1 className="serif" style={{ fontSize: 42, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          What should we call you?
        </h1>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          autoFocus
          autoComplete="given-name"
          style={{
            height: 48,
            width: "100%",
            border: "1px solid var(--rule)",
            background: "var(--surface-2)",
            padding: "0 16px",
            fontSize: 15,
            color: "var(--foreground)",
            outline: "none",
            fontFamily: "var(--font-geist-sans)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--rule)")}
        />
        <button
          type="submit"
          disabled={!name.trim() || loading}
          style={{
            height: 48,
            background: "var(--brand)",
            color: "#fff",
            border: "none",
            fontSize: 13,
            fontFamily: "var(--font-jetbrains-mono)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: name.trim() && !loading ? "pointer" : "not-allowed",
            opacity: name.trim() && !loading ? 1 : 0.4,
          }}
        >
          {loading ? "Entering…" : "Enter Atlas →"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Flag, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

type ParsedFields = {
  employee_name_guess?: string | null;
  country_hint?: string | null;
  change_type?: string | null;
  amount?: number | null;
  currency?: string | null;
  effective_date?: string | null;
  confidence_scores?: Record<string, number> | null;
  ambiguity_flags?: string[] | null;
};

type ParseResult = {
  id: string;
  message_id: string;
  parsed_fields: ParsedFields;
  confidence_overall: number | null;
  status: string;
  ambiguity_flags: string[] | null;
};

type Message = {
  id: string;
  source: string;
  sender: string;
  raw_text: string;
  received_at: string;
  status: string;
};

export function InputParsePanel({ messageId }: { messageId: string | null }) {
  const [message, setMessage] = useState<Message | null>(null);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);

  useEffect(() => {
    if (!messageId) return;
    void load(messageId);
  }, [messageId]);

  async function load(id: string) {
    setLoading(true);
    try {
      const sb = createClient();
      const [msgResp, prResp] = await Promise.all([
        sb.from("input_messages").select("*").eq("id", id).single(),
        sb
          .from("input_parse_results")
          .select("*")
          .eq("message_id", id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
      setMessage(msgResp.data);
      setResult(prResp.data);
    } finally {
      setLoading(false);
    }
  }

  async function parseNow() {
    if (!messageId) return;
    setParsing(true);
    try {
      const res = await fetch("/api/inputs/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: messageId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(`Parse failed: ${data.error ?? "unknown"}`);
        return;
      }
      toast.success(`Parsed with confidence ${(data.confidence ?? 0) * 100}%`);
      await load(messageId);
    } finally {
      setParsing(false);
    }
  }

  async function approve() {
    if (!result) return;
    const res = await fetch("/api/inputs/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parse_result_id: result.id }),
    });
    if (res.ok) {
      toast.success("Approved & logged to employee events");
      await load(messageId!);
    } else {
      toast.error("Approve failed");
    }
  }

  if (!messageId) {
    return (
      <div className="rounded-sm border border-[color:var(--rule)] bg-card flex items-center justify-center p-12 h-full">
        <p className="text-sm text-muted-foreground">
          Select a message from the inbox to review.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-[color:var(--rule)] bg-card flex flex-col h-full overflow-hidden">
      <header className="px-5 py-3 border-b border-[color:var(--rule)] flex items-center justify-between">
        <div>
          <p className="eyebrow">Message</p>
          <p className="font-mono text-xs text-[color:var(--ink-tertiary)]">
            {message?.sender}
          </p>
        </div>
        {!result && message?.status === "pending" ? (
          <Button
            size="sm"
            onClick={parseNow}
            disabled={parsing}
            className="bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-[color:var(--primary-foreground)]"
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            {parsing ? "Parsing via Gemini…" : "Parse with Gemini"}
          </Button>
        ) : null}
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Raw message */}
        <section>
          <p className="eyebrow mb-2">Raw text</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message?.raw_text ?? (loading ? "Loading…" : "—")}
          </p>
        </section>

        {result ? (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Parsed fields</p>
                <span
                  className="font-mono text-xs tabular-nums"
                  style={{
                    color:
                      (result.confidence_overall ?? 0) >= 0.8
                        ? "var(--status-ok)"
                        : (result.confidence_overall ?? 0) >= 0.5
                          ? "var(--status-warn)"
                          : "var(--status-crit)",
                  }}
                >
                  confidence {Math.round((result.confidence_overall ?? 0) * 100)}%
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                <Field label="Employee" value={result.parsed_fields.employee_name_guess} />
                <Field label="Country" value={result.parsed_fields.country_hint} />
                <Field label="Change type" value={result.parsed_fields.change_type} />
                <Field
                  label="Amount"
                  value={
                    result.parsed_fields.amount != null
                      ? `${result.parsed_fields.amount.toLocaleString("en-US")} ${result.parsed_fields.currency ?? ""}`.trim()
                      : null
                  }
                  mono
                />
                <Field label="Effective date" value={result.parsed_fields.effective_date} mono />
              </dl>

              {(result.ambiguity_flags ?? []).length > 0 ? (
                <div className="rounded-sm border border-[color:var(--status-warn)]/40 bg-[color:var(--status-warn)]/5 p-3">
                  <p className="eyebrow mb-1" style={{ color: "var(--status-warn)" }}>
                    Ambiguity flags
                  </p>
                  <ul className="text-xs list-disc pl-4 space-y-1">
                    {(result.ambiguity_flags ?? []).map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            {result.status === "awaiting_approval" ? (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={approve}
                  className="bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-[color:var(--primary-foreground)]"
                >
                  <Check className="h-3.5 w-3.5 mr-2" />
                  Approve &amp; log to employee events
                </Button>
                <Button variant="outline" disabled>
                  <Flag className="h-3.5 w-3.5 mr-2" />
                  Flag for review
                </Button>
                <Button variant="ghost" disabled>
                  <X className="h-3.5 w-3.5 mr-2" />
                  Dismiss
                </Button>
              </div>
            ) : (
              <p className="text-xs text-[color:var(--status-ok)] font-mono">
                ✓ Approved
              </p>
            )}
          </>
        ) : message?.status === "pending" ? (
          <p className="text-sm text-muted-foreground">
            Not yet parsed. Click <strong>Parse with Gemini</strong> above.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs text-muted-foreground shrink-0">{label}</dt>
      <dd
        className={
          mono
            ? "font-mono tabular-nums text-[color:var(--ink-primary)] text-right"
            : "text-[color:var(--ink-primary)] text-right truncate"
        }
      >
        {value || "—"}
      </dd>
    </div>
  );
}

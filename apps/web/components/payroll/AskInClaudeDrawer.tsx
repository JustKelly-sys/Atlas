"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sparkles, MessageSquareText, User } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

/**
 * Stub conversational drawer. The live variance-narrator-mcp server exposes
 * `list_variances`, `narrate_variance`, `query_cycle_summary` over MCP stdio —
 * in production this drawer would pipe to that server via an `mcp://`
 * bridge. For the demo it's a guided-prompt input that shows what the
 * hiring manager would interact with.
 */
const SUGGESTIONS = [
  "Why did Germany spike 18% this cycle?",
  "Summarise South Africa's variance story for Q2.",
  "Which countries have unexplained variances > 5%?",
  "What caused the FX-flagged rows last month?",
];

export function AskInClaudeDrawer() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  function stubReply(question: string): string {
    const lower = question.toLowerCase();
    if (lower.includes("germany")) {
      return "Germany spiked 18% in April 2026 because three senior engineers received delayed Q1 bonuses totalling €32,400 paid in the April cycle (statutory holiday pay adjustment). Cause: bonus timing, not headcount.";
    }
    if (lower.includes("south africa") || lower.includes("za")) {
      return "South Africa Q2 total variance is +7.8%. Breakdown: SARS UIF rate change (+2.1%), 4 new hires in March (+3.4%), 13th-cheque timing (+2.3%). All within policy.";
    }
    if (lower.includes("unexplained")) {
      return "Three countries have unexplained variances above 5% this cycle: UAE (+6.2%), Australia (+5.8%), Germany (+18.1%). Recommend narrating each before cycle close.";
    }
    if (lower.includes("fx")) {
      return "Two FX-flagged rows last month: GBP/ZAR spread widened to 84 bps (vs 52 bps baseline), and EUR/USD provider rate drifted 31 bps below mid-market — combined leakage $1,120 on €1.4M volume.";
    }
    return "I'd check the cycle's line-item breakdown and the FX rates for that period. Expand the country row to see the full narration.";
  }

  async function send(prompt?: string) {
    const text = (prompt ?? input).trim();
    if (!text) return;
    const nextMsgs: ChatMessage[] = [
      ...messages,
      { role: "user", text },
    ];
    setMessages(nextMsgs);
    setInput("");
    setSending(true);
    // Simulated latency so the UX feels real
    setTimeout(() => {
      setMessages([
        ...nextMsgs,
        { role: "assistant", text: stubReply(text) },
      ]);
      setSending(false);
    }, 700);
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="border-[color:var(--brand)] text-[color:var(--brand)] hover:bg-[color:var(--brand)]/10"
          />
        }
      >
        <MessageSquareText className="h-3.5 w-3.5 mr-2" />
        Ask in Claude
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-5 border-b border-[color:var(--rule)]">
          <SheetTitle className="font-display text-xl tracking-[-0.01em]">
            Ask Variance Narrator
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Backed by the variance-narrator-mcp server · exposed as
            <code className="mx-1 font-mono text-[10px]">mcp://variance-narrator</code>
            to Claude Desktop
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Try one of these:
              </p>
              <ul className="space-y-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => send(s)}
                      className="w-full text-left text-sm px-3 py-2 rounded-sm border border-[color:var(--rule)] hover:border-[color:var(--brand)] hover:bg-[color:var(--brand)]/5 transition-colors"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-sm bg-[color:var(--brand)] text-[color:var(--primary-foreground)] px-4 py-2.5 text-sm"
                      : "max-w-[85%] rounded-sm border border-[color:var(--rule)] bg-card px-4 py-2.5 text-sm leading-relaxed"
                  }
                  style={m.role === "assistant" ? { fontFamily: "var(--font-display)" } : undefined}
                >
                  {m.role === "assistant" ? (
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)] shrink-0 mt-1" />
                      <span>{m.text}</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <User className="h-3.5 w-3.5 shrink-0 mt-1 opacity-70" />
                      <span>{m.text}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {sending ? (
            <div className="flex justify-start">
              <div className="px-4 py-2.5 text-sm text-muted-foreground italic">
                Narrator is thinking…
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-[color:var(--rule)] px-6 py-4 bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a country, cycle, or cause…"
              disabled={sending}
            />
            <Button
              type="submit"
              size="sm"
              disabled={sending || !input.trim()}
              className="bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-[color:var(--primary-foreground)]"
            >
              Ask
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

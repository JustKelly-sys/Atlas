"use client";

import { Mail, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/formatters";

export type InputMessage = {
  id: string;
  source: "email" | "slack" | "whatsapp";
  sender: string;
  raw_text: string;
  received_at: string;
  status: "pending" | "parsed" | "dismissed";
};

const SOURCE_ICON = {
  email: Mail,
  slack: MessageSquare,
  whatsapp: Phone,
} as const;

export function InputInboxList({
  messages,
  selectedId,
  onSelect,
}: {
  messages: InputMessage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="rounded-sm border border-[color:var(--rule)] bg-card flex flex-col h-full overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--rule)]">
        <p className="eyebrow">Inbox</p>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {messages.length}
        </span>
      </header>
      <ul className="flex-1 overflow-y-auto divide-y divide-[color:var(--rule)]">
        {messages.map((m) => {
          const Icon = SOURCE_ICON[m.source];
          const isSelected = m.id === selectedId;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-[color:var(--accent)] transition-colors",
                  isSelected &&
                    "bg-[color:var(--accent)] border-l-2 border-l-[color:var(--brand)]",
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon
                    className="h-3 w-3 text-[color:var(--ink-tertiary)] shrink-0"
                    aria-hidden
                  />
                  <span className="font-mono text-[11px] text-[color:var(--ink-tertiary)] truncate flex-1 min-w-0">
                    {m.sender}
                  </span>
                  <span className="font-mono text-[10px] text-[color:var(--ink-tertiary)] tabular-nums shrink-0">
                    {formatRelativeTime(m.received_at)}
                  </span>
                </div>
                <p className="text-sm leading-snug line-clamp-2">
                  {m.raw_text}
                </p>
                {m.status === "parsed" ? (
                  <p className="eyebrow text-[9px] mt-1.5 text-[color:var(--status-ok)]">
                    Approved
                  </p>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

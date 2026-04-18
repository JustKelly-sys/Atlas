"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shell/PageHeader";
import {
  InputInboxList,
  type InputMessage,
} from "@/components/payroll/InputInboxList";
import { InputParsePanel } from "@/components/payroll/InputParsePanel";

export default function InputsPage() {
  const [messages, setMessages] = useState<InputMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const sb = createClient();
    sb.from("input_messages")
      .select("id,source,sender,raw_text,received_at,status")
      .order("received_at", { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as InputMessage[];
        setMessages(list);
        if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingCount = messages.filter((m) => m.status === "pending").length;
  const avgConfidence = 0.87; // TODO: compute from parse_results

  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader
        eyebrow="Operations · Inputs"
        title="Payroll input parser"
        subtitle="Turns messy HR messages (email, Slack, WhatsApp) into structured change records with one Gemini call. Approve or flag."
        status="live"
      />

      {/* Metric strip */}
      <div className="grid grid-cols-4 gap-4 rounded-sm border border-[color:var(--rule)] bg-card p-5">
        <div>
          <p className="eyebrow">Inbox</p>
          <p className="font-mono text-2xl tabular-nums mt-1">{messages.length}</p>
        </div>
        <div>
          <p className="eyebrow">Pending</p>
          <p className="font-mono text-2xl tabular-nums mt-1">{pendingCount}</p>
        </div>
        <div>
          <p className="eyebrow">Avg confidence</p>
          <p className="font-mono text-2xl tabular-nums mt-1">
            {Math.round(avgConfidence * 100)}%
          </p>
        </div>
        <div>
          <p className="eyebrow">Model</p>
          <p className="font-mono text-sm mt-3">gemini-2.5-flash</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 flex-1 min-h-[600px]">
        <InputInboxList
          messages={messages}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <InputParsePanel messageId={selectedId} />
      </div>
    </div>
  );
}

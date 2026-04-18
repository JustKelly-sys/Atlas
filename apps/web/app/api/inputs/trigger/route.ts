import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * POST /api/inputs/trigger
 * Body: { message_id: string }
 *
 * Fires the n8n input-parser webhook for a specific seeded message.
 * Returns the parse result summary.
 */
export async function POST(req: NextRequest) {
  const { message_id } = await req.json();
  if (!message_id) {
    return NextResponse.json({ error: "message_id required" }, { status: 400 });
  }

  const webhookBase = process.env.N8N_WEBHOOK_BASE_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!webhookBase || !secret) {
    return NextResponse.json(
      { error: "n8n webhook not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${webhookBase}/webhook/input-parser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Playroll-Auth": secret,
      },
      body: JSON.stringify({ message_id }),
    });
    const text = await res.text();
    let data: unknown = text;
    try {
      data = JSON.parse(text);
    } catch {
      // keep as text
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: "n8n webhook returned error", status: res.status, body: data },
        { status: 502 },
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "n8n unreachable", detail: String(err) },
      { status: 502 },
    );
  }
}

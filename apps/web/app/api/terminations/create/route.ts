import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /api/terminations/create
 * Body: { employee_id, termination_type, notice_date, last_working_day }
 *
 * Forwards to the n8n termination-checklist webhook, which calls Gemini
 * to generate a jurisdiction-specific checklist, then inserts the
 * termination + checklist items into Supabase and returns the created
 * termination id.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { employee_id, termination_type, notice_date, last_working_day } = body ?? {};

  if (!employee_id || !termination_type || !notice_date || !last_working_day) {
    return NextResponse.json(
      { error: "employee_id, termination_type, notice_date, last_working_day required" },
      { status: 400 },
    );
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
    const res = await fetch(`${webhookBase}/webhook/termination`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Playroll-Auth": secret,
      },
      body: JSON.stringify({
        employee_id,
        termination_type,
        notice_date,
        last_working_day,
      }),
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

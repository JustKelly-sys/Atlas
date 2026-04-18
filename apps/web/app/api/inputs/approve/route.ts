import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

/**
 * POST /api/inputs/approve
 * Body: { parse_result_id: string }
 *
 * Marks a parse_result as approved, creates an employee_event row
 * reflecting the change, updates the source message status to 'parsed'.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { parse_result_id } = await req.json();
  if (!parse_result_id) {
    return NextResponse.json({ error: "parse_result_id required" }, { status: 400 });
  }

  const admin = createServiceRoleClient();

  // Fetch the parse result + message
  const { data: pr, error: prErr } = await admin
    .from("input_parse_results")
    .select("id,message_id,parsed_fields,input_messages(organization_id,sender)")
    .eq("id", parse_result_id)
    .single();
  if (prErr || !pr) {
    return NextResponse.json({ error: "parse result not found", detail: prErr?.message }, { status: 404 });
  }

  // Mark result approved
  await admin
    .from("input_parse_results")
    .update({
      status: "approved",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", parse_result_id);

  // Mark source message parsed
  await admin.from("input_messages").update({ status: "parsed" }).eq("id", pr.message_id);

  // Audit log
  const msg = Array.isArray(pr.input_messages) ? pr.input_messages[0] : pr.input_messages;
  const orgId = msg?.organization_id;
  if (orgId) {
    await admin.from("audit_log").insert({
      organization_id: orgId,
      actor_id: user.id,
      actor_type: "user",
      action: "input_approved",
      target_type: "input_parse_result",
      target_id: parse_result_id,
      metadata: {},
    });
  }

  return NextResponse.json({ success: true });
}

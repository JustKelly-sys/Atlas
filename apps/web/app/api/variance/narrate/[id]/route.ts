import { NextResponse } from "next/server";

/**
 * POST /api/variance/narrate/[id]
 * Proxies to the variance-narrator-mcp Python HTTP endpoint to generate
 * a plain-language explanation of why the variance happened.
 */
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const base = process.env.VARIANCE_SERVICE_URL;
  const secret = process.env.PYTHON_SERVICE_SECRET;
  if (!base) {
    return NextResponse.json(
      { error: "VARIANCE_SERVICE_URL not set" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${base}/narrate/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Playroll-Auth": secret } : {}),
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "variance-narrator unreachable", detail: String(err) },
      { status: 502 },
    );
  }
}

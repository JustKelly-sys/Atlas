import { NextResponse } from "next/server";

/**
 * POST /api/calendar/refresh
 * Triggers the calendar-sentinel-mcp server to rescan holidays + cutoffs
 * across every country and upsert conflict rows.
 */
export async function POST() {
  const base = process.env.CALENDAR_SERVICE_URL;
  const secret = process.env.PYTHON_SERVICE_SECRET;
  if (!base) {
    return NextResponse.json(
      { error: "CALENDAR_SERVICE_URL not set" },
      { status: 500 },
    );
  }
  try {
    const res = await fetch(`${base}/refresh`, {
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
      { error: "calendar-sentinel unreachable", detail: String(err) },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";

/**
 * POST /api/fx/run
 * Proxies to the Python fx-watchdog service on Render.
 */
export async function POST() {
  const base = process.env.FX_SERVICE_URL;
  const secret = process.env.PYTHON_SERVICE_SECRET;
  if (!base) {
    return NextResponse.json({ error: "FX_SERVICE_URL not set" }, { status: 500 });
  }
  try {
    const res = await fetch(`${base}/run`, {
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
      { error: "fx-watchdog unreachable", detail: String(err) },
      { status: 502 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name } = await request.json() as { name: string };
  if (!name?.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  const response = NextResponse.redirect(new URL("/app/dashboard", request.url));
  response.cookies.set("atlas_name", name.trim(), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const isAuthPage = url.startsWith("/sign-in") || url.startsWith("/sign-up");
  const isAppPage = url.startsWith("/app");

  const name = request.cookies.get("atlas_name")?.value;

  if (!name && isAppPage) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/sign-in";
    return NextResponse.redirect(redirect);
  }

  if (name && isAuthPage) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/app/dashboard";
    return NextResponse.redirect(redirect);
  }

  return NextResponse.next({ request });
}

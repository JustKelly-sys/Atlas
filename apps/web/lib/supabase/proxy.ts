import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session cookie on every request and
 * enforces auth gates on /app/* routes.
 *
 * Called from the root proxy.ts (formerly middleware.ts in
 * Next.js < 16).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: calling getUser() here refreshes the session if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.pathname;
  const isAuthPage = url.startsWith("/sign-in") || url.startsWith("/sign-up");
  const isAppPage = url.startsWith("/app");

  if (!user && isAppPage) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/sign-in";
    return NextResponse.redirect(redirect);
  }

  if (user && isAuthPage) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/app/dashboard";
    return NextResponse.redirect(redirect);
  }

  return response;
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigured, supabaseKey, supabaseUrl } from "./server";

// Refreshes the Supabase session cookie and does an optimistic sign-in check.
// Real authorization happens in the pages/actions and in the database (RLS).
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] =
    null;
  try {
    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch {
    // A transient failure reaching Supabase shouldn't 503 the page — fail
    // closed by treating the request as unauthenticated, same as if there
    // were no session cookie at all.
  }

  const { pathname } = request.nextUrl;
  const needsSignIn =
    pathname.startsWith("/account") ||
    pathname.startsWith("/investor") ||
    pathname.startsWith("/admin");

  if (!user && needsSignIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "?next=" + encodeURIComponent(pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

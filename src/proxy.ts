import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only /account, /investor, and /admin rely on this proxy for their sign-in
// redirect. /login and /register already guard themselves via getSession()
// in their own page components, so running the proxy for them only adds a
// redundant Supabase network round-trip whose result is unused here — and an
// unhandled failure there (see updateSession) would 503 the whole page for
// no benefit. Keep them out of the matcher.
export const config = {
  matcher: ["/account/:path*", "/investor/:path*", "/admin/:path*"],
};

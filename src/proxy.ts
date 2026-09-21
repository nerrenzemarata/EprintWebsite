import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only the account pages need a session, so the public home page stays static.
export const config = {
  matcher: ["/account/:path*", "/investor/:path*", "/admin/:path*", "/login", "/register"],
};

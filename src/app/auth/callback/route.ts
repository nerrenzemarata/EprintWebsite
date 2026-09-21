import { NextResponse } from "next/server";
import { homeFor, type Role } from "@/lib/domain";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

// Landing point for the "confirm your email" link Supabase sends.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // The only place we ever send people besides their dashboard.
  const goToReset = searchParams.get("next") === "/reset-password";

  if (code && supabaseConfigured) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && goToReset) return NextResponse.redirect(`${origin}/reset-password`);
    if (!error) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      return NextResponse.redirect(`${origin}${homeFor(profile?.role as Role | undefined)}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirm`);
}

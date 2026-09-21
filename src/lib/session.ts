import { cache } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured, type Supa } from "@/lib/supabase/server";
import { homeFor, type Profile, type Role } from "@/lib/domain";

// Verified on the server with getUser() (not just reading the cookie).
export const getSession = cache(async () => {
  // Per-user data: never prerender, even when Supabase isn't configured yet.
  await connection();

  if (!supabaseConfigured) return { supabase: null, user: null, profile: null };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, full_name, email, phone, address, role")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, profile: (data as Profile | null) ?? null };
});

// For pages: send visitors who aren't signed in to /login, and signed-in users
// with a different role to their own dashboard.
export async function requireRole(role: Role) {
  const { supabase, user, profile } = await getSession();
  if (!supabase || !user) redirect("/login");
  // Signed in but no profile row: /login must not bounce them back here (redirect loop).
  if (!profile) redirect("/login?error=profile");
  if (profile.role !== role) redirect(homeFor(profile.role));
  return { supabase, user, profile };
}

// For server actions, which are public endpoints: never trust that the page that
// rendered the form was gated. Returns null when the caller isn't allowed.
export async function getActor(role: Role): Promise<{ supabase: Supa; user: { id: string }; profile: Profile } | null> {
  const { supabase, user, profile } = await getSession();
  if (!supabase || !user || !profile || profile.role !== role) return null;
  return { supabase, user, profile };
}

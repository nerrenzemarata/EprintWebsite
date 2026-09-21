"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  forgotPasswordSchema,
  homeFor,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type Role,
} from "@/lib/domain";
import { fail, invalid, type FormState } from "@/lib/form-state";
import { getSession } from "@/lib/session";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export type LoginState = { error?: string; email?: string } | undefined;

// Only follow a return path that belongs to the signed-in user's own area.
function safeNext(next: FormDataEntryValue | null, role: Role | undefined) {
  const home = homeFor(role);
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return home;
  return next === home || next.startsWith(home + "/") ? next : home;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");

  if (!supabaseConfigured) {
    return { email, error: "Login isn't available yet." };
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { email, error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return {
      email,
      error:
        error?.code === "email_not_confirmed"
          ? "Please confirm your email first. Check your inbox for the link."
          : "Incorrect email or password.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  redirect(safeNext(formData.get("next"), profile?.role as Role | undefined));
}

export async function register(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!supabaseConfigured) {
    return fail("Registration isn't available yet. Please email us and we'll set you up.");
  }

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, formData);

  const input = parsed.data;
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  // A database trigger (supabase/phase2.sql) turns this metadata into the profile.
  // It only ever accepts "customer" or "investor" as the role.
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        address: input.address,
        account_type: input.accountType,
        consent: "true",
      },
    },
  });

  const alreadyRegistered =
    error?.code === "user_already_exists" ||
    (!error && data.user?.identities?.length === 0);

  if (alreadyRegistered) {
    return fail("Please fix the highlighted field.", formData, {
      email: ["This email already has an account. Please log in instead."],
    });
  }

  if (error) {
    console.error("[register] signUp failed:", error.code, error.message);
    return fail("We couldn't create your account. Please try again.", formData);
  }

  // With email confirmation off, the user is already signed in.
  if (data.session) redirect(homeFor(input.accountType));

  return { ok: true, message: "confirm" };
}

export async function logout() {
  if (supabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

// Always answers the same way, so nobody can use this form to find out which emails
// have an account.
export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!supabaseConfigured) return fail("Password reset isn't available yet.");

  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, formData);

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: origin ? `${origin}/auth/callback?next=/reset-password` : undefined,
  });
  if (error) console.error("[reset] request failed:", error.code, error.message);

  return {
    ok: true,
    message: "If an account exists for that email, we've sent a link to reset your password.",
  };
}

// Runs from the temporary session the emailed link creates.
export async function updatePassword(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase, user, profile } = await getSession();
  if (!supabase || !user) {
    return fail("This reset link has expired. Please request a new one.");
  }

  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, formData);

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    console.error("[reset] update failed:", error.code, error.message);
    return fail(
      error.code === "same_password"
        ? "Please choose a password different from your current one."
        : "We couldn't update your password. Please try again.",
    );
  }

  redirect(homeFor(profile?.role));
}

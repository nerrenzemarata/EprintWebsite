import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import LoginForm from "@/components/LoginForm";
import { homeFor } from "@/lib/domain";
import { getSession } from "@/lib/session";
import { supabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Login | E-Print Vendo Printing" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { user, profile } = await getSession();
  if (user && profile) redirect(homeFor(profile.role));

  const { error, next } = await searchParams;

  return (
    <AuthShell>
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5">
        <h1 className="font-display text-2xl font-bold text-brand-ink">Login</h1>
        <p className="mt-1 mb-6 text-sm text-brand-slate">
          Track your deployment request or investor application.
        </p>

        {!supabaseConfigured && (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Login isn&apos;t set up yet. Add your Supabase keys to{" "}
            <code>.env.local</code> (see <code>.env.example</code>).
          </p>
        )}
        {error === "profile" && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            We couldn&apos;t load your account details. Please log in again, or contact us if this keeps
            happening.
          </p>
        )}
        {error === "confirm" && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            That confirmation link is invalid or expired. Try logging in, or
            register again.
          </p>
        )}

        <LoginForm next={next} />

        <p className="mt-6 text-center text-sm text-brand-slate">
          New here?{" "}
          <Link href="/register" className="font-semibold text-brand-blue hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

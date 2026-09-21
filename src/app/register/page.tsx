import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import RegisterForm from "@/components/RegisterForm";
import { homeFor } from "@/lib/domain";
import { getSession } from "@/lib/session";
import { supabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Register | E-Print Vendo Printing" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { user, profile } = await getSession();
  if (user && profile) redirect(homeFor(profile.role));

  const { type } = await searchParams;

  return (
    <AuthShell size="md">
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-10">
        <h1 className="font-display text-2xl font-bold text-brand-ink">Create your account</h1>
        <p className="mt-1 mb-6 text-sm text-brand-slate">
          One account lets you submit and track your request or application.
        </p>

        {!supabaseConfigured && (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Registration isn&apos;t set up yet. Add your Supabase keys to{" "}
            <code>.env.local</code> (see <code>.env.example</code>).
          </p>
        )}

        <RegisterForm defaultType={type === "investor" ? "investor" : "customer"} />
      </div>
    </AuthShell>
  );
}

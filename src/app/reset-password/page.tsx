import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Reset Password | E-Print Vendo Printing" };

// Reached from the link in the reset email, which signs the person in temporarily.
export default async function ResetPasswordPage() {
  const { user } = await getSession();

  return (
    <AuthShell>
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5">
        <h1 className="font-display text-2xl font-bold text-brand-ink">Choose a new password</h1>
        {user ? (
          <>
            <p className="mt-1 mb-6 text-sm text-brand-slate">
              Enter a new password for {user.email}.
            </p>
            <ResetPasswordForm />
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-brand-slate">
              This reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="mt-5 inline-block rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue-dark"
            >
              Request a new link
            </Link>
          </>
        )}
      </div>
    </AuthShell>
  );
}

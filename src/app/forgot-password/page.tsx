import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password | E-Print Vendo Printing" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5">
        <h1 className="font-display text-2xl font-bold text-brand-ink">Forgot your password?</h1>
        <p className="mt-1 mb-6 text-sm text-brand-slate">
          Enter your email and we&apos;ll send you a link to choose a new one.
        </p>
        <ForgotPasswordForm />
        <p className="mt-6 text-center text-sm text-brand-slate">
          <Link href="/login" className="font-semibold text-brand-blue hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

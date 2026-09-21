import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import DeploymentRequestForm from "@/components/DeploymentRequestForm";
import { accountNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Request Deployment | E-Print Vendo Printing" };

export default async function NewRequestPage() {
  const { profile } = await requireRole("customer");

  return (
    <AuthShell signedIn size="md" nav={accountNav}>
      <h1 className="font-display text-2xl font-bold text-brand-ink">Request deployment</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Tell us where you&apos;d like an E-Print kiosk. Our team will review the location and update you here.
      </p>

      <section className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm ring-1 ring-black/5">
        <h2 className="text-xs font-semibold tracking-wide text-brand-slate uppercase">Submitting as</h2>
        <p className="mt-1 font-medium text-brand-ink">{profile.full_name}</p>
        <p className="text-brand-slate">
          {profile.email} · {profile.phone || "no contact number"}
        </p>
        <p className="text-brand-slate">{profile.address}</p>
      </section>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
        <DeploymentRequestForm />
      </div>
    </AuthShell>
  );
}

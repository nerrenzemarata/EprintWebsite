import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import InvestorForm from "@/components/InvestorForm";
import { idEncryptionConfigured } from "@/lib/crypto";
import { INVESTOR_EDITABLE, type InvestorApplication } from "@/lib/domain";
import { investorNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Investor Application | E-Print Vendo Printing" };

export default async function InvestorApplyPage() {
  const { supabase, user, profile } = await requireRole("investor");

  const { data } = await supabase
    .from("investor_applications")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const existing = data as InvestorApplication | null;

  if (existing && !INVESTOR_EDITABLE.includes(existing.status)) redirect("/investor");

  return (
    <AuthShell signedIn size="md" nav={investorNav}>
      <h1 className="font-display text-2xl font-bold text-brand-ink">
        {existing ? "Update your application" : "Investor / partner application"}
      </h1>
      <p className="mt-1 text-sm text-brand-slate">
        Applying as {profile.full_name} ({profile.email}). E-Print does not guarantee profits or
        investment returns; partnership terms are agreed individually.
      </p>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
        {idEncryptionConfigured ? (
          <InvestorForm existing={existing ?? undefined} />
        ) : (
          <p className="text-sm text-brand-slate">
            Applications are temporarily unavailable. Please contact us and we&apos;ll help you.
          </p>
        )}
      </div>
    </AuthShell>
  );
}

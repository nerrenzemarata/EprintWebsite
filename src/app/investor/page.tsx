import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Pencil } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import DocumentList from "@/components/DocumentList";
import DocumentUploadForm from "@/components/DocumentUploadForm";
import MessagePanel from "@/components/MessagePanel";
import StatusBadge from "@/components/StatusBadge";
import StatusTracker from "@/components/StatusTracker";
import { addInvestorDocuments } from "@/app/actions/investor";
import {
  ID_TYPE_LABELS,
  INVESTOR_EDITABLE,
  INVESTOR_FLOW,
  PARTNERSHIP_LABELS,
  type DocumentRow,
  type InvestorApplication,
  type Message,
} from "@/lib/domain";
import { investorNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";
import { signedUrls } from "@/lib/uploads";

export const metadata: Metadata = { title: "Investor Dashboard | E-Print Vendo Printing" };

export default async function InvestorPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; updated?: string }>;
}) {
  const { submitted, updated } = await searchParams;
  const { supabase, user, profile } = await requireRole("investor");

  const [{ data: appRow }, { data: messageRows }] = await Promise.all([
    supabase.from("investor_applications").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(50),
  ]);
  const application = appRow as InvestorApplication | null;
  const messages = (messageRows ?? []) as Message[];

  const { data: docRows } = application
    ? await supabase
        .from("documents")
        .select("*")
        .eq("investor_application_id", application.id)
        .order("created_at")
    : { data: [] };
  const documents = (docRows ?? []) as DocumentRow[];
  const urls = await signedUrls(supabase, "documents", documents.map((d) => d.path));

  const editable = application && INVESTOR_EDITABLE.includes(application.status);

  return (
    <AuthShell signedIn size="lg" nav={investorNav}>
      <h1 className="font-display text-2xl font-bold text-brand-ink">
        Hi, {profile.first_name || "there"}!
      </h1>
      <p className="mt-1 text-sm text-brand-slate">{profile.email}</p>

      {submitted && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Application submitted! We&apos;ll review it and post updates here.
        </p>
      )}
      {updated && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Your application was updated.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          {!application ? (
            <section className="rounded-3xl bg-white p-8 text-center shadow-xl shadow-brand-blue/10 ring-1 ring-black/5">
              <h2 className="font-display text-lg font-semibold text-brand-ink">
                Start your investor application
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-slate">
                Tell us about your business and how you&apos;d like to be involved. You&apos;ll also
                provide a government-issued ID so we can verify your application.
              </p>
              <Link
                href="/investor/apply"
                className="mt-5 inline-block rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-ink hover:bg-brand-gold-dark hover:text-white"
              >
                Start application
              </Link>
            </section>
          ) : (
            <>
              <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold text-brand-ink">Application status</h2>
                  <StatusBadge status={application.status} kind="investor" />
                </div>
                <div className="mt-6">
                  <StatusTracker flow={INVESTOR_FLOW} status={application.status} kind="investor" />
                </div>
                {application.admin_note && (
                  <div className="mt-6 rounded-2xl bg-brand-blue-light px-4 py-3 text-sm text-brand-ink">
                    <span className="font-semibold">Note from E-Print: </span>
                    {application.admin_note}
                  </div>
                )}
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold text-brand-ink">Your application</h2>
                  {editable && (
                    <Link
                      href="/investor/apply"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
                    >
                      <Pencil size={14} /> Update
                    </Link>
                  )}
                </div>
                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-[9rem_1fr]">
                  <dt className="text-brand-slate">Business</dt>
                  <dd className="text-brand-ink">{application.business_name}</dd>
                  <dt className="text-brand-slate">Location</dt>
                  <dd className="text-brand-ink">{application.location}</dd>
                  <dt className="text-brand-slate">Partnership type</dt>
                  <dd className="text-brand-ink">{PARTNERSHIP_LABELS[application.partnership_type]}</dd>
                  <dt className="text-brand-slate">Background</dt>
                  <dd className="whitespace-pre-wrap text-brand-ink">{application.business_background}</dd>
                  <dt className="text-brand-slate">Interest</dt>
                  <dd className="whitespace-pre-wrap text-brand-ink">{application.investment_interest}</dd>
                  <dt className="text-brand-slate">Government ID</dt>
                  <dd className="flex items-center gap-2 text-brand-ink">
                    <Lock size={14} className="text-brand-blue" />
                    {ID_TYPE_LABELS[application.id_type]} ending {application.id_number_last4}
                    <span className="text-xs text-brand-slate">(stored privately)</span>
                  </dd>
                </dl>
                {!editable && (
                  <p className="mt-4 text-xs text-brand-slate">
                    This application has been decided and can no longer be edited. Message us below if
                    something needs to change.
                  </p>
                )}
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
                <h2 className="font-display text-lg font-semibold text-brand-ink">Supporting documents</h2>
                <div className="mt-4">
                  <DocumentList documents={documents} urls={urls} empty="No supporting documents uploaded." />
                </div>
                <div className="mt-6 border-t border-black/5 pt-6">
                  <DocumentUploadForm action={addInvestorDocuments} />
                </div>
              </section>
            </>
          )}
        </div>

        <MessagePanel messages={messages} />
      </div>
    </AuthShell>
  );
}

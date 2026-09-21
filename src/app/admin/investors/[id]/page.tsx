import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import AdminStatusForm from "@/components/AdminStatusForm";
import AdminThread from "@/components/AdminThread";
import AuthShell from "@/components/AuthShell";
import DocumentList from "@/components/DocumentList";
import StatusBadge from "@/components/StatusBadge";
import { reviewInvestor } from "@/app/actions/admin";
import { decryptIdNumber } from "@/lib/crypto";
import {
  ID_TYPE_LABELS,
  INVESTOR_STATUSES,
  PARTNERSHIP_LABELS,
  isUuid,
  type DocumentRow,
  type InvestorApplication,
  type Message,
  type Profile,
} from "@/lib/domain";
import { adminNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";
import { signedUrls } from "@/lib/uploads";

export const metadata: Metadata = { title: "Investor Application | Admin" };

export default async function AdminInvestorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const { supabase } = await requireRole("admin");

  const { data } = await supabase
    .from("investor_applications")
    .select("*, profiles!investor_applications_user_id_fkey(id, full_name, email, phone, address)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const app = data as unknown as InvestorApplication & {
    profiles: Pick<Profile, "id" | "full_name" | "email" | "phone" | "address">;
  };
  const applicant = app.profiles;

  const [{ data: docRows }, { data: messageRows }] = await Promise.all([
    supabase.from("documents").select("*").eq("investor_application_id", id).order("created_at"),
    supabase.from("messages").select("*").eq("user_id", app.user_id).order("created_at", { ascending: false }).limit(50),
  ]);
  const documents = (docRows ?? []) as DocumentRow[];
  const messages = (messageRows ?? []) as Message[];
  const urls = await signedUrls(supabase, "documents", documents.map((d) => d.path));

  // The ID image lives in the admin-only bucket; the link expires after 2 minutes.
  const idUrl = (await signedUrls(supabase, "investor-ids", [app.id_file_path], 120)).get(app.id_file_path);
  const idIsPdf = app.id_file_path.endsWith(".pdf");
  const idNumber = decryptIdNumber(app.id_number_enc);

  const details: [string, string][] = [
    ["Business", app.business_name],
    ["Location", app.location],
    ["Partnership type", PARTNERSHIP_LABELS[app.partnership_type]],
    ["Background", app.business_background],
    ["Investment interest", app.investment_interest],
    ["Submitted", new Date(app.created_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })],
  ];

  return (
    <AuthShell signedIn size="lg" nav={adminNav}>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline">
        <ArrowLeft size={14} /> Dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-brand-ink">{applicant.full_name}</h1>
        <StatusBadge status={app.status} kind="investor" />
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-brand-ink">Applicant</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[7rem_1fr]">
              <dt className="text-brand-slate">Email</dt>
              <dd><a href={`mailto:${applicant.email}`} className="text-brand-blue hover:underline">{applicant.email}</a></dd>
              <dt className="text-brand-slate">Contact number</dt>
              <dd className="text-brand-ink">{applicant.phone || "—"}</dd>
              <dt className="text-brand-slate">Address</dt>
              <dd className="text-brand-ink">{applicant.address}</dd>
            </dl>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-brand-ink">Application</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-[9rem_1fr]">
              {details.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-brand-slate">{label}</dt>
                  <dd className="whitespace-pre-wrap text-brand-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-3xl border-2 border-amber-200 bg-white p-6 shadow-xl shadow-brand-blue/10 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-brand-ink">
              <ShieldAlert size={18} className="text-amber-600" /> Government ID (confidential)
            </h2>
            <p className="mt-1 text-xs text-brand-slate">
              For verification only. Don&apos;t download, copy, or share it.
            </p>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[7rem_1fr]">
              <dt className="text-brand-slate">ID type</dt>
              <dd className="text-brand-ink">{ID_TYPE_LABELS[app.id_type]}</dd>
              <dt className="text-brand-slate">ID number</dt>
              <dd className="font-mono text-brand-ink">
                {idNumber ?? <span className="font-sans text-red-700">Can&apos;t be decrypted. Check ID_ENCRYPTION_KEY.</span>}
              </dd>
            </dl>
            <div className="mt-4">
              {idUrl ? (
                idIsPdf ? (
                  <a href={idUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-blue hover:underline">
                    Open ID (PDF)
                  </a>
                ) : (
                  // Short-lived signed URL, so next/image's optimizer can't cache it.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={idUrl} alt="Applicant's government-issued ID" className="max-h-96 w-full rounded-2xl border border-black/10 object-contain" />
                )
              ) : (
                <p className="text-sm text-red-700">The ID file couldn&apos;t be loaded.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-brand-ink">Supporting documents</h2>
            <div className="mt-4">
              <DocumentList documents={documents} urls={urls} empty="No supporting documents." />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display mb-4 text-lg font-semibold text-brand-ink">Update status</h2>
            <AdminStatusForm
              action={reviewInvestor}
              id={app.id}
              kind="investor"
              statuses={INVESTOR_STATUSES}
              current={app.status}
              note={app.admin_note}
            />
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display mb-4 text-lg font-semibold text-brand-ink">Messages</h2>
            <AdminThread userId={app.user_id} messages={messages} />
          </section>
        </div>
      </div>
    </AuthShell>
  );
}

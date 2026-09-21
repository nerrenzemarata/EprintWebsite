import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminStatusForm from "@/components/AdminStatusForm";
import AdminThread from "@/components/AdminThread";
import AuthShell from "@/components/AuthShell";
import DocumentList from "@/components/DocumentList";
import StatusBadge from "@/components/StatusBadge";
import { reviewDeployment } from "@/app/actions/admin";
import {
  DEPLOYMENT_LABELS,
  DEPLOYMENT_STATUSES,
  isUuid,
  type DeploymentRequest,
  type DocumentRow,
  type Message,
  type Profile,
} from "@/lib/domain";
import { adminNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";
import { signedUrls } from "@/lib/uploads";

export const metadata: Metadata = { title: "Deployment Request | Admin" };

export default async function AdminRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const { supabase } = await requireRole("admin");

  const { data } = await supabase
    .from("deployment_requests")
    .select("*, profiles!deployment_requests_user_id_fkey(id, full_name, email, phone, address)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const request = data as unknown as DeploymentRequest & {
    profiles: Pick<Profile, "id" | "full_name" | "email" | "phone" | "address">;
  };
  const applicant = request.profiles;

  const [{ data: docRows }, { data: messageRows }] = await Promise.all([
    supabase.from("documents").select("*").eq("deployment_request_id", id).order("created_at"),
    supabase.from("messages").select("*").eq("user_id", request.user_id).order("created_at", { ascending: false }).limit(50),
  ]);
  const documents = (docRows ?? []) as DocumentRow[];
  const messages = (messageRows ?? []) as Message[];
  const urls = await signedUrls(supabase, "documents", documents.map((d) => d.path));

  const details: [string, string][] = [
    ["Type of location", DEPLOYMENT_LABELS[request.deployment_type]],
    ["Proposed location", request.site_name],
    ["Complete address", request.site_location],
    ["Description", request.description],
    ["Reason", request.reason],
    ["Submitted", new Date(request.created_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })],
  ];

  return (
    <AuthShell signedIn size="lg" nav={adminNav}>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline">
        <ArrowLeft size={14} /> Dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-brand-ink">{request.site_name}</h1>
        <StatusBadge status={request.status} kind="deployment" />
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-brand-ink">Applicant</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[7rem_1fr]">
              <dt className="text-brand-slate">Name</dt>
              <dd className="text-brand-ink">{applicant.full_name}</dd>
              <dt className="text-brand-slate">Email</dt>
              <dd><a href={`mailto:${applicant.email}`} className="text-brand-blue hover:underline">{applicant.email}</a></dd>
              <dt className="text-brand-slate">Contact number</dt>
              <dd className="text-brand-ink">{applicant.phone || "—"}</dd>
              <dt className="text-brand-slate">Address</dt>
              <dd className="text-brand-ink">{applicant.address}</dd>
            </dl>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-brand-ink">Request</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-[9rem_1fr]">
              {details.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-brand-slate">{label}</dt>
                  <dd className="whitespace-pre-wrap text-brand-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-brand-ink">Uploaded files</h2>
            <div className="mt-4">
              <DocumentList documents={documents} urls={urls} />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display mb-4 text-lg font-semibold text-brand-ink">Update status</h2>
            <AdminStatusForm
              action={reviewDeployment}
              id={request.id}
              kind="deployment"
              statuses={DEPLOYMENT_STATUSES}
              current={request.status}
              note={request.admin_note}
            />
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display mb-4 text-lg font-semibold text-brand-ink">Messages</h2>
            <AdminThread userId={request.user_id} messages={messages} />
          </section>
        </div>
      </div>
    </AuthShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import DocumentList from "@/components/DocumentList";
import DocumentUploadForm from "@/components/DocumentUploadForm";
import StatusBadge from "@/components/StatusBadge";
import StatusTracker from "@/components/StatusTracker";
import { addRequestDocuments } from "@/app/actions/deployment";
import {
  DEPLOYMENT_FLOW,
  DEPLOYMENT_LABELS,
  isUuid,
  type DeploymentRequest,
  type DocumentRow,
} from "@/lib/domain";
import { accountNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";
import { signedUrls } from "@/lib/uploads";

export const metadata: Metadata = { title: "Deployment Request | E-Print Vendo Printing" };

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string; files?: string }>;
}) {
  const { id } = await params;
  const { submitted, files } = await searchParams;
  if (!isUuid(id)) notFound();

  const { supabase } = await requireRole("customer");

  // Row-level security only returns the caller's own request.
  const { data } = await supabase.from("deployment_requests").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const request = data as DeploymentRequest;

  const { data: docRows } = await supabase
    .from("documents")
    .select("*")
    .eq("deployment_request_id", id)
    .order("created_at");
  const documents = (docRows ?? []) as DocumentRow[];
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
    <AuthShell signedIn size="lg" nav={accountNav}>
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline">
        <ArrowLeft size={14} /> All requests
      </Link>

      {submitted && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Request submitted! We&apos;ll review it and post updates here.
        </p>
      )}
      {files === "failed" && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your request was saved, but we couldn&apos;t attach your pictures. Please upload them below.
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-display text-lg font-semibold text-brand-ink">{request.site_name}</h1>
              <StatusBadge status={request.status} kind="deployment" />
            </div>
            <div className="mt-6">
              <StatusTracker flow={DEPLOYMENT_FLOW} status={request.status} kind="deployment" />
            </div>
            {request.admin_note && (
              <div className="mt-6 rounded-2xl bg-brand-blue-light px-4 py-3 text-sm text-brand-ink">
                <span className="font-semibold">Note from E-Print: </span>
                {request.admin_note}
              </div>
            )}
            <p className="mt-6 text-sm text-brand-slate">
              Questions?{" "}
              <Link href="/account#messages" className="font-semibold text-brand-blue hover:underline">
                Contact the E-Print team
              </Link>
              .
            </p>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-brand-ink">Your request</h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-[9rem_1fr]">
              {details.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-brand-slate">{label}</dt>
                  <dd className="whitespace-pre-wrap text-brand-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-brand-ink">Location pictures &amp; documents</h2>
          <div className="mt-4">
            <DocumentList documents={documents} urls={urls} />
          </div>
          <div className="mt-6 border-t border-black/5 pt-6">
            <DocumentUploadForm action={addRequestDocuments} hidden={{ name: "requestId", value: request.id }} />
          </div>
        </section>
      </div>
    </AuthShell>
  );
}

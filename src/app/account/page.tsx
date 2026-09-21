import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import MessagePanel from "@/components/MessagePanel";
import StatusBadge from "@/components/StatusBadge";
import { DEPLOYMENT_LABELS, type DeploymentRequest, type Message } from "@/lib/domain";
import { accountNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "My Dashboard | E-Print Vendo Printing" };

export default async function AccountPage() {
  const { supabase, profile } = await requireRole("customer");

  const [{ data: requestRows }, { data: messageRows }] = await Promise.all([
    supabase.from("deployment_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(50),
  ]);
  const requests = (requestRows ?? []) as DeploymentRequest[];
  const messages = (messageRows ?? []) as Message[];

  return (
    <AuthShell signedIn size="lg" nav={accountNav}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-ink">
            Hi, {profile.first_name || "there"}!
          </h1>
          <p className="mt-1 text-sm text-brand-slate">{profile.email}</p>
        </div>
        <Link
          href="/account/requests/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-gold-dark hover:text-white"
        >
          <Plus size={16} /> New deployment request
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold text-brand-ink">My deployment requests</h2>

          {requests.length === 0 && (
            <div className="rounded-3xl bg-white p-8 text-center shadow-xl shadow-brand-blue/10 ring-1 ring-black/5">
              <p className="text-sm text-brand-slate">You haven&apos;t submitted a deployment request yet.</p>
              <Link
                href="/account/requests/new"
                className="mt-4 inline-block rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue-dark"
              >
                Start your first request
              </Link>
            </div>
          )}

          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/account/requests/${r.id}`}
              className="group rounded-3xl bg-white p-6 shadow-lg shadow-brand-blue/5 ring-1 ring-black/5 transition-shadow hover:shadow-xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-brand-ink">{r.site_name}</h3>
                  <p className="mt-0.5 text-sm text-brand-slate">
                    {DEPLOYMENT_LABELS[r.deployment_type]} · {r.site_location}
                  </p>
                </div>
                <StatusBadge status={r.status} kind="deployment" />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-brand-slate">
                <span>
                  Submitted {new Date(r.created_at).toLocaleDateString("en-PH", { dateStyle: "medium" })}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-brand-blue">
                  View details <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <div id="messages" className="scroll-mt-24">
          <MessagePanel messages={messages} />
        </div>
      </div>
    </AuthShell>
  );
}

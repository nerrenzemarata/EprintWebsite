import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, CheckCircle2, ClipboardList, Clock, Hourglass, Rocket } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import StatusBadge from "@/components/StatusBadge";
import {
  DEPLOYMENT_LABELS,
  DEPLOYMENT_STATUSES,
  INVESTOR_STATUSES,
  statusLabel,
  type DeploymentRequest,
  type InvestorApplication,
  type Profile,
  type StatusKind,
} from "@/lib/domain";
import { adminNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Admin | E-Print Vendo Printing" };

type Who = Pick<Profile, "full_name" | "email" | "phone">;
type RequestRow = DeploymentRequest & { profiles: Who | null };
type InvestorRow = InvestorApplication & { profiles: Who | null };

const date = (iso: string) => new Date(iso).toLocaleDateString("en-PH", { dateStyle: "medium" });

function StatCard({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg shadow-brand-blue/5 ring-1 ring-black/5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
        <Icon size={22} />
      </span>
      <div>
        <div className="font-display text-2xl font-bold text-brand-ink">{value}</div>
        <div className="text-xs text-brand-slate">{label}</div>
      </div>
    </div>
  );
}

function FilterTabs({
  param,
  other,
  otherValue,
  statuses,
  active,
  kind,
  counts,
  total,
}: {
  param: "d" | "i";
  other: "d" | "i";
  otherValue?: string;
  statuses: readonly string[];
  active?: string;
  kind: StatusKind;
  counts: Record<string, number>;
  total: number;
}) {
  const href = (value?: string) => {
    const q = new URLSearchParams();
    if (value) q.set(param, value);
    if (otherValue) q.set(other, otherValue);
    const s = q.toString();
    return s ? `/admin?${s}` : "/admin";
  };
  const tab = (label: string, count: number, value?: string) => (
    <Link
      key={value ?? "all"}
      href={href(value)}
      className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
        active === value ? "bg-brand-blue text-white" : "bg-white text-brand-slate ring-1 ring-black/5 hover:bg-brand-blue-light"
      }`}
    >
      {label} <span className="opacity-70">({count})</span>
    </Link>
  );
  return (
    <nav className="flex flex-wrap gap-2">
      {tab("All", total)}
      {statuses.map((s) => tab(statusLabel(s, kind), counts[s] ?? 0, s))}
    </nav>
  );
}

const th = "px-4 py-3 text-left text-xs font-semibold tracking-wide text-brand-slate uppercase";
const td = "px-4 py-3 align-top";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; i?: string }>;
}) {
  const { supabase } = await requireRole("admin");
  const { d, i } = await searchParams;
  const dFilter = DEPLOYMENT_STATUSES.find((s) => s === d);
  const iFilter = INVESTOR_STATUSES.find((s) => s === i);

  const [requestsRes, investorsRes] = await Promise.all([
    supabase
      .from("deployment_requests")
      .select("*, profiles!deployment_requests_user_id_fkey(full_name, email, phone)")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("investor_applications")
      .select("*, profiles!investor_applications_user_id_fkey(full_name, email, phone)")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const requests = (requestsRes.data ?? []) as unknown as RequestRow[];
  const investors = (investorsRes.data ?? []) as unknown as InvestorRow[];

  const countBy = (rows: { status: string }[]) => {
    const out: Record<string, number> = {};
    for (const r of rows) out[r.status] = (out[r.status] ?? 0) + 1;
    return out;
  };
  const dCounts = countBy(requests);
  const iCounts = countBy(investors);

  const shownRequests = dFilter ? requests.filter((r) => r.status === dFilter) : requests;
  const shownInvestors = iFilter ? investors.filter((r) => r.status === iFilter) : investors;

  const loadError = requestsRes.error ?? investorsRes.error;

  return (
    <AuthShell signedIn size="lg" nav={adminNav}>
      <h1 className="font-display text-2xl font-bold text-brand-ink">Admin dashboard</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Review deployment requests and investor applications. Applicants see status changes on their dashboard.
      </p>

      {loadError && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn&apos;t load data: {loadError.message}. Have you run <code>supabase/phase2.sql</code>?
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={ClipboardList} label="Total deployment requests" value={requests.length} />
        <StatCard icon={Clock} label="Pending deployments" value={dCounts.pending ?? 0} />
        <StatCard icon={CheckCircle2} label="Approved deployments" value={(dCounts.approved ?? 0) + (dCounts.scheduled ?? 0)} />
        <StatCard icon={Rocket} label="Active deployments" value={dCounts.deployed ?? 0} />
        <StatCard icon={Briefcase} label="Potential investors" value={investors.length} />
        <StatCard icon={Hourglass} label="Pending investor applications" value={iCounts.pending ?? 0} />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-brand-ink">Deployment requests</h2>
        <div className="mt-3">
          <FilterTabs param="d" other="i" otherValue={iFilter} statuses={DEPLOYMENT_STATUSES} active={dFilter} kind="deployment" counts={dCounts} total={requests.length} />
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-lg shadow-brand-blue/5 ring-1 ring-black/5">
          <table className="w-full min-w-[42rem] text-sm">
            <thead className="border-b border-black/5 bg-black/[0.02]">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Location</th>
                <th className={th}>Date submitted</th>
                <th className={th}>Status</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {shownRequests.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-brand-slate">No deployment requests here.</td></tr>
              )}
              {shownRequests.map((r) => (
                <tr key={r.id}>
                  <td className={td}>
                    <div className="font-medium text-brand-ink">{r.profiles?.full_name}</div>
                    <div className="text-xs text-brand-slate">{r.profiles?.email}</div>
                  </td>
                  <td className={td}>
                    <div className="text-brand-ink">{r.site_name}</div>
                    <div className="text-xs text-brand-slate">{DEPLOYMENT_LABELS[r.deployment_type]}</div>
                  </td>
                  <td className={`${td} whitespace-nowrap text-brand-slate`}>{date(r.created_at)}</td>
                  <td className={td}><StatusBadge status={r.status} kind="deployment" /></td>
                  <td className={td}>
                    <Link href={`/admin/requests/${r.id}`} className="font-semibold whitespace-nowrap text-brand-blue hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-brand-ink">Investor applications</h2>
        <div className="mt-3">
          <FilterTabs param="i" other="d" otherValue={dFilter} statuses={INVESTOR_STATUSES} active={iFilter} kind="investor" counts={iCounts} total={investors.length} />
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-lg shadow-brand-blue/5 ring-1 ring-black/5">
          <table className="w-full min-w-[42rem] text-sm">
            <thead className="border-b border-black/5 bg-black/[0.02]">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Business</th>
                <th className={th}>Date submitted</th>
                <th className={th}>Status</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {shownInvestors.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-brand-slate">No investor applications here.</td></tr>
              )}
              {shownInvestors.map((a) => (
                <tr key={a.id}>
                  <td className={td}>
                    <div className="font-medium text-brand-ink">{a.profiles?.full_name}</div>
                    <div className="text-xs text-brand-slate">{a.profiles?.email}</div>
                  </td>
                  <td className={`${td} text-brand-ink`}>{a.business_name}</td>
                  <td className={`${td} whitespace-nowrap text-brand-slate`}>{date(a.created_at)}</td>
                  <td className={td}><StatusBadge status={a.status} kind="investor" /></td>
                  <td className={td}>
                    <Link href={`/admin/investors/${a.id}`} className="font-semibold whitespace-nowrap text-brand-blue hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AuthShell>
  );
}

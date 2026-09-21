import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import { setUserRole } from "@/app/actions/admin";
import type { Profile } from "@/lib/domain";
import { adminNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";
import { inputClass } from "@/components/styles";

export const metadata: Metadata = { title: "Users | Admin" };

type Row = Profile & { created_at: string };

const th = "px-4 py-3 text-left text-xs font-semibold tracking-wide text-brand-slate uppercase";

export default async function AdminUsersPage() {
  const { supabase, user } = await requireRole("admin");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, address, role, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  const users = (data ?? []) as Row[];

  return (
    <AuthShell signedIn size="lg" nav={adminNav}>
      <h1 className="font-display text-2xl font-bold text-brand-ink">Users</h1>
      <p className="mt-1 text-sm text-brand-slate">
        Everyone with an account. Roles control what each person can see: customers request
        deployments, investors apply to partner, admins manage everything.
      </p>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Couldn&apos;t load users: {error.message}</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-lg shadow-brand-blue/5 ring-1 ring-black/5">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="border-b border-black/5 bg-black/[0.02]">
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Contact</th>
              <th className={th}>Joined</th>
              <th className={th}>Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 align-top font-medium text-brand-ink">{u.full_name || "—"}</td>
                <td className="px-4 py-3 align-top">
                  <div className="text-brand-ink">{u.email}</div>
                  <div className="text-xs text-brand-slate">{u.phone}</div>
                </td>
                <td className="px-4 py-3 align-top whitespace-nowrap text-brand-slate">
                  {new Date(u.created_at).toLocaleDateString("en-PH", { dateStyle: "medium" })}
                </td>
                <td className="px-4 py-3 align-top">
                  {u.id === user.id ? (
                    <span className="text-xs font-semibold text-brand-slate">Admin (you)</span>
                  ) : (
                    <form action={setUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select name="role" defaultValue={u.role} aria-label={`Role for ${u.email}`} className={`${inputClass} !w-auto !py-1.5`}>
                        <option value="customer">Customer</option>
                        <option value="investor">Investor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button type="submit" className="rounded-full bg-brand-blue px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-blue-dark">
                        Save
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthShell>
  );
}

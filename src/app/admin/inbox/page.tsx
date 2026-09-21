import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import { sendAdminMessage, setContactHandled } from "@/app/actions/admin";
import { inputClass } from "@/components/styles";
import type { Message, Profile } from "@/lib/domain";
import { adminNav } from "@/lib/nav";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Inbox | Admin" };

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  handled: boolean;
  created_at: string;
};
type UserMessage = Message & { profiles: Pick<Profile, "full_name" | "email" | "role"> | null };

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminInboxPage() {
  const { supabase } = await requireRole("admin");

  const [contactRes, messageRes] = await Promise.all([
    supabase.from("contact_messages").select("*").order("handled").order("created_at", { ascending: false }).limit(100),
    supabase
      .from("messages")
      .select("*, profiles!messages_user_id_fkey(full_name, email, role)")
      .eq("sender", "user")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);
  const contacts = (contactRes.data ?? []) as Contact[];
  const userMessages = (messageRes.data ?? []) as unknown as UserMessage[];

  return (
    <AuthShell signedIn size="lg" nav={adminNav}>
      <h1 className="font-display text-2xl font-bold text-brand-ink">Inbox</h1>

      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-lg font-semibold text-brand-ink">Contact form messages</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {contacts.length === 0 && (
              <li className="rounded-2xl bg-white p-6 text-center text-sm text-brand-slate ring-1 ring-black/5">
                No messages yet.
              </li>
            )}
            {contacts.map((c) => (
              <li key={c.id} className={`rounded-2xl bg-white p-5 ring-1 ring-black/5 ${c.handled ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brand-ink">{c.subject}</p>
                    <p className="text-xs text-brand-slate">
                      {c.name} ·{" "}
                      <a href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`} className="text-brand-blue hover:underline">
                        {c.email}
                      </a>{" "}
                      · {when(c.created_at)}
                    </p>
                  </div>
                  <form action={setContactHandled}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="handled" value={c.handled ? "false" : "true"} />
                    <button type="submit" className="text-xs font-semibold whitespace-nowrap text-brand-blue hover:underline">
                      {c.handled ? "Reopen" : "Mark handled"}
                    </button>
                  </form>
                </div>
                <p className="mt-3 text-sm whitespace-pre-wrap text-brand-ink">{c.message}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-brand-ink">Messages from customers &amp; investors</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {userMessages.length === 0 && (
              <li className="rounded-2xl bg-white p-6 text-center text-sm text-brand-slate ring-1 ring-black/5">
                No messages yet.
              </li>
            )}
            {userMessages.map((m) => (
              <li key={m.id} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
                <p className="text-xs text-brand-slate">
                  <span className="font-semibold text-brand-ink">{m.profiles?.full_name}</span> ({m.profiles?.role}) ·{" "}
                  {m.profiles?.email} · {when(m.created_at)}
                </p>
                <p className="mt-2 text-sm whitespace-pre-wrap text-brand-ink">{m.body}</p>
                <form action={sendAdminMessage} className="mt-3 flex gap-2">
                  <input type="hidden" name="userId" value={m.user_id} />
                  <input name="body" required maxLength={2000} placeholder="Reply…" aria-label="Reply" className={`${inputClass} !py-2`} />
                  <button type="submit" className="rounded-full bg-brand-gold px-4 text-sm font-semibold text-brand-ink hover:bg-brand-gold-dark hover:text-white">
                    Reply
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AuthShell>
  );
}

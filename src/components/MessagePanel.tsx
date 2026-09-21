import { CheckCheck } from "lucide-react";
import { markMessagesRead } from "@/app/actions/messages";
import type { Message } from "@/lib/domain";
import MessageForm from "./MessageForm";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });

const senderLabel = { user: "You", admin: "E-Print team", system: "Status update" } as const;

// Updates from E-Print and the user's replies, newest first. `messages` are the
// user's own thread (row-level security makes sure of that).
export default function MessagePanel({ messages }: { messages: Message[] }) {
  const unread = messages.filter((m) => m.sender !== "user" && !m.read_at).length;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-brand-ink">
          Updates &amp; messages
          {unread > 0 && (
            <span className="ml-2 rounded-full bg-brand-gold px-2.5 py-0.5 text-xs font-bold text-brand-ink">
              {unread} new
            </span>
          )}
        </h2>
        {unread > 0 && (
          <form action={markMessagesRead}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          </form>
        )}
      </div>

      <div className="mt-5">
        <MessageForm />
      </div>

      <ul className="mt-6 flex max-h-96 flex-col gap-3 overflow-y-auto">
        {messages.length === 0 && (
          <li className="text-sm text-brand-slate">
            No messages yet. Status updates from E-Print will appear here.
          </li>
        )}
        {messages.map((m) => (
          <li
            key={m.id}
            className={`rounded-2xl px-4 py-3 text-sm ${
              m.sender === "user"
                ? "ml-8 bg-brand-blue-light text-brand-ink"
                : m.sender === "admin"
                  ? "mr-8 bg-brand-gold/15 text-brand-ink"
                  : "mr-8 bg-black/[0.04] text-brand-ink"
            }`}
          >
            <div className="flex items-center justify-between gap-3 text-xs text-brand-slate">
              <span className="font-semibold">
                {senderLabel[m.sender]}
                {m.sender !== "user" && !m.read_at && (
                  <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-gold align-middle" />
                )}
              </span>
              <time dateTime={m.created_at}>{when(m.created_at)}</time>
            </div>
            <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

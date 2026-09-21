import { sendAdminMessage } from "@/app/actions/admin";
import type { Message } from "@/lib/domain";
import { inputClass } from "./styles";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });

const senderLabel = { user: "Applicant", admin: "E-Print team", system: "Status update" } as const;

// One user's message thread, with a reply box. The reply arrives on their dashboard.
export default function AdminThread({
  userId,
  messages,
}: {
  userId: string;
  messages: Message[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <form action={sendAdminMessage} className="flex flex-col gap-3">
        <input type="hidden" name="userId" value={userId} />
        <label htmlFor={`body-${userId}`} className="text-sm font-medium text-brand-ink">
          Send a message
        </label>
        <textarea
          id={`body-${userId}`}
          name="body"
          required
          rows={3}
          maxLength={2000}
          className={inputClass}
          placeholder="This appears on the applicant's dashboard."
        />
        <button
          type="submit"
          className="self-start rounded-full bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-gold-dark hover:text-white"
        >
          Send
        </button>
      </form>

      <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.length === 0 && <li className="text-sm text-brand-slate">No messages yet.</li>}
        {messages.map((m) => (
          <li
            key={m.id}
            className={`rounded-2xl px-4 py-3 text-sm ${
              m.sender === "user" ? "mr-8 bg-brand-blue-light" : m.sender === "admin" ? "ml-8 bg-brand-gold/15" : "ml-8 bg-black/[0.04]"
            }`}
          >
            <div className="flex justify-between gap-3 text-xs text-brand-slate">
              <span className="font-semibold">{senderLabel[m.sender]}</span>
              <time dateTime={m.created_at}>{when(m.created_at)}</time>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-brand-ink">{m.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

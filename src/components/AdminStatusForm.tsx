import { statusLabel, type StatusKind } from "@/lib/domain";
import { inputClass } from "./styles";

// Plain server-action form: no client JS needed. The note is included in the
// message the applicant automatically receives when the status changes.
export default function AdminStatusForm({
  action,
  id,
  kind,
  statuses,
  current,
  note,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  kind: StatusKind;
  statuses: readonly string[];
  current: string;
  note: string | null;
}) {
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium text-brand-ink">
          Status
        </label>
        <select id="status" name="status" defaultValue={current} className={inputClass}>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s, kind)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="adminNote" className="text-sm font-medium text-brand-ink">
          Note to applicant (optional)
        </label>
        <textarea
          id="adminNote"
          name="adminNote"
          rows={3}
          maxLength={500}
          defaultValue={note ?? ""}
          placeholder="e.g. We'll visit the site on Monday morning."
          className={inputClass}
        />
        <p className="text-xs text-brand-slate">
          Changing the status sends the applicant an update automatically.
        </p>
      </div>
      <button
        type="submit"
        className="self-start rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
      >
        Save status
      </button>
    </form>
  );
}

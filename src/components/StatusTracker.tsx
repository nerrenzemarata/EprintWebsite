import { Check, X } from "lucide-react";
import { statusLabel, type StatusKind } from "@/lib/domain";

// Progress through the happy path. A negative outcome replaces the remaining steps.
export default function StatusTracker({
  flow,
  status,
  kind,
}: {
  flow: readonly string[];
  status: string;
  kind: StatusKind;
}) {
  const negative = status === "rejected" || status === "not_approved";
  const current = flow.indexOf(status);

  return (
    <ol className="flex flex-col gap-3">
      {flow.map((step, i) => {
        const done = !negative && current >= i;
        const active = !negative && current === i;
        return (
          <li key={step} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                done
                  ? "bg-emerald-500 text-white"
                  : "border-2 border-black/10 text-transparent"
              }`}
            >
              <Check size={14} />
            </span>
            <span
              className={
                active
                  ? "font-semibold text-brand-ink"
                  : done
                    ? "font-medium text-brand-ink"
                    : "text-brand-slate"
              }
            >
              {statusLabel(step, kind)}
              {active && <span className="ml-2 text-xs font-medium text-brand-blue">Current</span>}
            </span>
          </li>
        );
      })}
      {negative && (
        <li className="flex items-center gap-3 text-sm">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
            <X size={14} />
          </span>
          <span className="font-semibold text-red-700">{statusLabel(status, kind)}</span>
        </li>
      )}
    </ol>
  );
}

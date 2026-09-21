import { STATUS_TONE, statusLabel, type StatusKind } from "@/lib/domain";

const tones = {
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-emerald-100 text-emerald-800",
  red: "bg-red-100 text-red-800",
} as const;

export default function StatusBadge({
  status,
  kind,
}: {
  status: string;
  kind: StatusKind;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${tones[STATUS_TONE[status] ?? "blue"]}`}
    >
      {statusLabel(status, kind)}
    </span>
  );
}

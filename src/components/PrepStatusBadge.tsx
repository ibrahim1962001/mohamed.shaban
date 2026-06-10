import { getPrepStatus } from "@/lib/prep-status";

export default function PrepStatusBadge({
  prepStatus,
  className = "",
}: {
  prepStatus?: string;
  className?: string;
}) {
  const status = getPrepStatus(prepStatus);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${status.badgeClass} ${className}`}
    >
      {status.label}
    </span>
  );
}

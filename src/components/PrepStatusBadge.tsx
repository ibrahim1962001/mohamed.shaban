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
      className={`inline-flex items-center rounded-full border-2 px-2.5 py-1 text-xs font-extrabold shadow-lg ring-2 ring-white/90 ${status.badgeClass} ${className}`}
    >
      {status.label}
    </span>
  );
}

export type Status = "pendiente" | "revision" | "hecho";

const DOT_COLORS: Record<Status, string> = {
  pendiente: "bg-red-400",
  revision: "bg-yellow-400",
  hecho: "bg-emerald-500",
};

const EMOJIS: Record<Status, string> = {
  pendiente: "🔴",
  revision: "🟡",
  hecho: "🟢",
};

export function statusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    pendiente: "Pendiente",
    revision: "En revisión",
    hecho: "Hecho",
  };
  return labels[status];
}

interface StatusDotProps {
  status: Status;
  size?: "sm" | "md";
}

export function StatusDot({ status, size = "md" }: StatusDotProps) {
  const sz = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  return (
    <span
      className={`inline-block rounded-full ${sz} ${DOT_COLORS[status]} flex-shrink-0`}
    />
  );
}

export function StatusEmoji({ status }: { status: Status }) {
  return <span>{EMOJIS[status]}</span>;
}

export function StatusBadge({ status }: { status: Status }) {
  const colors: Record<Status, string> = {
    pendiente: "bg-red-50 text-red-600 border-red-200",
    revision: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hecho: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status]}`}
    >
      <StatusDot status={status} size="sm" />
      {statusLabel(status)}
    </span>
  );
}

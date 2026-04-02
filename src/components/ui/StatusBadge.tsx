type Status = "open" | "active" | "resolved" | "escalated";

const STATUS_CONFIG: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  open: {
    label: "Open",
    dot: "bg-status-open",
    bg: "bg-status-open-soft",
    text: "text-status-open",
  },
  active: {
    label: "Active",
    dot: "bg-status-active",
    bg: "bg-status-active-soft",
    text: "text-status-active",
  },
  resolved: {
    label: "Resolved",
    dot: "bg-status-resolved",
    bg: "bg-status-resolved-soft",
    text: "text-status-resolved",
  },
  escalated: {
    label: "Escalated",
    dot: "bg-status-escalated",
    bg: "bg-status-escalated-soft",
    text: "text-status-escalated",
  },
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

import Link from "next/link";
import { AppShell } from "@/components/layout";

const CHATS = [
  {
    id: "TK-4201",
    title: "Billing cycle inquiry",
    preview:
      "When does my current billing cycle end? I want to know before I upgrade...",
    timestamp: "2 min ago",
    status: "resolved" as const,
  },
  {
    id: "TK-4200",
    title: "SSO login failure",
    preview:
      "I can't log in with SSO anymore. It was working fine yesterday...",
    timestamp: "8 min ago",
    status: "escalated" as const,
  },
  {
    id: "TK-4199",
    title: "Unauthorized renewal refund",
    preview: "I was charged $42 for a renewal I didn't authorize...",
    timestamp: "12 min ago",
    status: "resolved" as const,
  },
  {
    id: "TK-4198",
    title: "CSV export feature request",
    preview: "Is there a way to export our support analytics data to CSV?...",
    timestamp: "18 min ago",
    status: "resolved" as const,
  },
  {
    id: "TK-4197",
    title: "Password reset not arriving",
    preview: "I forgot my password and the reset email isn't arriving...",
    timestamp: "24 min ago",
    status: "resolved" as const,
  },
  {
    id: "TK-4196",
    title: "Escalation: Negative sentiment",
    preview:
      "This is absolutely unacceptable. I've been trying to get help for 3 days...",
    timestamp: "31 min ago",
    status: "escalated" as const,
  },
  {
    id: "TK-4195",
    title: "Enterprise to Pro downgrade",
    preview: "We'd like to downgrade from Enterprise to Pro plan...",
    timestamp: "45 min ago",
    status: "resolved" as const,
  },
  {
    id: "default",
    title: "Billing email change + invoice",
    preview:
      "Hi, can you change my billing email to jake@parahelp.com and send me my latest invoice?",
    timestamp: "1 hour ago",
    status: "resolved" as const,
  },
];

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  resolved: { dot: "bg-badge-green", label: "Resolved" },
  escalated: { dot: "bg-risk-high", label: "Escalated" },
  open: { dot: "bg-badge-blue", label: "Open" },
  active: { dot: "bg-badge-orange", label: "Active" },
};

export default function ChatsPage() {
  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-4 md:px-6">
          <h1 className="text-sm font-semibold text-text-primary">Tickets</h1>
          <span className="text-[12px] text-text-tertiary">
            {CHATS.length} tickets
          </span>
        </header>

        <div className="flex-1 overflow-y-auto">
          {CHATS.map((chat) => {
            const statusStyle =
              STATUS_STYLES[chat.status] ?? STATUS_STYLES.resolved;
            return (
              <Link
                key={chat.id}
                href={`/tickets/${chat.id}`}
                className="flex items-center gap-3 border-b border-border-default px-4 md:px-6 py-4 transition-colors hover:bg-surface-secondary"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[11px] text-text-tertiary shrink-0">
                        {chat.id}
                      </span>
                      <span className="text-[14px] font-medium text-text-primary truncate">
                        {chat.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                        />
                        <span className="text-[11px] text-text-tertiary">
                          {statusStyle.label}
                        </span>
                      </div>
                      <span className="text-[12px] text-text-tertiary">
                        {chat.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="mt-0.5 text-[13px] text-text-tertiary truncate">
                    {chat.preview}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

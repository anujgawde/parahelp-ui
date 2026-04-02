"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Panel } from "@/components/ui";
import { ChevronDownIcon, FileIcon, EditIcon, CheckIcon } from "@/components/icons";

type ActivityType = "all" | "policy" | "tool" | "memory" | "publish";

interface ActivityEntry {
  id: string;
  type: "policy" | "tool" | "memory" | "publish";
  title: string;
  description: string;
  author: string;
  timestamp: string;
  fileName?: string;
  diffSummary?: string;
  details?: string;
}

const ACTIVITY: ActivityEntry[] = [
  {
    id: "act-1",
    type: "policy",
    title: "Updated technical troubleshooting policy",
    description: "Added check_service_status tool instruction for platform-wide issues",
    author: "Parahelp Assistant",
    timestamp: "30 min ago",
    fileName: "technical-troubleshooting.md",
    diffSummary: "+1 lines",
    details: 'Added: **Check for Service Issues:** When users report issues that could be related to platform-wide problems, use the `check_service_status` tool to check for any known service issues or outages.',
  },
  {
    id: "act-2",
    type: "publish",
    title: "Published configuration changes",
    description: "2 memory files updated, 4 test cases passed",
    author: "Replit Admin",
    timestamp: "2 hours ago",
  },
  {
    id: "act-3",
    type: "memory",
    title: "Created refund-requests memory file",
    description: "New policy for handling refund requests with auto-approval under $500",
    author: "Parahelp Assistant",
    timestamp: "3 hours ago",
    fileName: "refund-requests.md",
    diffSummary: "+12 lines",
    details: "Defined refund eligibility rules: auto-approve under $500 within 30 days, escalate above $500, check for abuse patterns in refund history.",
  },
  {
    id: "act-4",
    type: "tool",
    title: "Configured check_service_status tool",
    description: "Connected to status page API to check for active incidents",
    author: "Replit Admin",
    timestamp: "16 hours ago",
    details: "Tool fetches from status.replit.com API. Returns active incidents with severity, affected components, and estimated resolution time.",
  },
  {
    id: "act-5",
    type: "policy",
    title: "Updated cancellation flow",
    description: "Added 14-day full refund window for new subscriptions",
    author: "Parahelp Assistant",
    timestamp: "1 day ago",
    fileName: "cancellation-requests.md",
    diffSummary: "+3 lines, -1 line",
    details: "If within first 14 days, offer full refund. If past 14 days, offer prorated refund. Always attempt retention before processing.",
  },
  {
    id: "act-6",
    type: "memory",
    title: "Updated billing FAQ knowledge",
    description: "Added enterprise billing cycle information",
    author: "Parahelp Assistant",
    timestamp: "2 days ago",
    fileName: "billing-faq.md",
    diffSummary: "+4 lines",
  },
  {
    id: "act-7",
    type: "publish",
    title: "Published configuration changes",
    description: "5 memory files updated, 8 test cases passed",
    author: "Replit Admin",
    timestamp: "3 days ago",
  },
  {
    id: "act-8",
    type: "tool",
    title: "Configured Stripe subscription lookup",
    description: "Added tool to retrieve customer subscription details from Stripe",
    author: "Replit Admin",
    timestamp: "5 days ago",
    details: "Retrieves plan name, billing cycle dates, payment method, and invoice history for a given customer email.",
  },
];

const TYPE_STYLES: Record<string, { label: string; bg: string; text: string; icon: typeof FileIcon }> = {
  policy: { label: "Policy", bg: "bg-badge-blue-soft", text: "text-badge-blue", icon: FileIcon },
  tool: { label: "Tool", bg: "bg-badge-purple-soft", text: "text-badge-purple", icon: EditIcon },
  memory: { label: "Memory", bg: "bg-badge-green-soft", text: "text-badge-green", icon: FileIcon },
  publish: { label: "Published", bg: "bg-surface-tertiary", text: "text-text-primary", icon: CheckIcon },
};

const FILTERS: { value: ActivityType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "policy", label: "Policy" },
  { value: "tool", label: "Tool" },
  { value: "memory", label: "Memory" },
  { value: "publish", label: "Published" },
];

export default function ActivityPage() {
  const [filter, setFilter] = useState<ActivityType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? ACTIVITY
      : ACTIVITY.filter((a) => a.type === filter);

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-4 md:px-6">
          <h1 className="text-sm font-semibold text-text-primary">Activity</h1>
          <span className="text-[12px] text-text-tertiary">
            {filtered.length} events
          </span>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-2 border-b border-border-default px-4 py-2.5 md:px-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                filter === f.value
                  ? "bg-surface-inverse text-text-inverse"
                  : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Activity list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((entry) => {
            const style = TYPE_STYLES[entry.type];
            const Icon = style.icon;
            const isExpanded = expandedId === entry.id;

            return (
              <div
                key={entry.id}
                className="border-b border-border-default"
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : entry.id)
                  }
                  className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-secondary md:px-6"
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${style.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${style.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-text-primary truncate">
                        {entry.title}
                      </span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-text-secondary truncate">
                      {entry.description}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-text-tertiary">
                      <span>{entry.author}</span>
                      <span>{entry.timestamp}</span>
                      {entry.fileName && (
                        <span className="font-mono">{entry.fileName}</span>
                      )}
                      {entry.diffSummary && (
                        <span className="text-badge-green">{entry.diffSummary}</span>
                      )}
                    </div>
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 mt-1 shrink-0 text-text-tertiary transition-transform ${
                      isExpanded ? "" : "-rotate-90"
                    }`}
                  />
                </button>

                {isExpanded && entry.details && (
                  <div className="px-4 pb-4 pl-12 animate-fade-in md:px-6 md:pl-16">
                    <Panel>
                      <p className="text-[13px] leading-relaxed text-text-secondary whitespace-pre-line">
                        {entry.details}
                      </p>
                    </Panel>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout";
import { Panel } from "@/components/ui";
import { ClockIcon, CheckIcon, PlusIcon } from "@/components/icons";

interface ScheduledChat {
  id: string;
  title: string;
  prompt: string;
  schedule: string;
  lastRun: string | null;
  nextRun: string;
  enabled: boolean;
}

const SCHEDULED_CHATS: ScheduledChat[] = [
  {
    id: "sc-1",
    title: "Gap analysis — transferred tickets",
    prompt: "Analyze all tickets transferred by the AI agent from the past 2 days. Identify gaps in knowledge and procedures, then update configurations.",
    schedule: "Every 2 days at 9:00 AM",
    lastRun: "Yesterday at 9:00 AM",
    nextRun: "Tomorrow at 9:00 AM",
    enabled: true,
  },
  {
    id: "sc-2",
    title: "Bug pattern report",
    prompt: "Analyze all tickets related to bug reports from the past 3 days and identify patterns — specifically bug reports mentioned in over 3 tickets.",
    schedule: "Every 3 days at 10:00 AM",
    lastRun: "2 days ago",
    nextRun: "Tomorrow at 10:00 AM",
    enabled: true,
  },
  {
    id: "sc-3",
    title: "Weekly performance digest",
    prompt: "Generate a summary of AI agent performance for the past 7 days: resolution rate, avg handle time, top categories, and CSAT trends.",
    schedule: "Every Monday at 8:00 AM",
    lastRun: "Last Monday",
    nextRun: "Next Monday at 8:00 AM",
    enabled: true,
  },
  {
    id: "sc-4",
    title: "Sentiment alert check",
    prompt: "Check for any tickets with negative sentiment scores in the past 24 hours that were not escalated. Flag these for review.",
    schedule: "Daily at 6:00 PM",
    lastRun: "Today at 6:00 PM",
    nextRun: "Tomorrow at 6:00 PM",
    enabled: false,
  },
];

export default function ScheduledChatsPage() {
  const [chats, setChats] = useState(SCHEDULED_CHATS);

  function toggleChat(id: string) {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-4 md:px-6">
          <h1 className="text-sm font-semibold text-text-primary">
            Scheduled chats
          </h1>
          <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border-default px-3 text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary">
            <PlusIcon className="h-3.5 w-3.5" />
            New schedule
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-3xl space-y-3">
            {chats.map((chat) => (
              <Panel key={chat.id}>
                <div className="flex items-start gap-4">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleChat(chat.id)}
                    className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                      chat.enabled
                        ? "bg-surface-inverse"
                        : "bg-surface-tertiary"
                    }`}
                    role="switch"
                    aria-checked={chat.enabled}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        chat.enabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-[14px] font-medium ${
                          chat.enabled
                            ? "text-text-primary"
                            : "text-text-tertiary"
                        }`}
                      >
                        {chat.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          chat.enabled
                            ? "bg-badge-green-soft text-badge-green"
                            : "bg-surface-tertiary text-text-tertiary"
                        }`}
                      >
                        {chat.enabled ? "Active" : "Paused"}
                      </span>
                    </div>

                    <p
                      className={`mt-1 text-[13px] ${
                        chat.enabled
                          ? "text-text-secondary"
                          : "text-text-tertiary"
                      }`}
                    >
                      {chat.prompt}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-[11px] text-text-tertiary">
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="h-3.5 w-3.5" />
                        <span>{chat.schedule}</span>
                      </div>
                      {chat.lastRun && (
                        <div className="flex items-center gap-1.5">
                          <CheckIcon className="h-3.5 w-3.5" />
                          <span>Last: {chat.lastRun}</span>
                        </div>
                      )}
                      <span>Next: {chat.nextRun}</span>
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

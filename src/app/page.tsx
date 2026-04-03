"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout";
import { ChatTopBar } from "@/components/chat/ChatTopBar";
import { UserMessage } from "@/components/chat/ChatMessage";
import { AgentResponse } from "@/components/chat/AgentResponse";
import { ChatInput } from "@/components/chat/ChatInput";
import { ActionsPanel } from "@/components/chat/ActionsPanel";
import { SendIcon, SettingsIcon } from "@/components/icons";
import { conversations } from "@/data/chat";
import type { ActionBlock } from "@/data/types";

export default function ChatPage() {
  return (
    <Suspense fallback={<EmptyState />}>
      <ChatRouter />
    </Suspense>
  );
}

function ChatRouter() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat");

  if (!chatId) {
    return <EmptyState />;
  }

  const conversation = conversations.find((c) => c.id === chatId) ?? conversations[0];

  return <ConversationView conversation={conversation} />;
}

/* ——— Empty State ——— */

function EmptyState() {
  const [value, setValue] = useState("");

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-tertiary mb-4">
              <svg
                className="h-6 w-6 text-text-tertiary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h2 className="text-[16px] font-semibold text-text-primary mb-1">
              New conversation
            </h2>
            <p className="text-[13px] text-text-tertiary max-w-xs">
              Ask the assistant to analyze tickets, update configurations, run
              tests, or generate reports.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl shrink-0 border-t border-border-default bg-surface-primary px-4 pb-4 pt-2 md:px-6">
          <div className="flex items-center gap-2 rounded-xl border border-border-default bg-surface-primary px-3 py-2 focus-within:border-border-strong transition-colors">
            <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-secondary">
              <SettingsIcon className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="What should I do?"
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
            />
            <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-inverse text-text-inverse transition-colors hover:bg-surface-inverse/80">
              <SendIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ——— Conversation View ——— */

function ConversationView({
  conversation,
}: {
  conversation: (typeof conversations)[number];
}) {
  const [activeTab, setActiveTab] = useState<"chat" | "actions">("chat");
  const [approvedActions, setApprovedActions] = useState<string[]>([]);

  const allActions: ActionBlock[] = conversation.messages.flatMap(
    (m) => m.actions ?? [],
  );

  const pendingCount = allActions.filter(
    (a) => !approvedActions.includes(a.id),
  ).length;

  const handleApprove = useCallback((selectedIds: string[]) => {
    setApprovedActions((prev) => [...prev, ...selectedIds]);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatTopBar
          title={conversation.title}
          visibility={conversation.visibility}
        />

        {activeTab === "chat" ? (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-4 md:px-0">
              {conversation.messages.map((message) => {
                if (message.role === "user") {
                  return <UserMessage key={message.id} message={message} />;
                }
                return <AgentResponse key={message.id} message={message} />;
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ActionsPanel
              actions={allActions}
              pendingCount={pendingCount}
              approvedActions={approvedActions}
              onApprove={handleApprove}
            />
          </div>
        )}

        <div className="mx-auto w-full max-w-3xl">
          <ChatInput
            pendingApprovals={pendingCount}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </AppShell>
  );
}

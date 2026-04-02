"use client";

import { useState, useCallback } from "react";
import { AppShell } from "@/components/layout";
import { ChatTopBar } from "@/components/chat/ChatTopBar";
import { UserMessage } from "@/components/chat/ChatMessage";
import { AgentResponse } from "@/components/chat/AgentResponse";
import { ChatInput } from "@/components/chat/ChatInput";
import { ActionsPanel } from "@/components/chat/ActionsPanel";
import { conversations, activeConversationId } from "@/data/chat";
import type { ActionBlock } from "@/data/types";

export default function ChatPage() {
  const [selectedId] = useState(activeConversationId);
  const conversation =
    conversations.find((c) => c.id === selectedId) ?? conversations[0];

  const [activeTab, setActiveTab] = useState<"chat" | "actions">("chat");
  const [approvedActions, setApprovedActions] = useState<string[]>([]);

  // Collect all actions from all agent messages
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
        {/* Top bar */}
        <ChatTopBar
          title={conversation.title}
          visibility={conversation.visibility}
        />

        {/* Content area: switches between chat and actions */}
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

        {/* Input */}
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

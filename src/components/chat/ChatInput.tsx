"use client";

import { useState } from "react";
import { SettingsIcon, SendIcon } from "../icons";

interface ChatInputProps {
  pendingApprovals: number;
  activeTab: "chat" | "actions";
  onTabChange: (tab: "chat" | "actions") => void;
}

export function ChatInput({
  pendingApprovals,
  activeTab,
  onTabChange,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  return (
    <div className="shrink-0 border-t border-border-default bg-surface-primary px-4 pb-4 pt-2 md:px-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={() => onTabChange("chat")}
          className={`text-[13px] font-medium pb-1 transition-colors ${
            activeTab === "chat"
              ? "text-text-primary border-b-2 border-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => onTabChange("actions")}
          className={`flex items-center gap-2 text-[13px] font-medium pb-1 transition-colors ${
            activeTab === "actions"
              ? "text-text-primary border-b-2 border-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          Actions
          {pendingApprovals > 0 && (
            <span className="flex h-5 items-center rounded-full bg-badge-orange-soft px-2 text-[11px] font-medium text-badge-orange">
              {pendingApprovals} pending approval
            </span>
          )}
        </button>
      </div>

      {/* Input area */}
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
  );
}

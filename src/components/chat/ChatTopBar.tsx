"use client";

import { TrashIcon, ShareIcon } from "../icons";

interface ChatTopBarProps {
  title: string;
  visibility: "private" | "public";
}

export function ChatTopBar({ title, visibility }: ChatTopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-default px-4 md:px-6">
      <h1 className="text-sm font-semibold text-text-primary truncate">{title}</h1>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-secondary">
          <TrashIcon className="h-4 w-4" />
        </button>
        <span className="hidden sm:flex h-7 items-center gap-1.5 rounded-full border border-border-default px-3 text-[12px] font-medium text-text-secondary">
          Visibility: {visibility === "private" ? "Private" : "Public"}
        </span>
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-secondary">
          <ShareIcon className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import type { ActionBlock } from "../../data/types";
import { EditIcon, FileIcon, ChevronRightIcon } from "../icons";

interface DiffBlockProps {
  action: ActionBlock;
}

export function DiffBlock({ action }: DiffBlockProps) {
  const [expanded, setExpanded] = useState(false);

  const typeLabel =
    action.type === "update_memory_file"
      ? "Update memory file"
      : "Create memory file";

  return (
    <div className="rounded-lg border border-border-default overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-surface-secondary"
      >
        <EditIcon className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
        <span className="text-[13px] font-medium text-text-primary">
          {typeLabel}
        </span>
        <span className="text-text-tertiary text-[13px]">&gt;</span>
        <FileIcon className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
        <span className="text-[13px] text-text-secondary">
          {action.fileName}
        </span>
        <span className="rounded-full bg-badge-green-soft px-2 py-0.5 text-[11px] font-medium text-badge-green">
          {action.diffSummary}
        </span>
        <ChevronRightIcon
          className={`ml-auto h-3.5 w-3.5 text-text-tertiary transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Diff content */}
      {expanded && (
        <div className="border-t border-border-default bg-surface-secondary">
          <pre className="overflow-x-auto text-[12px] leading-relaxed font-mono">
            {action.diff.map((line) => (
              <div
                key={line.lineNumber}
                className={`flex ${
                  line.type === "added"
                    ? "bg-diff-added"
                    : line.type === "removed"
                      ? "bg-diff-removed"
                      : ""
                }`}
              >
                <span className="inline-block w-10 shrink-0 select-none px-2 text-right text-text-tertiary">
                  {line.lineNumber}
                </span>
                <span className="inline-block w-5 shrink-0 select-none text-center">
                  {line.type === "added" ? (
                    <span className="text-diff-added-text">+</span>
                  ) : line.type === "removed" ? (
                    <span className="text-diff-removed-text">-</span>
                  ) : (
                    " "
                  )}
                </span>
                <span
                  className={`flex-1 whitespace-pre-wrap break-words pr-3 ${
                    line.type === "added"
                      ? "text-diff-added-text"
                      : line.type === "removed"
                        ? "text-diff-removed-text"
                        : "text-text-primary"
                  }`}
                >
                  {line.content}
                </span>
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

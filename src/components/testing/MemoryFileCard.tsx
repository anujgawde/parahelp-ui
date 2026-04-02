"use client";

import { useState } from "react";
import type { MemoryFile } from "../../data/types";
import { FileIcon, ChevronDownIcon } from "../icons";

interface MemoryFileCardProps {
  file: MemoryFile;
}

export function MemoryFileCard({ file }: MemoryFileCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border-default overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-secondary"
      >
        <FileIcon className="h-4 w-4 text-text-tertiary shrink-0" />
        <span className="flex-1 text-[14px] font-medium text-text-primary">
          {file.name}
        </span>
        <span className="rounded-full bg-badge-green-soft px-2.5 py-0.5 text-[12px] font-medium text-badge-green">
          {file.badge}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-text-tertiary transition-transform ${
            expanded ? "" : "-rotate-90"
          }`}
        />
      </button>

      {expanded && file.content && (
        <div className="border-t border-border-default bg-surface-secondary px-4 py-3">
          <p className="text-[13px] leading-relaxed text-text-secondary whitespace-pre-line">
            {file.content}
          </p>
        </div>
      )}
    </div>
  );
}

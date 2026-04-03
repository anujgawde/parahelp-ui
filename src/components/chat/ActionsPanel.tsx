"use client";

import { useState } from "react";
import { FileIcon, EditIcon } from "../icons";
import type { ActionBlock } from "../../data/types";

interface ActionsPanelProps {
  actions: ActionBlock[];
  pendingCount: number;
  approvedActions: string[];
  onApprove: (selectedIds: string[]) => void;
}

export function ActionsPanel({
  actions,
  approvedActions,
  onApprove,
}: ActionsPanelProps) {
  const pending = actions.filter((a) => !approvedActions.includes(a.id));
  const approved = actions.filter((a) => approvedActions.includes(a.id));
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const selectedCount = selected.size;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-semibold text-text-primary">
          Actions
        </h2>
        <button
          onClick={() => {
            onApprove(Array.from(selected));
            setSelected(new Set());
          }}
          disabled={selectedCount === 0}
          className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
            selectedCount > 0
              ? "bg-surface-inverse text-text-inverse hover:bg-surface-inverse/90"
              : "bg-surface-tertiary text-text-tertiary cursor-default"
          }`}
        >
          Approve actions ({selectedCount})
        </button>
      </div>

      {/* Pending section */}
      {pending.length > 0 && (
        <div className="mb-8">
          <p className="text-[13px] text-text-tertiary mb-3">
            Pending approval
          </p>
          <div className="flex flex-col gap-2">
            {pending.map((action) => (
              <button
                key={action.id}
                onClick={() => toggleSelect(action.id)}
                className="flex items-center gap-3 rounded-lg border border-border-default px-4 py-3 text-left transition-colors hover:bg-surface-secondary"
              >
                {/* Checkbox */}
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    selected.has(action.id)
                      ? "border-badge-blue bg-badge-blue"
                      : "border-border-strong bg-surface-primary"
                  }`}
                >
                  {selected.has(action.id) && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3.5,8.5 6.5,11.5 12.5,4.5" />
                    </svg>
                  )}
                </div>
                <ActionLabel action={action} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Approved section */}
      {approved.length > 0 && (
        <div>
          <p className="text-[13px] text-text-tertiary mb-3">Approved</p>
          <div className="flex flex-col gap-3">
            {approved.map((action) => (
              <div
                key={action.id}
                className="rounded-lg border border-border-default bg-surface-secondary p-4 animate-fade-in"
              >
                <p className="text-[14px] font-medium text-text-primary mb-1">
                  Memory file updated
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-tertiary">
                    <span className="text-[9px] font-semibold text-text-secondary">
                      RA
                    </span>
                  </div>
                  <span className="text-[12px] text-text-tertiary">
                    Approved just now
                  </span>
                </div>
                <div className="rounded-md border border-border-default bg-surface-primary px-3 py-2.5">
                  <ActionLabel action={action} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {actions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[14px] text-text-tertiary">
            No actions to review
          </p>
        </div>
      )}
    </div>
  );
}

function ActionLabel({ action }: { action: ActionBlock }) {
  const typeLabel =
    action.type === "update_memory_file"
      ? "Updated memory file"
      : "Created memory file";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <EditIcon className="h-4 w-4 text-text-tertiary shrink-0" />
      <span className="text-[13px] text-text-primary">{typeLabel}</span>
      <FileIcon className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
      <span className="text-[13px] text-text-secondary">{action.fileName}</span>
      <span className="rounded-full bg-badge-green-soft px-2 py-0.5 text-[11px] font-medium text-badge-green">
        {action.diffSummary}
      </span>
    </div>
  );
}

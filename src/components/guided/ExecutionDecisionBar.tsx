"use client";

import { useState } from "react";

interface ExecutionDecisionBarProps {
  hasModifications: boolean;
  highlighted: boolean;
  onSelect: (selection: "original" | "modified" | null) => void;
  onExecute: () => void;
  onReturn: () => void;
  selection: "original" | "modified" | null;
  executing: boolean;
  executed: boolean;
}

export function ExecutionDecisionBar({
  hasModifications,
  highlighted,
  onSelect,
  onExecute,
  onReturn,
  selection,
  executing,
  executed,
}: ExecutionDecisionBarProps) {
  const [returning, setReturning] = useState(false);

  function handleReturn() {
    setReturning(true);
    setTimeout(() => {
      onReturn();
      setReturning(false);
    }, 1800);
  }

  if (returning) {
    return (
      <div className="rounded-xl border border-badge-blue/30 bg-badge-blue-soft/30 p-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-badge-blue/10">
            <svg className="h-5 w-5 text-badge-blue animate-spin" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 2a6 6 0 0 1 6 6" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text-primary">Sent back to agent</p>
            <p className="text-[12px] text-text-secondary mt-0.5">The agent is re-evaluating the plan with updated context.</p>
          </div>
        </div>
      </div>
    );
  }

  if (executed) {
    return (
      <div className="rounded-xl bg-surface-secondary p-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-tertiary">
            <svg className="h-5 w-5 text-text-primary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3.5,8.5 6.5,11.5 12.5,4.5" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text-primary">
              {selection === "modified" ? "Modified" : "Original"} plan executed successfully
            </p>
            <p className="text-[12px] text-text-secondary mt-0.5">
              All steps have been processed. The ticket resolution is complete.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-300 ${
        highlighted
          ? "border-accent/30 bg-surface-primary shadow-lg shadow-accent/5 ring-1 ring-accent/10"
          : "border-border-default bg-surface-secondary"
      }`}
    >
      <h4 className="text-[14px] font-semibold text-text-primary mb-1">
        Execute decision
      </h4>
      <p className="text-[12px] text-text-secondary mb-4">
        Select which plan the agent should execute.
      </p>

      <div className="flex flex-col gap-2">
        {/* Approve Original */}
        <button
          onClick={() => onSelect(selection === "original" ? null : "original")}
          disabled={executing}
          className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all hover:border-border-strong ${
            selection === "original"
              ? "border-text-primary bg-surface-tertiary"
              : "border-border-default bg-surface-primary"
          }`}
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              selection === "original"
                ? "border-text-primary bg-text-primary"
                : "border-border-strong"
            }`}
          >
            {selection === "original" && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          <div className="flex-1">
            <span className="text-[13px] font-medium text-text-primary">
              Approve original
            </span>
            <p className="text-[11px] text-text-tertiary">
              Execute the agent&apos;s plan without modifications
            </p>
          </div>
        </button>

        {/* Approve Modified */}
        <button
          onClick={() => onSelect(selection === "modified" ? null : "modified")}
          disabled={!hasModifications || executing}
          className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
            !hasModifications
              ? "border-border-default bg-surface-tertiary/50 opacity-60 cursor-not-allowed"
              : selection === "modified"
                ? "border-accent bg-accent-soft/30"
                : "border-border-default bg-surface-primary hover:border-accent/40"
          }`}
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              selection === "modified"
                ? "border-accent bg-accent"
                : "border-border-strong"
            }`}
          >
            {selection === "modified" && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          <div className="flex-1">
            <span className="text-[13px] font-medium text-text-primary">
              Approve modified
            </span>
            <p className="text-[11px] text-text-tertiary">
              {hasModifications
                ? "Execute your refined version of the plan"
                : "Make changes to the plan to enable this option"}
            </p>
          </div>
          {hasModifications && (
            <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
              Recommended
            </span>
          )}
        </button>

        {/* Send back */}
        <button
          onClick={handleReturn}
          disabled={executing}
          className="flex items-center gap-3 rounded-lg border border-border-default px-4 py-2.5 text-left transition-all hover:bg-surface-secondary"
        >
          <svg className="h-4 w-4 shrink-0 text-text-tertiary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6,3 2,7 6,11" />
            <path d="M2,7 H11 a3,3 0 0 1 0,6 H9" />
          </svg>
          <span className="text-[12px] text-text-secondary">
            Send back to agent for re-evaluation
          </span>
        </button>
      </div>

      {/* Execute button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onExecute}
          disabled={!selection || executing}
          className={`flex h-9 items-center gap-2 rounded-lg px-5 text-[13px] font-medium transition-all ${
            selection && !executing
              ? "bg-surface-inverse text-text-inverse hover:bg-surface-inverse/90"
              : "bg-surface-tertiary text-text-tertiary cursor-not-allowed"
          }`}
        >
          {executing && (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 2a6 6 0 0 1 6 6" />
            </svg>
          )}
          {executing ? "Executing..." : "Execute"}
        </button>
      </div>
    </div>
  );
}

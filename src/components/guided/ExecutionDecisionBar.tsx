"use client";

import { useState } from "react";

interface ExecutionDecisionBarProps {
  hasModifications: boolean;
  highlighted: boolean;
  onDecision: (decision: "original" | "modified" | "return") => void;
}

export function ExecutionDecisionBar({
  hasModifications,
  highlighted,
  onDecision,
}: ExecutionDecisionBarProps) {
  const [selected, setSelected] = useState<"original" | "modified" | null>(
    null,
  );
  const [executed, setExecuted] = useState(false);
  const [returning, setReturning] = useState(false);

  function handleExecute(choice: "original" | "modified" | "return") {
    if (choice === "return") {
      setReturning(true);
      setTimeout(() => {
        onDecision("return");
        setReturning(false);
      }, 1800);
      return;
    }
    setSelected(choice);
    setExecuted(true);
    onDecision(choice);
  }

  if (returning) {
    return (
      <div className="rounded-xl border border-badge-blue/30 bg-badge-blue-soft/30 p-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-badge-blue/10">
            <svg
              className="h-5 w-5 text-badge-blue animate-spin"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M8 2a6 6 0 0 1 6 6" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text-primary">
              Sent back to agent
            </p>
            <p className="text-[12px] text-text-secondary mt-0.5">
              The agent is re-evaluating the plan with updated context.
              A new proposal will appear shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (executed) {
    return (
      <div className="rounded-xl border border-badge-green/30 bg-badge-green-soft/30 p-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-badge-green/10">
            <svg
              className="h-5 w-5 text-badge-green"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3.5,8.5 6.5,11.5 12.5,4.5" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text-primary">
              {selected === "modified" ? "Modified" : "Original"} plan approved
              for execution
            </p>
            <p className="text-[12px] text-text-secondary mt-0.5">
              The agent will execute the {selected} plan. All steps will be
              processed in order.
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
        Choose which plan the agent should execute.
      </p>

      <div className="flex flex-col gap-2">
        {/* Approve Original */}
        <button
          onClick={() => handleExecute("original")}
          className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all hover:border-border-strong ${
            selected === "original"
              ? "border-text-primary bg-surface-tertiary"
              : "border-border-default bg-surface-primary"
          }`}
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              selected === "original"
                ? "border-text-primary bg-text-primary"
                : "border-border-strong"
            }`}
          >
            {selected === "original" && (
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
          onClick={() => handleExecute("modified")}
          disabled={!hasModifications}
          className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
            !hasModifications
              ? "border-border-default bg-surface-tertiary/50 opacity-60 cursor-not-allowed"
              : selected === "modified"
                ? "border-accent bg-accent-soft/30"
                : "border-border-default bg-surface-primary hover:border-accent/40"
          }`}
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              selected === "modified"
                ? "border-accent bg-accent"
                : "border-border-strong"
            }`}
          >
            {selected === "modified" && (
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
          onClick={() => handleExecute("return")}
          className="flex items-center gap-3 rounded-lg border border-border-default px-4 py-2.5 text-left transition-all hover:bg-surface-secondary"
        >
          <svg
            className="h-4 w-4 shrink-0 text-text-tertiary"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6,3 2,7 6,11" />
            <path d="M2,7 H11 a3,3 0 0 1 0,6 H9" />
          </svg>
          <span className="text-[12px] text-text-secondary">
            Send back to agent for re-evaluation
          </span>
        </button>
      </div>
    </div>
  );
}

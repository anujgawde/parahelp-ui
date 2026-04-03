"use client";

import { useState } from "react";
import type { TestCase } from "../../data/types";
import { CheckIcon, ChevronDownIcon } from "../icons";

interface TestCaseCardProps {
  testCase: TestCase;
}

export function TestCaseCard({ testCase }: TestCaseCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        testCase.passed
          ? "border-badge-green/20 bg-badge-green-soft/30"
          : "border-risk-high/20 bg-risk-high-soft/30"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-secondary/50"
      >
        <div className="flex h-5 w-5 items-center justify-center shrink-0">
          {testCase.passed ? (
            <CheckIcon className="h-5 w-5 text-badge-green" />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-risk-high-soft">
              <span className="text-[10px] font-bold text-risk-high">X</span>
            </div>
          )}
        </div>
        <span className="flex-1 text-[14px] font-medium text-text-primary">
          {testCase.name}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-text-tertiary transition-transform ${
            expanded ? "" : "-rotate-90"
          }`}
        />
      </button>

      {expanded && testCase.details && (
        <div className="border-t border-border-default bg-surface-primary/60 px-4 py-3">
          <pre className="text-[12px] leading-relaxed text-text-secondary whitespace-pre-line font-mono">
            {testCase.details}
          </pre>
        </div>
      )}
    </div>
  );
}

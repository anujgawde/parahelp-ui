"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout";
import { MemoryFileCard } from "@/components/testing/MemoryFileCard";
import { ChevronDownIcon } from "@/components/icons";
import { memoryFiles, testCases } from "@/data/agent-testing";
import type { TestCase } from "@/data/types";

/* Remix checkbox-circle-fill icon */
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" />
    </svg>
  );
}

/* Spinner icon */
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 2a6 6 0 0 1 6 6" />
    </svg>
  );
}

/* ——— Test Case Card (controlled state) ——— */

function TestCaseCard({
  testCase,
  status,
}: {
  testCase: TestCase;
  status: "pending" | "running" | "passed" | "failed";
}) {
  const [expanded, setExpanded] = useState(false);

  // Auto-expand when test passes
  useEffect(() => {
    if (status === "passed") {
      const t = setTimeout(() => setExpanded(true), 300);
      return () => clearTimeout(t);
    }
  }, [status]);

  const borderColor = {
    pending: "border-border-default",
    running: "border-border-strong",
    passed: "border-border-default",
    failed: "border-risk-high/20",
  }[status];

  const bgColor = {
    pending: "bg-surface-secondary",
    running: "bg-surface-secondary",
    passed: "bg-surface-secondary",
    failed: "bg-risk-high-soft/30",
  }[status];

  return (
    <div className={`rounded-lg border overflow-hidden transition-all ${borderColor} ${bgColor}`}>
      <button
        onClick={() => status !== "pending" && setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-tertiary/50"
      >
        {/* Status icon */}
        <div className="flex h-5 w-5 items-center justify-center shrink-0">
          {status === "pending" && (
            <div className="h-2 w-2 rounded-full bg-text-tertiary" />
          )}
          {status === "running" && (
            <SpinnerIcon className="h-4 w-4 text-text-secondary animate-spin" />
          )}
          {status === "passed" && (
            <CheckCircleIcon className="h-5 w-5 text-badge-green" />
          )}
          {status === "failed" && (
            <span className="text-[10px] font-bold text-risk-high">X</span>
          )}
        </div>
        <span className={`flex-1 text-[14px] font-medium ${status === "pending" ? "text-text-tertiary" : "text-text-primary"}`}>
          {testCase.name}
        </span>
        {status === "running" && (
          <span className="text-[11px] text-text-tertiary">Running...</span>
        )}
        {(status === "passed" || status === "failed") && (
          <ChevronDownIcon
            className={`h-4 w-4 text-text-tertiary transition-transform ${expanded ? "" : "-rotate-90"}`}
          />
        )}
      </button>

      {expanded && testCase.details && (status === "passed" || status === "failed") && (
        <div className="border-t border-border-default bg-surface-primary/60 px-4 py-3 animate-fade-in">
          <pre className="text-[12px] leading-relaxed text-text-secondary whitespace-pre-line font-mono">
            {testCase.details}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ——— Page ——— */

export default function AgentTestingPage() {
  const [phase, setPhase] = useState<"idle" | "testing" | "tested" | "publishing" | "published">("idle");
  const [testStatuses, setTestStatuses] = useState<Record<string, "pending" | "running" | "passed" | "failed">>(
    Object.fromEntries(testCases.map((tc) => [tc.id, "pending" as const])),
  );

  function runTests() {
    setPhase("testing");

    // Run each test sequentially with realistic delays
    let delay = 0;
    testCases.forEach((tc, i) => {
      // Start running
      setTimeout(() => {
        setTestStatuses((prev) => ({ ...prev, [tc.id]: "running" }));
      }, delay);

      // Complete
      const duration = 1200 + Math.random() * 800;
      setTimeout(() => {
        setTestStatuses((prev) => ({
          ...prev,
          [tc.id]: tc.passed ? "passed" : "failed",
        }));

        // If last test, mark testing complete
        if (i === testCases.length - 1) {
          setTimeout(() => setPhase("tested"), 500);
        }
      }, delay + duration);

      delay += duration + 300;
    });
  }

  function publish() {
    setPhase("publishing");
    setTimeout(() => setPhase("published"), 1500);
  }

  const allPassed = Object.values(testStatuses).every((s) => s === "passed");

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl py-6 px-4 md:py-10 md:px-6">
          <h1 className="text-[16px] font-semibold text-text-primary text-center mb-8">
            Agent testing
          </h1>

          {/* Memory files */}
          <div className="flex flex-col gap-2 mb-6">
            {memoryFiles.map((file) => (
              <MemoryFileCard key={file.id} file={file} />
            ))}
          </div>

          {/* Test button (before tests run) */}
          {phase === "idle" && (
            <div className="flex justify-end mb-6">
              <button
                onClick={runTests}
                className="h-10 rounded-lg bg-surface-inverse px-6 text-[14px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90"
              >
                Test
              </button>
            </div>
          )}

          {/* Test cases (visible once testing starts) */}
          {phase !== "idle" && (
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="h-4 w-4 text-text-tertiary"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.5 1.5H4a1 1 0 00-1 1v11a1 1 0 001 1h8a1 1 0 001-1V4.5L9.5 1.5z" />
                  <polyline points="9.5,1.5 9.5,4.5 13,4.5" />
                </svg>
                <span className="text-[14px] font-medium text-text-primary">
                  Test cases
                </span>
                {phase === "testing" && (
                  <span className="ml-auto text-[11px] text-text-tertiary">
                    Running...
                  </span>
                )}
                {(phase === "tested" || phase === "publishing" || phase === "published") && allPassed && (
                  <span className="ml-auto text-[11px] text-badge-green font-medium">
                    All passed
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {testCases.map((tc) => (
                  <TestCaseCard
                    key={tc.id}
                    testCase={tc}
                    status={testStatuses[tc.id]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Publish button (after tests pass) */}
          {phase === "tested" && allPassed && (
            <div className="flex justify-end animate-fade-in">
              <button
                onClick={publish}
                className="h-10 rounded-lg bg-surface-inverse px-6 text-[14px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90"
              >
                Publish
              </button>
            </div>
          )}

          {/* Publishing state */}
          {phase === "publishing" && (
            <div className="flex items-center justify-center gap-3 rounded-lg bg-surface-secondary px-5 py-4 animate-fade-in">
              <SpinnerIcon className="h-4 w-4 text-text-tertiary animate-spin" />
              <p className="text-[13px] text-text-secondary">
                Publishing to production...
              </p>
            </div>
          )}

          {/* Published confirmation */}
          {phase === "published" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center gap-3 rounded-lg bg-surface-secondary px-5 py-4">
                <CheckCircleIcon className="h-5 w-5 text-text-primary" />
                <p className="text-[13px] text-text-primary font-medium">
                  Published to production. All test configurations are now live.
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/dashboard"
                  className="flex h-9 items-center rounded-lg bg-surface-inverse px-5 text-[13px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

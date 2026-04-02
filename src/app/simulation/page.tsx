"use client";

import { AppShell } from "@/components/layout";
import { MemoryFileCard } from "@/components/testing/MemoryFileCard";
import { TestCaseCard } from "@/components/testing/TestCaseCard";
import { memoryFiles, testCases } from "@/data/agent-testing";

export default function AgentTestingPage() {
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

          {/* Test cases */}
          <div className="mb-8">
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
            </div>
            <div className="flex flex-col gap-2">
              {testCases.map((tc) => (
                <TestCaseCard key={tc.id} testCase={tc} />
              ))}
            </div>
          </div>

          {/* Publish button */}
          <div className="flex justify-end">
            <button className="h-10 rounded-lg bg-surface-inverse px-6 text-[14px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90">
              Publish
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

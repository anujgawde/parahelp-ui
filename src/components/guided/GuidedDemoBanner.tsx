"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function GuidedDemoBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem("parahelp-demo-completed");
    setDismissed(completed === "true");
  }, []);

  if (dismissed) {
    return (
      <Link
        href="/tickets/TK-4200?guided=true"
        className="group flex items-center gap-3 rounded-xl border border-accent/15 bg-accent-soft/50 px-5 py-3 transition-all hover:border-accent/30 hover:bg-accent-soft"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
          <svg
            className="h-4 w-4 text-accent"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="6,3 13,8 6,13" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <span className="text-[13px] font-medium text-text-primary">
          Run guided support scenario
        </span>
        <span className="text-[12px] text-text-tertiary">
          ~60s
        </span>
        <svg
          className="ml-auto h-4 w-4 text-text-tertiary transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6,3 11,8 6,13" />
        </svg>
      </Link>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent-soft via-surface-secondary to-surface-primary p-6 md:p-8">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/5" />
      <div className="pointer-events-none absolute -right-5 bottom-0 h-24 w-24 rounded-full bg-accent/3" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
            <svg
              className="h-3.5 w-3.5 text-accent"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="6,3 13,8 6,13" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Interactive Demo
          </span>
        </div>

        <h2 className="text-[20px] font-semibold text-text-primary leading-tight mb-1.5">
          Run guided support scenario
        </h2>
        <p className="text-[14px] text-text-secondary mb-5 max-w-lg">
          See how an operator can refine an agent&apos;s reasoning before execution.
          Edit the plan, adjust context sources, simulate outcomes, and decide
          what gets executed.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/tickets/TK-4200?guided=true"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-5 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Start demo
            <svg
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6,3 11,8 6,13" />
            </svg>
          </Link>
          <button
            onClick={() => {
              localStorage.setItem("parahelp-demo-completed", "true");
              setDismissed(true);
            }}
            className="text-[13px] text-text-tertiary transition-colors hover:text-text-secondary"
          >
            Skip guided demo
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import NumberFlow, { continuous } from "@number-flow/react";
import { AppShell } from "@/components/layout";
import { ChevronDownIcon, CheckIcon } from "@/components/icons";
import { useTour } from "@/components/guided/TourProvider";

/* ——— Stat Cell with count-up ——— */
function StatCell({
  target,
  suffix,
  label,
  delay,
}: {
  target: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const [value, setValue] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const t = setTimeout(() => setValue(target), delay);
      return () => clearTimeout(t);
    } else {
      setValue(target);
    }
  }, [target, delay]);

  return (
    <div className="rounded-lg bg-surface-secondary py-3 text-center">
      <div className="text-[20px] font-extrabold tracking-tight text-text-primary tabular-nums">
        <NumberFlow value={value} suffix={suffix} plugins={[continuous]} />
      </div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
        {label}
      </div>
    </div>
  );
}

/* ——— Progress Ring ——— */
function ProgressRing({ pct, delay = 0 }: { pct: number; delay?: number }) {
  const [offset, setOffset] = useState(76);
  useEffect(() => {
    const t = setTimeout(() => setOffset(76 - (76 * pct) / 100), delay + 300);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" className="shrink-0">
      <circle
        cx="14"
        cy="14"
        r="12"
        fill="none"
        className="stroke-surface-tertiary"
        strokeWidth="3"
      />
      <circle
        cx="14"
        cy="14"
        r="12"
        fill="none"
        className="stroke-text-primary"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="76"
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)",
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
    </svg>
  );
}

/* ——— Data ——— */

const STATS = [
  { target: 23, label: "Configs", delay: 300 },
  { target: 91, suffix: "%", label: "Tests passed", delay: 400 },
  { target: 18, label: "Published", delay: 500 },
  { target: 6, label: "Gaps found", delay: 600 },
];

interface ActionItem {
  id: string;
  title: string;
  detail: string;
  source: string;
  type: "publish" | "review" | "alert";
  primaryAction: { label: string; href?: string };
  secondaryAction?: { label: string; href?: string };
}

const ACTIONS: ActionItem[] = [
  {
    id: "a-1",
    type: "publish",
    title: "Service issues tool config ready",
    detail:
      "6/6 tests passed. New check-status-page instruction ready for production.",
    source: "Gap analysis · 2h ago",
    primaryAction: { label: "Approve & publish" },
    secondaryAction: { label: "View tests", href: "/tests" },
  },
  {
    id: "a-2",
    type: "review",
    title: "SSO login failure needs operator review",
    detail:
      "Agent proposed a resolution plan for TK-4200 (15 users affected). Requires human review before execution.",
    source: "Ticket escalation · 8 min ago",
    primaryAction: { label: "Review & refine plan", href: "/tickets/TK-4200" },
  },
  {
    id: "a-3",
    type: "review",
    title: "Refund tool timeout needs review",
    detail:
      "Timeout 5s → 12s after 14 transfer failures. Tests pending your trigger.",
    source: "Manual config · Today",
    primaryAction: { label: "Run tests" },
    secondaryAction: { label: "Edit config", href: "/controls" },
  },
  {
    id: "a-4",
    type: "alert",
    title: "2 gaps blocked: Need new tools",
    detail:
      "Subscription tier lookup (31 tickets) + billing API (14 tickets) can't be resolved with knowledge alone.",
    source: "Gap analysis · Yesterday",
    primaryAction: { label: "View gaps" },
    secondaryAction: { label: "Acknowledge" },
  },
];

interface TopicItem {
  id: string;
  title: string;
  badge?: string;
  ring?: number;
  items: string[];
}

const TOPICS: TopicItem[] = [
  {
    id: "config",
    title: "3 configs deployed this week",
    badge: "Deployed",
    items: [
      "Service issues check → tech troubleshooting memory",
      "Newsletter discount codes (WELCOME15, RETURN10)",
      "Credit grant 3-step approval workflow",
    ],
  },
  {
    id: "tests",
    title: "49/54 tests passed",
    ring: 91,
    items: [
      "54 sims: New policy tests + baseline regression",
      "5 failures: Credit grant edge case (no balance confirmation)",
    ],
  },
  {
    id: "gaps",
    title: "6 gaps found, 3 auto-fixed",
    badge: "2 blocked",
    items: [
      "3 knowledge gaps fixed & published automatically",
      "2 blocked: Need new tools (CRM lookup, billing API)",
      "1 needs SSO diagnostic integration",
    ],
  },
  {
    id: "bugs",
    title: "4 bug patterns from 101 tickets",
    badge: "Report",
    items: [
      "Safari checkout timeout: 42 tickets (iOS 17+)",
      "Dashboard stale data: 28 tickets",
      "Okta SSO loop: 19 tickets",
      "CSV export missing fields: 12 tickets (since v3.2)",
    ],
  },
];

/* ——— Action Card ——— */

function ActionCard({
  action,
  index,
  onDismiss,
  skipAnimation,
  tourTarget,
  persistedState,
}: {
  action: ActionItem;
  index: number;
  onDismiss: (
    id: string,
    type: "published" | "acknowledged" | "dismissed",
  ) => void;
  skipAnimation?: boolean;
  tourTarget?: string;
  persistedState?: "published" | "acknowledged" | "dismissed";
}) {
  const router = useRouter();
  const tour = useTour();
  const [state, setState] = useState<"visible" | "exiting" | "done">(
    persistedState ? "done" : "visible",
  );
  const [doneType, setDoneType] = useState<"published" | "acknowledged" | null>(
    persistedState === "published"
      ? "published"
      : persistedState === "acknowledged"
        ? "acknowledged"
        : null,
  );
  const [showGaps, setShowGaps] = useState(false);
  const [testRun, setTestRun] = useState<"idle" | "running" | "done">("idle");
  const [testsCompleted, setTestsCompleted] = useState(0);
  const totalTests = 8;

  function handlePrimary() {
    if (action.primaryAction.href) {
      const isTouring = tour.active && tour.step?.target === tourTarget;
      const href = isTouring
        ? action.primaryAction.href + "?guided=true"
        : action.primaryAction.href;
      router.push(href);
      return;
    }
    if (action.primaryAction.label === "Run tests") {
      setTestRun("running");
      setTestsCompleted(0);
      let count = 0;
      const interval = setInterval(
        () => {
          count++;
          setTestsCompleted(count);
          if (count >= totalTests) {
            clearInterval(interval);
            setTimeout(() => setTestRun("done"), 400);
          }
        },
        600 + Math.random() * 400,
      );
      return;
    }
    if (action.type === "publish") {
      setDoneType("published");
      setState("done");
      tour.advanceFromClick();
      return;
    }
    if (action.type === "alert") {
      setShowGaps(!showGaps);
      return;
    }
  }

  const isTourTarget = tour.active && tour.step?.target === tourTarget;

  function handleSecondary() {
    if (isTourTarget) return;
    if (action.secondaryAction?.href) {
      router.push(action.secondaryAction.href);
      return;
    }
    setDoneType("acknowledged");
    setState("done");
  }

  const [confirmDismissing, setConfirmDismissing] = useState(false);
  const [confirmGone, setConfirmGone] = useState(false);

  function dismissConfirmation() {
    setConfirmDismissing(true);
    setTimeout(() => {
      setConfirmGone(true);
      onDismiss(action.id, "dismissed");
    }, 300);
  }

  // Published confirmation
  if (state === "done" && doneType === "published") {
    if (confirmGone) return null;
    return (
      <div
        className={`flex items-center gap-3 rounded-lg bg-surface-secondary px-5 py-4 animate-fade-in transition-all duration-300 ${
          confirmDismissing ? "opacity-0 translate-x-6 scale-[0.98]" : ""
        }`}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-tertiary">
          <CheckIcon className="h-3.5 w-3.5 text-text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-medium text-text-primary">
            Pushed to production
          </p>
          <p className="text-[12px] text-text-secondary">{action.title}</p>
        </div>
        <button
          onClick={dismissConfirmation}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-all hover:bg-surface-tertiary hover:text-text-primary"
          title="Dismiss"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>
      </div>
    );
  }

  // Acknowledged confirmation
  if (state === "done" && doneType === "acknowledged") {
    if (confirmGone) return null;
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border border-border-default bg-surface-secondary px-5 py-4 animate-fade-in transition-all duration-300 ${
          confirmDismissing ? "opacity-0 translate-x-6 scale-[0.98]" : ""
        }`}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-tertiary">
          <CheckIcon className="h-3.5 w-3.5 text-text-tertiary" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-medium text-text-secondary">
            Acknowledged
          </p>
          <p className="text-[12px] text-text-tertiary">{action.title}</p>
        </div>
        <button
          onClick={dismissConfirmation}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-all hover:bg-surface-tertiary hover:text-text-primary"
          title="Dismiss"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>
      </div>
    );
  }

  if (state === "done") return null;

  const typeIndicator = {
    publish: "bg-badge-green",
    review: "bg-badge-orange",
    alert: "bg-risk-high",
  }[action.type];

  return (
    <div
      data-tour={tourTarget}
      className={`group rounded-lg bg-surface-secondary transition-all hover:bg-surface-tertiary ${
        state === "exiting"
          ? "opacity-0 translate-x-6 scale-[0.98]"
          : skipAnimation
            ? ""
            : "animate-fade-in"
      }`}
      style={{
        animationDelay: skipAnimation ? undefined : `${index * 60 + 200}ms`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="flex items-start gap-3.5 px-5 py-3.5">
        {/* Type indicator */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-tertiary mt-0.5">
          <div className={`h-2.5 w-2.5 rounded-full ${typeIndicator}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-text-primary leading-snug">
            {action.title}
          </p>
          <p className="mt-1 text-[13px] text-text-secondary leading-relaxed">
            {action.detail}
          </p>
          <p className="mt-1 text-[12px] text-text-tertiary">{action.source}</p>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => {
            if (isTourTarget) return;
            setState("exiting");
            setTimeout(() => {
              setState("done");
              onDismiss(action.id, "dismissed");
            }, 300);
          }}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-all hover:bg-surface-tertiary hover:text-text-primary opacity-0 group-hover:opacity-100 ${isTourTarget ? "hidden!" : ""}`}
          title="Dismiss"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>
      </div>

      {/* Action buttons - expand on hover */}
      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-200">
        <div className="overflow-hidden">
          <div className="flex gap-2 px-5 pb-3 pt-1">
            <button
              onClick={handlePrimary}
              className="rounded-md bg-surface-inverse px-3.5 py-1.5 text-[12px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90"
            >
              {action.primaryAction.label}
            </button>
            {action.secondaryAction && !isTourTarget && (
              <button
                onClick={handleSecondary}
                className="rounded-md border border-border-default bg-surface-primary px-3.5 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
              >
                {action.secondaryAction.label}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline test runner */}
      {testRun !== "idle" && (
        <div className="border-t border-border-default px-4 py-3 animate-fade-in">
          <div className="pl-11">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-text-primary">
                {testRun === "running"
                  ? `Running simulations... ${testsCompleted}/${totalTests}`
                  : `All ${totalTests} tests passed`}
              </span>
              {testRun === "running" && (
                <svg
                  className="h-3.5 w-3.5 animate-spin text-text-tertiary"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M8 2a6 6 0 0 1 6 6" />
                </svg>
              )}
              {testRun === "done" && (
                <CheckIcon className="h-3.5 w-3.5 text-badge-green" />
              )}
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-surface-tertiary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  testRun === "done" ? "bg-badge-green" : "bg-text-primary"
                }`}
                style={{ width: `${(testsCompleted / totalTests) * 100}%` }}
              />
            </div>
            {/* Individual test results */}
            {testsCompleted > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                {Array.from({ length: testsCompleted }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 animate-fade-in"
                    style={{ animationDuration: "0.15s" }}
                  >
                    <CheckIcon className="h-2.5 w-2.5 text-badge-green" />
                    <span className="text-[11px] font-mono text-text-tertiary">
                      {
                        [
                          "refund_timeout_standard",
                          "refund_timeout_edge",
                          "refund_high_value",
                          "refund_cancelled_sub",
                          "baseline_refund_5s",
                          "baseline_billing",
                          "regression_transfer",
                          "regression_escalation",
                        ][i]
                      }
                    </span>
                    <span className="text-[10px] font-mono text-text-tertiary ml-auto">
                      {(0.6 + Math.random() * 1.2).toFixed(1)}s
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* Action after tests pass */}
            {testRun === "done" && (
              <div className="mt-3 flex gap-2 animate-fade-in">
                <button
                  onClick={() => {
                    setState("exiting");
                    setDoneType("published");
                    setTimeout(() => {
                      setState("done");
                      onDismiss(action.id, "published");
                    }, 300);
                  }}
                  className="rounded-md bg-surface-inverse px-3.5 py-1.5 text-[12px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90"
                >
                  Approve & publish
                </button>
                <button
                  onClick={() => {
                    setState("exiting");
                    setTimeout(() => {
                      setState("done");
                      onDismiss(action.id, "dismissed");
                    }, 300);
                  }}
                  className="rounded-md border border-border-default bg-surface-primary px-3.5 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded gaps detail */}
      {showGaps && action.type === "alert" && (
        <div className="border-t border-border-default px-4 py-3 animate-fade-in">
          <div className="flex flex-col gap-2 pl-11">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-text-primary">
                Subscription tier lookup
              </span>
              <span className="rounded bg-badge-purple-soft px-1.5 py-0.5 text-[10px] font-semibold text-badge-purple">
                Needs tool
              </span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              31 tickets: Agent cannot check Free/Pro/Enterprise status without
              CRM lookup
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[12px] font-medium text-text-primary">
                Billing adjustment access
              </span>
              <span className="rounded bg-badge-purple-soft px-1.5 py-0.5 text-[10px] font-semibold text-badge-purple">
                Needs tool
              </span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              14 tickets: Requires billing API integration for credit/adjustment
              actions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ——— Topic Row ——— */

function TopicRow({ topic, index }: { topic: TopicItem; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) setHeight(contentRef.current.scrollHeight);
  }, [open]);

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 50 + 500}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-all hover:bg-surface-tertiary/60 ${
          open ? "rounded-t-lg bg-surface-secondary" : "rounded-lg"
        }`}
      >
        <span className="flex-1 text-[13px] font-semibold text-text-primary">
          {topic.title}
        </span>
        {topic.badge && (
          <span className="rounded-md bg-surface-tertiary px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
            {topic.badge}
          </span>
        )}
        {topic.ring != null && (
          <ProgressRing pct={topic.ring} delay={index * 50 + 600} />
        )}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-text-tertiary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? height + 16 : 0 }}
      >
        <div
          ref={contentRef}
          className="rounded-b-lg bg-surface-secondary px-3.5 pb-3 pt-0.5"
        >
          {topic.items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 py-1.5 transition-all duration-200"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(-4px)",
                transitionDelay: `${i * 40 + 60}ms`,
              }}
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-tertiary" />
              <span className="text-[12px] leading-relaxed text-text-secondary">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ——— Greeting with hover tooltips ——— */

const TASKS_TOOLTIP = [
  "3 configs deployed this week",
  "49/54 tests passed",
  "6 gaps found, 3 auto-fixed",
];

const UPDATES_TOOLTIP = [
  "Service issues tool config ready",
  "SSO login failure needs operator review",
  "Refund tool timeout needs review",
  "2 gaps blocked: Need new tools",
];

function GreetingBlock() {
  const [hover, setHover] = useState<"tasks" | "updates" | null>(null);

  return (
    <div className="mb-7 animate-fade-in" data-tour="tour-greeting">
      <span className="mb-3 inline-block rounded border border-border-default px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
        Agent Summary
      </span>
      <h2 className="text-[26px] font-bold leading-snug tracking-tight">
        <span
          className={`transition-colors duration-200 ${hover ? "text-text-tertiary" : "text-text-primary"}`}
        >
          Your agent ran{" "}
        </span>
        <span
          className="relative inline-block cursor-default"
          onMouseEnter={() => setHover("tasks")}
          onMouseLeave={() => setHover(null)}
        >
          <span
            className={`border-b-2 transition-colors duration-200 ${
              hover === "tasks"
                ? "border-text-primary text-text-primary"
                : hover
                  ? "border-text-tertiary text-text-tertiary"
                  : "border-text-primary text-text-primary"
            }`}
          >
            3 tasks
          </span>
          {hover === "tasks" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 animate-fade-in"
              style={{ animationDuration: "0.15s" }}
            >
              <div className="w-64 rounded-lg border border-border-default bg-surface-primary shadow-lg shadow-black/8 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                  Tasks completed
                </p>
                {TASKS_TOOLTIP.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className=" h-1 w-1 shrink-0 rounded-full bg-text-tertiary" />
                    <span className="text-[12px] text-text-secondary leading-relaxed">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </span>
        <span
          className={`transition-colors duration-200 ${hover ? "text-text-tertiary" : "text-text-primary"}`}
        >
          {" "}
          and found{" "}
        </span>
        <span
          className="relative inline-block cursor-default"
          onMouseEnter={() => setHover("updates")}
          onMouseLeave={() => setHover(null)}
        >
          <span
            className={`border-b-2 transition-colors duration-200 ${
              hover === "updates"
                ? "border-text-primary text-text-primary"
                : hover
                  ? "border-text-tertiary text-text-tertiary"
                  : "border-text-primary text-text-primary"
            }`}
          >
            4 updates
          </span>
          {hover === "updates" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 animate-fade-in"
              style={{ animationDuration: "0.15s" }}
            >
              <div className="w-72 rounded-lg border border-border-default bg-surface-primary shadow-lg shadow-black/8 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">
                  Updates found
                </p>
                {UPDATES_TOOLTIP.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-text-tertiary" />
                    <span className="text-[12px] text-text-secondary leading-relaxed">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </span>
        <span
          className={`transition-colors duration-200 ${hover ? "text-text-tertiary" : "text-text-primary"}`}
        >
          .
        </span>
      </h2>
      <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-text-tertiary">
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.46 4.73A9.96 9.96 0 0 1 12 2c5.52 0 10 4.48 10 10h-2a8 8 0 0 0-13.07-6.19l2.07 2.07H4V2.81l1.46 1.92zM18.54 19.27A9.96 9.96 0 0 1 12 22C6.48 22 2 17.52 2 12h2a8 8 0 0 0 13.07 6.19l-2.07-2.07H20v5.07l-1.46-1.92z" />
        </svg>
        8 min ago
      </div>
    </div>
  );
}

/* ——— Page ——— */

// Persist which action cards have been acted on
function saveDismissed(d: Record<string, string>) {
  localStorage.setItem("parahelp-dashboard-actions", JSON.stringify(d));
}

export default function DashboardPage() {
  const [showAll, setShowAll] = useState(false);
  const [dismissed, setDismissed] = useState<
    Record<string, "published" | "acknowledged" | "dismissed">
  >({});
  const [tourCompleteMsg, setTourCompleteMsg] = useState(false);

  // Check for tour completion message
  useEffect(() => {
    if (localStorage.getItem("parahelp-tour-show-complete") === "true") {
      localStorage.removeItem("parahelp-tour-show-complete");
      setTourCompleteMsg(true);
      const t = setTimeout(() => setTourCompleteMsg(false), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  // Reset action card states on mount (fresh start every page load)
  useEffect(() => {
    localStorage.removeItem("parahelp-dashboard-actions");
  }, []);

  const publishCount = Object.values(dismissed).filter(
    (v) => v === "published",
  ).length;
  const activeActions = ACTIONS.filter((a) => dismissed[a.id] !== "dismissed");
  const visible = showAll ? activeActions : activeActions.slice(0, 3);
  const activeCount = activeActions.length;
  const hasMore = !showAll && activeActions.length > 3;

  const handleDismiss = useCallback(
    (id: string, type: "published" | "acknowledged" | "dismissed") => {
      setDismissed((prev) => {
        const next = { ...prev, [id]: type };
        saveDismissed(next);
        return next;
      });
    },
    [],
  );

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center border-b border-border-default px-4 md:px-6">
          <h1 className="text-sm font-semibold text-text-primary">Dashboard</h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-10">
            {/* Tour complete banner */}
            {tourCompleteMsg && (
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-surface-secondary px-5 py-4 animate-fade-in">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-tertiary">
                  <CheckIcon className="h-4 w-4 text-text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-text-primary">
                    Guided tour complete
                  </p>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    You experienced how an operator can steer an agent&apos;s
                    plan: Editing steps, simulating outcomes, and choosing what
                    gets executed.
                  </p>
                </div>
                <button
                  onClick={() => setTourCompleteMsg(false)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-tertiary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
                >
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <line x1="4" y1="4" x2="12" y2="12" />
                    <line x1="12" y1="4" x2="4" y2="12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Greeting */}
            <GreetingBlock />

            {/* Stats strip */}
            <div
              className="mb-8 grid grid-cols-4 gap-2 animate-fade-in"
              data-tour="tour-stats"
              style={{ animationDelay: "80ms" }}
            >
              {STATS.map((s, i) => (
                <StatCell
                  key={i}
                  target={s.target + (i === 2 ? publishCount : 0)}
                  suffix={s.suffix ?? ""}
                  label={s.label}
                  delay={s.delay}
                />
              ))}
            </div>

            {/* Needs attention */}
            <div className="mb-6">
              <div
                className="mb-3 flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: "150ms" }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Needs attention
                </span>
                <span className="flex-1 h-px bg-border-default" />
                <span className="rounded bg-surface-tertiary px-1.5 py-0.5 text-[10px] font-semibold text-text-tertiary">
                  {activeCount}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {visible.map((a, i) => {
                  const target =
                    a.id === "a-1"
                      ? "tour-action-publish"
                      : a.id === "a-2"
                        ? "tour-action-hitl"
                        : undefined;
                  return (
                    <ActionCard
                      key={a.id}
                      action={a}
                      index={i}
                      onDismiss={handleDismiss}
                      skipAnimation={showAll && i >= 3}
                      tourTarget={target}
                      persistedState={dismissed[a.id]}
                    />
                  );
                })}
              </div>

              {activeCount === 0 && (
                <div className="rounded-lg border border-border-default bg-surface-secondary py-8 text-center">
                  <p className="text-[13px] text-text-tertiary">
                    All caught up. No actions need your attention.
                  </p>
                </div>
              )}

              {hasMore && (
                <button
                  onClick={() => setShowAll(true)}
                  className="mt-2 flex items-center gap-1.5 px-1 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                  Show {activeActions.length - 3} more
                </button>
              )}
            </div>

            {/* Divider */}
            {/* <div className="mb-6 h-px bg-border-default" /> */}

            {/* This week */}
            <div>
              <div
                className="mb-3 flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: "400ms" }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  This week
                </span>
                <span className="flex-1 h-px bg-border-default" />
              </div>
              <div className="flex flex-col gap-1">
                {TOPICS.map((t, i) => (
                  <TopicRow key={t.id} topic={t} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

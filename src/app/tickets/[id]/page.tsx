"use client";

import { useState, useEffect, useCallback, useMemo, useRef, use } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AppShell } from "@/components/layout";
import { SupportTicketCard } from "@/components/ticket/SupportTicketCard";
import { RetrievedContextItem } from "@/components/ticket/RetrievedContextItem";
import { ResolutionPlanStep as PlanStepComponent } from "@/components/ticket/ResolutionPlanStep";
import { GuidedTicketExperience } from "@/components/guided/GuidedTicketExperience";
import { ContextSourceManager } from "@/components/guided/ContextSourceManager";
import { EditablePlanCard } from "@/components/guided/EditablePlanCard";
import { SimulationPanel } from "@/components/guided/SimulationPanel";
import { ExecutionDecisionBar } from "@/components/guided/ExecutionDecisionBar";
import {
  SSO_CONTEXT_SOURCES,
  computeSimulation,
} from "@/components/guided/types";
import type {
  EditablePlanStep,
  ContextSource,
} from "@/components/guided/types";
import { SparkleIcon } from "@/components/icons";
import { ticketResolutions } from "@/data/agent-reasoning";
import type { TicketResolution, ResolutionPlanStep } from "@/data/types";

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isGuided = searchParams.get("guided") === "true";

  if (isGuided && id === "TK-4200") {
    return (
      <AppShell>
        <GuidedTicketExperience />
      </AppShell>
    );
  }

  return <NormalTicketDetail id={id} />;
}

/* ——— Normal Ticket Detail (with editable HITL) ——— */

function NormalTicketDetail({ id }: { id: string }) {
  const sourceData = ticketResolutions[id] ?? ticketResolutions["default"];

  const [resolution, setResolution] = useState<TicketResolution>(() => ({
    ...sourceData,
    retrievedContext: [],
    resolutionPlan: [],
  }));

  const [waitingApproval, setWaitingApproval] = useState(false);
  const [approvalStepId, setApprovalStepId] = useState<string | null>(null);
  const [remainingSteps, setRemainingSteps] = useState<ResolutionPlanStep[]>(
    [],
  );
  // Editable mode state
  const [editMode, setEditMode] = useState(false);
  const [editablePlan, setEditablePlan] = useState<EditablePlanStep[]>([]);
  const [editableSources, setEditableSources] = useState<ContextSource[]>([]);
  const [showSimulation, setShowSimulation] = useState(false);
  const [decided, setDecided] = useState(false);
  const [execSelection, setExecSelection] = useState<"original" | "modified" | null>(null);
  const [execExecuting, setExecExecuting] = useState(false);
  const [execExecuted, setExecExecuted] = useState(false);

  // Convert resolution plan steps to editable format when entering edit mode
  const originalEditablePlan = useMemo(() => {
    if (!waitingApproval) return [];
    // Include all steps (completed + approval gate + remaining)
    const allSteps = [
      ...resolution.resolutionPlan,
      ...remainingSteps,
    ];
    return allSteps.map((s) => ({
      id: s.id,
      text: s.label,
      enabled: true,
      isOriginal: true,
    }));
  }, [waitingApproval, resolution.resolutionPlan, remainingSteps]);

  // Build context sources from resolution's retrieved context
  const originalSources = useMemo(() => {
    if (!waitingApproval) return [];
    const typeMap: Record<string, ContextSource["type"]> = {
      memory: "internal-policy",
      knowledge: "knowledge-base",
      stripe: "external-system",
      zendesk: "external-system",
      approval: "internal-policy",
    };
    const tagMap: Record<string, string> = {
      memory: "Memory",
      knowledge: "Knowledge Base",
      stripe: "External System",
      zendesk: "External System",
      approval: "Internal Policy",
    };
    const mapped = resolution.retrievedContext.map((ctx) => ({
      id: ctx.id,
      title: ctx.label,
      type: typeMap[ctx.icon] ?? ("knowledge-base" as const),
      tag: tagMap[ctx.icon] ?? "Knowledge Base",
      included: true,
    }));
    // Add some available-but-not-included sources for demonstration
    return [
      ...mapped,
      {
        id: "extra-1",
        title: "SAML Certificate Rotation Guide",
        type: "knowledge-base" as const,
        tag: "Knowledge Base",
        included: false,
      },
      {
        id: "extra-2",
        title: "Recent Incident Log",
        type: "external-system" as const,
        tag: "Internal System",
        included: false,
      },
    ];
  }, [waitingApproval, resolution.retrievedContext]);

  const simulation = useMemo(
    () =>
      computeSimulation(
        originalEditablePlan,
        editablePlan,
        originalSources,
        editableSources,
      ),
    [editablePlan, editableSources, originalEditablePlan, originalSources],
  );

  const hasModifications = useMemo(() => {
    if (editablePlan.length !== originalEditablePlan.length) return true;
    return (
      editablePlan.some((step, i) => {
        const orig = originalEditablePlan[i];
        return (
          !orig ||
          step.text !== orig.text ||
          step.enabled !== orig.enabled ||
          step.id !== orig.id
        );
      }) ||
      editableSources.some((src) => {
        const orig = originalSources.find((o) => o.id === src.id);
        return !orig || src.included !== orig.included;
      }) ||
      editablePlan.some((s) => !s.isOriginal)
    );
  }, [editablePlan, editableSources, originalEditablePlan, originalSources]);

  // Default selection when simulation is shown
  useEffect(() => {
    if (showSimulation && !execSelection) {
      setExecSelection(hasModifications ? "modified" : "original");
    }
  }, [showSimulation, execSelection, hasModifications]);

  // Animate context items + plan steps
  useEffect(() => {
    const contextItems = sourceData.retrievedContext;
    const planSteps = sourceData.resolutionPlan;
    const timeouts: NodeJS.Timeout[] = [];

    setResolution({
      ...sourceData,
      retrievedContext: [],
      resolutionPlan: [],
    });
    setWaitingApproval(false);
    setApprovalStepId(null);
    setRemainingSteps([]);
    setEditMode(false);
    setShowSimulation(false);
    setDecided(false);

    contextItems.forEach((item, i) => {
      const t = setTimeout(() => {
        setResolution((prev) => ({
          ...prev,
          retrievedContext: [...prev.retrievedContext, item],
        }));
      }, 400 + i * 500);
      timeouts.push(t);
    });

    const contextDelay = 400 + contextItems.length * 500;
    let stepIndex = 0;

    function revealStep(step: ResolutionPlanStep, delay: number) {
      if (step.status === "approval-gate") {
        const t = setTimeout(() => {
          setResolution((prev) => ({
            ...prev,
            resolutionPlan: [
              ...prev.resolutionPlan,
              { ...step, status: "approval-gate" },
            ],
          }));
          setWaitingApproval(true);
          setApprovalStepId(step.id);
          const idx = planSteps.findIndex((s) => s.id === step.id);
          setRemainingSteps(planSteps.slice(idx + 1));
        }, delay);
        timeouts.push(t);
        return false;
      }

      const t1 = setTimeout(() => {
        setResolution((prev) => ({
          ...prev,
          resolutionPlan: [
            ...prev.resolutionPlan,
            { ...step, status: "loading" },
          ],
        }));
      }, delay);
      timeouts.push(t1);

      const t2 = setTimeout(() => {
        setResolution((prev) => ({
          ...prev,
          resolutionPlan: prev.resolutionPlan.map((s) =>
            s.id === step.id ? { ...s, status: "complete" } : s,
          ),
        }));
      }, delay + 600);
      timeouts.push(t2);

      return true;
    }

    for (const step of planSteps) {
      const delay = contextDelay + 300 + stepIndex * 800;
      const shouldContinue = revealStep(step, delay);
      stepIndex++;
      if (!shouldContinue) break;
    }

    return () => timeouts.forEach(clearTimeout);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Enter editable mode
  function enterEditMode() {
    setEditablePlan(originalEditablePlan.map((s) => ({ ...s })));
    setEditableSources(originalSources.map((s) => ({ ...s })));
    setEditMode(true);
    setShowSimulation(false);
  }

  function handleReturn() {
    setShowSimulation(false);
    setExecSelection(null);
  }

  function handleExecute() {
    if (!execSelection) return;
    setExecExecuting(true);
    setTimeout(() => {
      setExecExecuting(false);
      setExecExecuted(true);
      // Continue with remaining steps after a beat
      setTimeout(() => {
        finishExecution();
      }, 1000);
    }, 2000);
  }

  function finishExecution() {
    setDecided(true);
    setEditMode(false);
    setWaitingApproval(false);

    // Mark approval step as complete
    if (approvalStepId) {
      setResolution((prev) => ({
        ...prev,
        resolutionPlan: prev.resolutionPlan.map((s) =>
          s.id === approvalStepId ? { ...s, status: "complete" } : s,
        ),
      }));
    }

    // Continue with remaining steps
    let delay = 400;
    remainingSteps.forEach((step) => {
      const stepDelay = delay;
      setTimeout(() => {
        setResolution((prev) => ({
          ...prev,
          resolutionPlan: [
            ...prev.resolutionPlan,
            { ...step, status: "loading" },
          ],
        }));
      }, stepDelay);
      setTimeout(() => {
        setResolution((prev) => ({
          ...prev,
          resolutionPlan: prev.resolutionPlan.map((s) =>
            s.id === step.id ? { ...s, status: "complete" } : s,
          ),
        }));
      }, stepDelay + 600);
      delay += 800;
    });

    setApprovalStepId(null);
    setRemainingSteps([]);
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new sections appear
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 350);
    }
  }, [editMode, showSimulation, waitingApproval]);

  return (
    <AppShell>
      <div ref={scrollRef} className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pt-4 pb-12 md:flex-row md:gap-8 md:px-8 md:pt-8 md:pb-16">
        {/* Left: Support ticket */}
        <div className="w-full shrink-0 md:w-[45%]">
          <SupportTicketCard
            title={resolution.title}
            message={resolution.customerMessage}
          />
          <TicketChips ticketId={sourceData.id} />
        </div>

        {/* Right: Agent reasoning */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt=""
                width={20}
                height={20}
                className="h-8 w-8"
                unoptimized
              />
              <h2 className="text-[16px] font-semibold text-text-primary">
                Agent reasoning
              </h2>
            </div>

            {/* Retrieved context (original display during animation) */}
            {!editMode && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <SparkleIcon className="h-4 w-4 text-text-tertiary" />
                  <h3 className="text-[14px] font-semibold text-text-primary">
                    Retrieved context
                  </h3>
                </div>
                <div className="flex flex-col pl-1">
                  {resolution.retrievedContext.map((item) => (
                    <RetrievedContextItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Resolution plan (original display during animation) */}
            {!editMode && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <SparkleIcon className="h-4 w-4 text-text-tertiary" />
                  <h3 className="text-[14px] font-semibold text-text-primary">
                    Resolution plan
                  </h3>
                </div>
                <div className="flex flex-col pl-1">
                  {resolution.resolutionPlan.map((step) => (
                    <PlanStepComponent key={step.id} step={step} />
                  ))}
                </div>
              </div>
            )}

            {/* Approval gate: offer to edit instead of binary yes/no */}
            {waitingApproval && !editMode && !decided && (
              <div className="ml-1 animate-fade-in rounded-xl border border-accent/20 bg-accent-soft/30 p-5">
                <p className="text-[14px] font-semibold text-text-primary mb-1">
                  Human review required
                </p>
                <p className="text-[13px] text-text-secondary mb-4">
                  The agent has proposed a plan. You can review and refine it
                  before execution, or approve as-is.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={enterEditMode}
                    className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z" />
                    </svg>
                    Review &amp; refine plan
                  </button>
                  <button
                    onClick={() => { setExecSelection("original"); setEditMode(true); setShowSimulation(true); }}
                    className="rounded-lg border border-border-strong px-4 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-tertiary"
                  >
                    Approve as-is
                  </button>
                </div>
              </div>
            )}

            {/* Editable mode: context + plan + simulation + decision */}
            {editMode && (
              <div className="flex flex-col gap-5 animate-fade-in">
                {/* Editable context */}
                <ContextSourceManager
                  sources={editableSources}
                  onChange={setEditableSources}
                  editable={true}
                  highlighted={false}
                />

                {/* Editable plan */}
                <EditablePlanCard
                  steps={editablePlan}
                  onChange={setEditablePlan}
                  editable={true}
                  highlighted={true}
                />

                {/* Simulate button */}
                {!showSimulation && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowSimulation(true)}
                      className="flex items-center gap-2 rounded-lg bg-surface-inverse px-5 py-2.5 text-[13px] font-medium text-text-inverse transition-all hover:bg-surface-inverse/90 hover:shadow-lg"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2,8 5,8 7,4 9,12 11,8 14,8" />
                      </svg>
                      Simulate outcome
                    </button>
                  </div>
                )}

                {/* Simulation panel */}
                {showSimulation && (
                  <div className="animate-fade-in">
                    <SimulationPanel
                      original={simulation.original}
                      modified={simulation.modified}
                      highlighted={false}
                    />
                  </div>
                )}

                {/* Decision bar */}
                {showSimulation && (
                  <div className="animate-fade-in">
                    <ExecutionDecisionBar
                      hasModifications={hasModifications}
                      highlighted={false}
                      selection={execSelection}
                      onSelect={setExecSelection}
                      onExecute={handleExecute}
                      onReturn={handleReturn}
                      executing={execExecuting}
                      executed={execExecuted}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Bottom spacer so content isn't flush against scroll edge */}
          <div className="h-12 shrink-0" />
        </div>
      </div>
    </AppShell>
  );
}

/* ——— Ticket metadata chips ——— */

const TICKET_META: Record<
  string,
  { status: string; statusColor: string; category: string; extra?: string }
> = {
  "TK-4200": {
    status: "Escalated",
    statusColor: "bg-risk-high-soft text-risk-high",
    category: "SSO / Authentication",
    extra: "15 users affected",
  },
  "TK-4199": {
    status: "Resolved",
    statusColor: "bg-badge-green-soft text-badge-green",
    category: "Billing / Refund",
  },
  "TK-4201": {
    status: "Resolved",
    statusColor: "bg-badge-green-soft text-badge-green",
    category: "Billing",
  },
  "TK-4197": {
    status: "Resolved",
    statusColor: "bg-badge-green-soft text-badge-green",
    category: "Account / Auth",
  },
  "TK-4198": {
    status: "Resolved",
    statusColor: "bg-badge-green-soft text-badge-green",
    category: "Feature Request",
  },
  "TK-4196": {
    status: "Escalated",
    statusColor: "bg-risk-high-soft text-risk-high",
    category: "Sentiment",
  },
  "TK-4195": {
    status: "Resolved",
    statusColor: "bg-badge-green-soft text-badge-green",
    category: "Subscription",
  },
  "TK-7842": {
    status: "Resolved",
    statusColor: "bg-badge-green-soft text-badge-green",
    category: "Billing / Email",
  },
};

function TicketChips({ ticketId }: { ticketId: string }) {
  const meta = TICKET_META[ticketId];
  if (!meta) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.statusColor}`}
      >
        {meta.status}
      </span>
      <span className="rounded-full bg-surface-tertiary px-2.5 py-1 text-[11px] font-medium text-text-secondary">
        {ticketId}
      </span>
      {meta.extra && (
        <span className="rounded-full bg-surface-tertiary px-2.5 py-1 text-[11px] font-medium text-text-secondary">
          {meta.extra}
        </span>
      )}
      <span className="rounded-full bg-badge-orange-soft px-2.5 py-1 text-[11px] font-medium text-badge-orange">
        {meta.category}
      </span>
    </div>
  );
}


"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTour } from "./TourProvider";
import { SupportTicketCard } from "@/components/ticket/SupportTicketCard";
import { RetrievedContextItem } from "@/components/ticket/RetrievedContextItem";
import { ResolutionPlanStep as PlanStepComponent } from "@/components/ticket/ResolutionPlanStep";
import { SparkleIcon } from "@/components/icons";
import { GuidedStepOverlay } from "./GuidedStepOverlay";
import { ContextSourceManager } from "./ContextSourceManager";
import { EditablePlanCard } from "./EditablePlanCard";
import { SimulationPanel } from "./SimulationPanel";
import { ExecutionDecisionBar } from "./ExecutionDecisionBar";
import {
  GUIDED_STEPS,
  SSO_CONTEXT_SOURCES,
  SSO_ORIGINAL_PLAN,
  computeSimulation,
} from "./types";
import type { EditablePlanStep, ContextSource } from "./types";
import type {
  ResolutionPlanStep,
  RetrievedContextItem as CtxItem,
} from "@/data/types";
import { ticketResolutions } from "@/data/agent-reasoning";

export function GuidedTicketExperience() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [plan, setPlan] = useState<EditablePlanStep[]>(
    SSO_ORIGINAL_PLAN.map((s) => ({ ...s })),
  );
  const [sources, setSources] = useState<ContextSource[]>(
    SSO_CONTEXT_SOURCES.map((s) => ({ ...s })),
  );
  const [simulationRun, setSimulationRun] = useState(false);

  // Execution state
  const [selection, setSelection] = useState<"original" | "modified" | null>(
    null,
  );
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [workflowComplete, setWorkflowComplete] = useState(false);

  // Real-time workflow state (same as normal ticket flow)
  const [workflowContext, setWorkflowContext] = useState<CtxItem[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<ResolutionPlanStep[]>([]);

  // Keep original copies for comparison
  const originalPlan = useMemo(
    () => SSO_ORIGINAL_PLAN.map((s) => ({ ...s })),
    [],
  );
  const originalSources = useMemo(
    () => SSO_CONTEXT_SOURCES.map((s) => ({ ...s })),
    [],
  );

  // Detect modifications
  const hasModifications = useMemo(() => {
    if (plan.length !== originalPlan.length) return true;
    return (
      plan.some((step, i) => {
        const orig = originalPlan[i];
        return (
          !orig ||
          step.text !== orig.text ||
          step.enabled !== orig.enabled ||
          step.id !== orig.id
        );
      }) ||
      sources.some((src) => {
        const orig = originalSources.find((o) => o.id === src.id);
        return !orig || src.included !== orig.included;
      }) ||
      plan.some((s) => !s.isOriginal)
    );
  }, [plan, sources, originalPlan, originalSources]);

  // Simulation results
  const simulation = useMemo(
    () => computeSimulation(originalPlan, plan, originalSources, sources),
    [plan, sources, originalPlan, originalSources],
  );

  // Auto-run simulation when reaching step 3
  useEffect(() => {
    if (currentStep === 3 && !simulationRun) {
      setSimulationRun(true);
    }
  }, [currentStep, simulationRun]);

  // Animate real-time workflow after execution (same as normal ticket flow)
  useEffect(() => {
    if (!executed) return;

    const sourceData = ticketResolutions["TK-4200"];
    if (!sourceData) return;

    const contextItems = sourceData.retrievedContext;
    const planSteps = sourceData.resolutionPlan;
    const timeouts: NodeJS.Timeout[] = [];

    setWorkflowContext([]);
    setWorkflowSteps([]);

    // Animate context items
    contextItems.forEach((item, i) => {
      timeouts.push(
        setTimeout(
          () => {
            setWorkflowContext((prev) => [...prev, item]);
          },
          400 + i * 500,
        ),
      );
    });

    // Animate plan steps
    const contextDelay = 400 + contextItems.length * 500;
    let stepDelay = contextDelay + 300;

    planSteps.forEach((step, i) => {
      // Show as loading
      timeouts.push(
        setTimeout(() => {
          setWorkflowSteps((prev) => [...prev, { ...step, status: "loading" }]);
        }, stepDelay),
      );
      // Mark as complete
      timeouts.push(
        setTimeout(() => {
          setWorkflowSteps((prev) =>
            prev.map((s) =>
              s.id === step.id ? { ...s, status: "complete" } : s,
            ),
          );
          if (i === planSteps.length - 1) {
            setTimeout(() => setWorkflowComplete(true), 400);
          }
        }, stepDelay + 500),
      );
      stepDelay += 700;
    });

    return () => timeouts.forEach(clearTimeout);
  }, [executed]);

  // Section refs for scroll
  const issueRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<HTMLDivElement>(null);
  const decisionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to relevant section on step change
  useEffect(() => {
    const refs = [issueRef, contextRef, planRef, simRef, decisionRef];
    const ref = refs[currentStep];
    // Delay for elements that animate in
    const delay = currentStep >= 3 ? 400 : 100;
    const t = setTimeout(() => {
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, delay);
    return () => clearTimeout(t);
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const tour = useTour();

  const handleExit = useCallback(() => {
    localStorage.setItem("parahelp-demo-completed", "true");
    localStorage.setItem("parahelp-tour-show-complete", "true");
    tour.exit();
    router.push("/dashboard");
  }, [router, tour]);

  const handleGoToDashboard = useCallback(() => {
    localStorage.setItem("parahelp-demo-completed", "true");
    localStorage.setItem("parahelp-tour-show-complete", "true");
    tour.exit();
    router.push("/dashboard");
  }, [router, tour]);

  const handleReturn = useCallback(() => {
    setSimulationRun(false);
    setSelection(null);
    setCurrentStep(2);
  }, []);

  function handleSelect(sel: "original" | "modified" | null) {
    setSelection(sel);
  }

  function handleExecute() {
    if (!selection) return;
    setExecuting(true);
    setCurrentStep(4);
    setTimeout(() => {
      setExecuting(false);
      setExecuted(true);
    }, 2000);
  }

  const handleNext = useCallback(() => {
    if (currentStep === 4 && selection && !executing && !executed) {
      handleExecute();
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, GUIDED_STEPS.length - 1));
  }, [currentStep, selection, executing, executed]);

  // Auto-select default when reaching the execute step
  useEffect(() => {
    if (currentStep === 4 && !selection) {
      setSelection(hasModifications ? "modified" : "original");
    }
  }, [currentStep, selection, hasModifications]);

  // State indicators for progressive reveal
  const showContext = currentStep >= 1;
  const showPlan = currentStep >= 2;
  const planEditable = currentStep >= 2;
  const showSimulation = currentStep >= 3;
  const showDecision = currentStep >= 4;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Guided mode top bar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-accent/15 bg-accent-soft/30 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[12px] font-medium text-accent">
            Guided demo
          </span>
          <span className="text-[11px] text-text-tertiary">
            Step {currentStep + 1} of {GUIDED_STEPS.length}
          </span>
        </div>
        <button
          onClick={handleExit}
          className="text-[12px] text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Exit demo
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
        <div className="flex flex-col gap-6 p-4 pb-8 md:flex-row md:gap-8 md:p-8 md:pb-12">
          {/* Left: Support ticket */}
          <div ref={issueRef} className="w-full shrink-0 md:w-[42%]">
            <SupportTicketCard
              title="Support ticket"
              message="I can't log in with SSO anymore. It was working fine yesterday but now I get a 403 Forbidden error. I've tried clearing cookies and using incognito. Our team of 15 people is locked out."
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-risk-high-soft px-2.5 py-1 text-[11px] font-medium text-risk-high">
                Escalated
              </span>
              <span className="rounded-full bg-surface-tertiary px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                TK-4200
              </span>
              <span className="rounded-full bg-surface-tertiary px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                15 users affected
              </span>
              <span className="rounded-full bg-badge-orange-soft px-2.5 py-1 text-[11px] font-medium text-badge-orange">
                SSO / Authentication
              </span>
            </div>
          </div>

          {/* Right: Agent reasoning */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-5">
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
                <div className="ml-auto flex items-center gap-1.5">
                  <StateIndicator step={currentStep} />
                </div>
              </div>

              {/* Before execution: editable flow */}
              {!executed && (
                <>
                  {/* Context Sources */}
                  {showContext && (
                    <div ref={contextRef} className="animate-guide-section">
                      <ContextSourceManager
                        sources={sources}
                        onChange={setSources}
                        editable={planEditable}
                        highlighted={currentStep === 1 || currentStep === 2}
                      />
                    </div>
                  )}

                  {/* Resolution Plan */}
                  {showPlan && (
                    <div ref={planRef} className="animate-guide-section">
                      <EditablePlanCard
                        steps={plan}
                        onChange={setPlan}
                        editable={planEditable}
                        highlighted={currentStep === 2}
                      />
                    </div>
                  )}

                  {/* Simulate button */}
                  {planEditable && !showSimulation && (
                    <div className="flex justify-center animate-fade-in">
                      <button
                        onClick={() => {
                          setSimulationRun(true);
                          setCurrentStep(3);
                        }}
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

                  {/* Simulation Panel */}
                  {showSimulation && simulationRun && (
                    <div ref={simRef} className="animate-guide-section">
                      <SimulationPanel
                        original={simulation.original}
                        modified={simulation.modified}
                        highlighted={currentStep === 3}
                      />
                    </div>
                  )}

                  {/* Execution Decision */}
                  {showDecision && (
                    <div ref={decisionRef} className="animate-guide-section">
                      <ExecutionDecisionBar
                        hasModifications={hasModifications}
                        highlighted={currentStep === 4}
                        selection={selection}
                        onSelect={handleSelect}
                        onExecute={handleExecute}
                        onReturn={handleReturn}
                        executing={executing}
                        executed={executed}
                      />
                    </div>
                  )}
                </>
              )}

              {/* After execution: normal resolution workflow */}
              {executed && (
                <>
                  {/* Retrieved context */}
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <SparkleIcon className="h-4 w-4 text-text-tertiary" />
                      <h3 className="text-[14px] font-semibold text-text-primary">
                        Retrieved context
                      </h3>
                    </div>
                    <div className="flex flex-col pl-1">
                      {workflowContext.map((item) => (
                        <RetrievedContextItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>

                  {/* Resolution plan */}
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <SparkleIcon className="h-4 w-4 text-text-tertiary" />
                      <h3 className="text-[14px] font-semibold text-text-primary">
                        Resolution plan
                      </h3>
                    </div>
                    <div className="flex flex-col pl-1">
                      {workflowSteps.map((step) => (
                        <PlanStepComponent key={step.id} step={step} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Bottom spacer */}
              <div className="h-8 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Step overlay - bottom strip */}
      <GuidedStepOverlay
        currentStep={currentStep}
        totalSteps={GUIDED_STEPS.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onExit={handleExit}
        showDashboardButton={workflowComplete}
        onGoToDashboard={handleGoToDashboard}
        executeReady={
          currentStep === 4 && !!selection && !executing && !executed
        }
        onExecute={handleExecute}
        executing={executing}
      />
    </div>
  );
}

/* ——— State Indicator ——— */

function StateIndicator({ step }: { step: number }) {
  const states = [
    { label: "Investigating", color: "bg-badge-blue" },
    { label: "Retrieving", color: "bg-badge-blue" },
    { label: "Awaiting refinement", color: "bg-accent" },
    { label: "Simulating", color: "bg-badge-purple" },
    { label: "Ready to execute", color: "bg-badge-green" },
  ];

  const current = states[step];
  if (!current) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-surface-tertiary px-2.5 py-1">
      <div
        className={`h-1.5 w-1.5 rounded-full ${current.color} animate-pulse`}
      />
      <span className="text-[11px] font-medium text-text-secondary">
        {current.label}
      </span>
    </div>
  );
}

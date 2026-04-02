"use client";

import { useState, useEffect, useCallback, use } from "react";
import { AppShell } from "@/components/layout";
import { SupportTicketCard } from "@/components/ticket/SupportTicketCard";
import { AgentReasoningPanel } from "@/components/ticket/AgentReasoningPanel";
import { ticketResolutions } from "@/data/agent-reasoning";
import type { TicketResolution, ResolutionPlanStep } from "@/data/types";

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Look up by ticket ID or fall back to default
  const sourceData =
    ticketResolutions[id] ?? ticketResolutions["default"];

  const [resolution, setResolution] = useState<TicketResolution>(() => ({
    ...sourceData,
    retrievedContext: [],
    resolutionPlan: [],
  }));

  const [waitingApproval, setWaitingApproval] = useState(false);
  const [approvalStepId, setApprovalStepId] = useState<string | null>(null);
  const [remainingSteps, setRemainingSteps] = useState<ResolutionPlanStep[]>([]);

  // Animate context items + plan steps
  useEffect(() => {
    const contextItems = sourceData.retrievedContext;
    const planSteps = sourceData.resolutionPlan;
    const timeouts: NodeJS.Timeout[] = [];

    // Reset state for new data
    setResolution({
      ...sourceData,
      retrievedContext: [],
      resolutionPlan: [],
    });
    setWaitingApproval(false);
    setApprovalStepId(null);
    setRemainingSteps([]);

    // Reveal context items
    contextItems.forEach((item, i) => {
      const t = setTimeout(() => {
        setResolution((prev) => ({
          ...prev,
          retrievedContext: [...prev.retrievedContext, item],
        }));
      }, 400 + i * 500);
      timeouts.push(t);
    });

    // Reveal plan steps
    const contextDelay = 400 + contextItems.length * 500;
    let stepIndex = 0;

    function revealStep(step: ResolutionPlanStep, delay: number) {
      // If this is an approval gate, show it and pause
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
          // Store remaining steps to continue after approval
          const idx = planSteps.findIndex((s) => s.id === step.id);
          setRemainingSteps(planSteps.slice(idx + 1));
        }, delay);
        timeouts.push(t);
        return false; // stop iterating
      }

      // Show as loading
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

      // Mark complete
      const t2 = setTimeout(() => {
        setResolution((prev) => ({
          ...prev,
          resolutionPlan: prev.resolutionPlan.map((s) =>
            s.id === step.id ? { ...s, status: "complete" } : s
          ),
        }));
      }, delay + 600);
      timeouts.push(t2);

      return true; // continue
    }

    for (const step of planSteps) {
      const delay = contextDelay + 300 + stepIndex * 800;
      const shouldContinue = revealStep(step, delay);
      stepIndex++;
      if (!shouldContinue) break;
    }

    return () => timeouts.forEach(clearTimeout);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle approval/rejection
  const handleApproval = useCallback(
    (approved: boolean) => {
      if (!approvalStepId) return;

      setWaitingApproval(false);

      if (approved) {
        // Mark approval step as complete
        setResolution((prev) => ({
          ...prev,
          resolutionPlan: prev.resolutionPlan.map((s) =>
            s.id === approvalStepId ? { ...s, status: "complete" } : s
          ),
        }));

        // Continue with remaining steps
        let delay = 400;
        remainingSteps.forEach((step) => {
          const stepDelay = delay;
          // Show loading
          setTimeout(() => {
            setResolution((prev) => ({
              ...prev,
              resolutionPlan: [
                ...prev.resolutionPlan,
                { ...step, status: "loading" },
              ],
            }));
          }, stepDelay);

          // Complete
          setTimeout(() => {
            setResolution((prev) => ({
              ...prev,
              resolutionPlan: prev.resolutionPlan.map((s) =>
                s.id === step.id ? { ...s, status: "complete" } : s
              ),
            }));
          }, stepDelay + 600);

          delay += 800;
        });
      } else {
        // Mark as error
        setResolution((prev) => ({
          ...prev,
          resolutionPlan: prev.resolutionPlan.map((s) =>
            s.id === approvalStepId ? { ...s, status: "error" } : s
          ),
        }));
      }

      setApprovalStepId(null);
      setRemainingSteps([]);
    },
    [approvalStepId, remainingSteps]
  );

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-6 p-4 overflow-y-auto md:flex-row md:gap-8 md:p-8">
        {/* Left: Support ticket */}
        <div className="w-full shrink-0 md:w-[45%]">
          <SupportTicketCard
            title={resolution.title}
            message={resolution.customerMessage}
          />
        </div>

        {/* Right: Agent reasoning */}
        <div className="flex-1 min-w-0">
          <AgentReasoningPanel
            resolution={resolution}
            waitingApproval={waitingApproval}
            onApprove={() => handleApproval(true)}
            onReject={() => handleApproval(false)}
          />
        </div>
      </div>
    </AppShell>
  );
}

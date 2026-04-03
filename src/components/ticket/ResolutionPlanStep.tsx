import type { ResolutionPlanStep as PlanStepType } from "../../data/types";
import { LinkIcon, StripeIcon, ZendeskIcon, ApprovalIcon, CheckIcon } from "../icons";

interface ResolutionPlanStepProps {
  step: PlanStepType;
}

function StepIcon({ icon }: { icon: PlanStepType["icon"] }) {
  switch (icon) {
    case "link":
      return <LinkIcon className="h-4 w-4 text-text-tertiary" />;
    case "stripe":
      return <StripeIcon size={20} />;
    case "zendesk":
      return <ZendeskIcon size={20} />;
    case "approval":
    case "wait":
      return <ApprovalIcon className="h-4 w-4" />;
  }
}

function StatusIndicator({ status }: { status: PlanStepType["status"] }) {
  switch (status) {
    case "complete":
      return <CheckIcon className="h-5 w-5 text-badge-green" />;
    case "loading":
      return (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-surface-tertiary border-t-text-tertiary" />
      );
    case "approval-gate":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-badge-orange-soft">
          <span className="text-[10px] font-bold text-badge-orange">!</span>
        </div>
      );
    case "error":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-risk-high-soft">
          <span className="text-[10px] font-bold text-risk-high">&times;</span>
        </div>
      );
    default:
      return null;
  }
}

export function ResolutionPlanStep({ step }: ResolutionPlanStepProps) {
  return (
    <div className="flex items-center gap-3 py-2 animate-step-in">
      {/* Status indicator (left) */}
      <div className="flex h-5 w-5 items-center justify-center shrink-0">
        <StatusIndicator status={step.status} />
      </div>

      {/* Label */}
      <span
        className={`flex-1 text-[14px] ${
          step.status === "pending"
            ? "text-text-tertiary"
            : "text-text-primary"
        }`}
      >
        {step.label}
      </span>

      {/* Integration icon (right) */}
      <div className="shrink-0">
        <StepIcon icon={step.icon} />
      </div>
    </div>
  );
}

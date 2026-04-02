import Image from "next/image";
import type { TicketResolution } from "../../data/types";
import { SparkleIcon } from "../icons";
import { RetrievedContextItem } from "./RetrievedContextItem";
import { ResolutionPlanStep } from "./ResolutionPlanStep";

interface AgentReasoningPanelProps {
  resolution: TicketResolution;
  waitingApproval?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export function AgentReasoningPanel({
  resolution,
  waitingApproval,
  onApprove,
  onReject,
}: AgentReasoningPanelProps) {
  return (
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

      {/* Retrieved context */}
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

      {/* Resolution plan */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <SparkleIcon className="h-4 w-4 text-text-tertiary" />
          <h3 className="text-[14px] font-semibold text-text-primary">
            Resolution plan
          </h3>
        </div>
        <div className="flex flex-col pl-1">
          {resolution.resolutionPlan.map((step) => (
            <ResolutionPlanStep key={step.id} step={step} />
          ))}
        </div>

        {/* Approval gate prompt */}
        {waitingApproval && (
          <div className="ml-1 mt-4 animate-fade-in rounded-lg border border-badge-orange/30 bg-badge-orange-soft/30 p-4">
            <p className="text-[13px] font-medium text-text-primary mb-1">
              Human approval required
            </p>
            <p className="text-[12px] text-text-secondary mb-3">
              This action requires operator approval before the agent can
              proceed. Review the context above and decide.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onApprove}
                className="rounded-lg bg-surface-inverse px-4 py-2 text-[13px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90"
              >
                Approve
              </button>
              <button
                onClick={onReject}
                className="rounded-lg border border-border-strong px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-tertiary"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

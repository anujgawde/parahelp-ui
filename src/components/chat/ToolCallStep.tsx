import type { ToolCall } from "../../data/types";
import { EyeIcon, FileIcon, SearchIcon, CodeIcon, ChevronDownIcon } from "../icons";

interface ToolCallStepProps {
  toolCall: ToolCall;
}

const ICON_MAP = {
  file: FileIcon,
  search: SearchIcon,
  code: CodeIcon,
  memory: FileIcon,
};

export function ToolCallStep({ toolCall }: ToolCallStepProps) {
  const Icon = ICON_MAP[toolCall.icon];

  return (
    <div className="flex items-center gap-2 rounded-md bg-surface-secondary px-3 py-2 text-[13px]">
      <EyeIcon className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
      <span className="font-medium text-text-primary">{toolCall.label}</span>

      {toolCall.target && (
        <>
          <span className="text-text-tertiary">&gt;</span>
          <Icon className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
          <span className="text-text-secondary">{toolCall.target}</span>
        </>
      )}

      {toolCall.resultSummary && (
        <span className="ml-auto flex items-center gap-1 rounded-full bg-surface-tertiary px-2 py-0.5 text-[11px] font-medium text-text-secondary">
          {toolCall.resultSummary}
          {toolCall.expandable && (
            <ChevronDownIcon className="h-3 w-3 text-text-tertiary" />
          )}
        </span>
      )}
    </div>
  );
}

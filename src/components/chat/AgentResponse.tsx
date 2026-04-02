import type { ChatMessage } from "../../data/types";
import { ToolCallStep } from "./ToolCallStep";
import { DiffBlock } from "./DiffBlock";

interface AgentResponseProps {
  message: ChatMessage;
}

export function AgentResponse({ message }: AgentResponseProps) {
  return (
    <div className="flex flex-col gap-3 px-6 py-4 pl-[4.25rem]">
      {/* Text content */}
      {message.content && (
        <div className="text-[14px] leading-relaxed text-text-primary whitespace-pre-line">
          {message.content}
        </div>
      )}

      {/* Tool calls */}
      {message.toolCalls && message.toolCalls.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {message.toolCalls.map((tc) => (
            <ToolCallStep key={tc.id} toolCall={tc} />
          ))}
        </div>
      )}

      {/* Action blocks (diffs) */}
      {message.actions && message.actions.length > 0 && (
        <div className="flex flex-col gap-2">
          {message.actions.map((action) => (
            <DiffBlock key={action.id} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}

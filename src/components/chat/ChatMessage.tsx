import type { ChatMessage as ChatMessageType } from "../../data/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function UserMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex gap-3 px-6 py-4">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-tertiary">
        <span className="text-[11px] font-semibold text-text-secondary">
          {message.avatarInitials}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-text-primary">
            {message.author}
          </span>
          <span className="text-[12px] text-text-tertiary">
            {message.timestamp}
          </span>
        </div>
        <p className="text-[14px] leading-relaxed text-text-primary">
          {message.content}
        </p>
      </div>
    </div>
  );
}

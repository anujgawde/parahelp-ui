import { ZendeskIcon } from "../icons";

interface SupportTicketCardProps {
  title: string;
  message: string;
}

export function SupportTicketCard({ title, message }: SupportTicketCardProps) {
  return (
    <div className="rounded-xl bg-surface-secondary p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <ZendeskIcon size={24} />
        <span className="text-[13px] font-medium text-text-secondary">
          {title}
        </span>
      </div>

      {/* Customer message */}
      <p className="text-[18px] leading-relaxed text-text-primary">
        {message}
      </p>
    </div>
  );
}

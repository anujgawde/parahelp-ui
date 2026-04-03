export function ZendeskIcon({ size = 24 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-zendesk shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="font-semibold text-white leading-none"
        style={{ fontSize: size * 0.5 }}
      >
        Z
      </span>
    </div>
  );
}

export function StripeIcon({ size = 20 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-stripe shrink-0"
      style={{ width: size, height: size }}
    >
      <span
        className="font-bold text-white leading-none"
        style={{ fontSize: size * 0.55 }}
      >
        S
      </span>
    </div>
  );
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M12.5 3.5L11 5M5 11l-1.5 1.5" />
    </svg>
  );
}

export function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

export function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 1.5H4a1 1 0 00-1 1v11a1 1 0 001 1h8a1 1 0 001-1V4.5L9.5 1.5z" />
      <polyline points="9.5,1.5 9.5,4.5 13,4.5" />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="7" r="4.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" />
    </svg>
  );
}

export function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 9.5a3 3 0 004.243 0l2-2a3 3 0 00-4.243-4.243L7.5 4.257" />
      <path d="M9.5 6.5a3 3 0 00-4.243 0l-2 2a3 3 0 004.243 4.243L8.5 11.743" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4,6 8,10 12,6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6,4 10,8 6,12" />
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="3" x2="8" y2="13" />
      <line x1="3" y1="8" x2="13" y2="8" />
    </svg>
  );
}

export function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,4 13,4" />
      <path d="M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4" />
      <path d="M4 4l.7 9.1a1 1 0 001 .9h4.6a1 1 0 001-.9L12 4" />
    </svg>
  );
}

export function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="3.5" r="2" />
      <circle cx="4" cy="8" r="2" />
      <circle cx="12" cy="12.5" r="2" />
      <line x1="5.8" y1="9" x2="10.2" y2="11.5" />
      <line x1="10.2" y1="4.5" x2="5.8" y2="7" />
    </svg>
  );
}

export function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="14" x2="3" y2="8" />
      <line x1="3" y1="5" x2="3" y2="2" />
      <line x1="8" y1="14" x2="8" y2="11" />
      <line x1="8" y1="8" x2="8" y2="2" />
      <line x1="13" y1="14" x2="13" y2="6" />
      <line x1="13" y1="3" x2="13" y2="2" />
      <circle cx="3" cy="6.5" r="1.5" />
      <circle cx="8" cy="9.5" r="1.5" />
      <circle cx="13" cy="4.5" r="1.5" />
    </svg>
  );
}

export function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="12" x2="8" y2="4" />
      <polyline points="4,7 8,3 12,7" />
    </svg>
  );
}

/* Remix checkbox-circle-fill */
export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" />
    </svg>
  );
}

export function ApprovalIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4"} viewBox="0 0 16 16" fill="none">
      <circle cx="5" cy="8" r="2.5" fill="#F97316" />
      <circle cx="11" cy="8" r="2.5" fill="#3B82F6" />
      <circle cx="8" cy="5" r="2.5" fill="#22C55E" />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <polyline points="8,5 8,8 10.5,9.5" />
    </svg>
  );
}

export function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="2,8 5,8 7,4 9,12 11,8 14,8" />
    </svg>
  );
}

export function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h12v8H5l-3 3V3z" />
    </svg>
  );
}

export function AgentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="2" width="10" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="10" cy="6" r="1" fill="currentColor" />
      <line x1="5" y1="12" x2="5" y2="14" />
      <line x1="11" y1="12" x2="11" y2="14" />
    </svg>
  );
}

export function ScheduleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="12" height="11" rx="1" />
      <line x1="2" y1="7" x2="14" y2="7" />
      <line x1="5" y1="1" x2="5" y2="4" />
      <line x1="11" y1="1" x2="11" y2="4" />
    </svg>
  );
}

export function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" />
    </svg>
  );
}

export function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="5,4 1,8 5,12" />
      <polyline points="11,4 15,8 11,12" />
    </svg>
  );
}

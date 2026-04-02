interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-tertiary">
        <EmptyIcon className="h-5 w-5 text-text-tertiary" />
      </div>
      <p className="mt-3 text-sm font-medium text-text-primary">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-[13px] text-text-tertiary">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function EmptyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="3" />
      <path d="M7 10h6M10 7v6" opacity=".4" />
    </svg>
  );
}

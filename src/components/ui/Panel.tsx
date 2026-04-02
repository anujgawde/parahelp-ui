interface PanelProps {
  children: React.ReactNode;
  /** Remove default padding */
  flush?: boolean;
  className?: string;
}

export function Panel({ children, flush, className }: PanelProps) {
  return (
    <div
      className={`rounded-lg border border-border-default bg-surface-secondary ${
        flush ? "" : "p-5"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

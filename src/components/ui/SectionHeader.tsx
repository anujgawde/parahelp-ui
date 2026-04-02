interface SectionHeaderProps {
  title: string;
  /** Optional right-side element — action button, badge count, etc. */
  action?: React.ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[13px] font-semibold text-text-primary">{title}</h2>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
}

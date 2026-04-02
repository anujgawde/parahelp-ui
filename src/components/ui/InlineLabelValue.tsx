interface InlineLabelValueProps {
  label: string;
  value: React.ReactNode;
}

export function InlineLabelValue({ label, value }: InlineLabelValueProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className="text-[13px] font-medium text-text-primary">{value}</span>
    </div>
  );
}

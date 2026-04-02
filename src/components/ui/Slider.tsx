"use client";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
  onChange,
  hint,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[13px] font-medium text-text-primary">{label}</span>
        <span className="font-mono text-[13px] font-semibold text-text-primary">{display}</span>
      </div>
      <div className="relative h-4 flex items-center">
        {/* Background track */}
        <div className="absolute left-0 right-0 h-1.5 rounded-full bg-surface-tertiary" />
        {/* Filled track */}
        <div
          className="absolute left-0 h-1.5 rounded-full bg-accent pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        {/* Native input on top */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input absolute inset-0 w-full"
        />
      </div>
      {hint && (
        <p className="mt-1.5 text-[11px] text-text-tertiary">{hint}</p>
      )}
    </div>
  );
}

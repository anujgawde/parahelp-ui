"use client";

import type { SimulationResult } from "./types";

interface SimulationPanelProps {
  original: SimulationResult;
  modified: SimulationResult;
  highlighted: boolean;
}

export function SimulationPanel({
  original,
  modified,
  highlighted,
}: SimulationPanelProps) {
  const hasChanges = modified.confidence !== original.confidence;

  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-300 ${
        highlighted
          ? "border-accent/30 bg-surface-primary shadow-lg shadow-accent/5 ring-1 ring-accent/10"
          : "border-border-default bg-surface-secondary"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="h-4 w-4 text-accent"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="2,8 5,8 7,4 9,12 11,8 14,8" />
        </svg>
        <h4 className="text-[14px] font-semibold text-text-primary">
          Simulation results
        </h4>
      </div>

      {/* Comparison grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Original */}
        <div className="rounded-lg border border-border-default bg-surface-tertiary/50 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary mb-3">
            Original Plan
          </p>
          <MetricRow label="Confidence" value={`${original.confidence}%`} />
          <MetricRow label="Risk" value={original.risk} risk={original.risk} />
          <MetricRow label="Est. Success" value={`${original.success}%`} />
        </div>

        {/* Modified */}
        <div
          className={`rounded-lg border p-4 ${
            hasChanges
              ? "border-badge-green/30 bg-badge-green-soft/30"
              : "border-border-default bg-surface-tertiary/50"
          }`}
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary mb-3">
            Modified Plan
          </p>
          <MetricRowWithDelta
            label="Confidence"
            value={modified.confidence}
            original={original.confidence}
            unit="%"
          />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[12px] text-text-secondary">Risk</span>
            <div className="flex items-center gap-1.5">
              <RiskBadge risk={modified.risk} />
              {modified.risk !== original.risk && (
                <svg
                  className="h-3 w-3 text-badge-green"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polyline points="4,10 8,6 12,10" />
                </svg>
              )}
            </div>
          </div>
          <MetricRowWithDelta
            label="Est. Success"
            value={modified.success}
            original={original.success}
            unit="%"
          />
        </div>
      </div>

      {/* Reasons */}
      {hasChanges && modified.reasons.length > 0 && (
        <div className="rounded-lg border border-accent/15 bg-accent-soft/30 p-3 animate-fade-in">
          <p className="text-[11px] font-semibold text-accent mb-2">
            Why confidence changed
          </p>
          <div className="flex flex-col gap-1">
            {modified.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-3 w-3 shrink-0 text-badge-green"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3.5,8.5 6.5,11.5 12.5,4.5" />
                </svg>
                <span className="text-[12px] text-text-secondary">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasChanges && (
        <div className="rounded-lg border border-border-default bg-surface-tertiary/50 p-3 text-center">
          <p className="text-[12px] text-text-tertiary">
            Make changes to the plan or context sources to see how simulation results change.
          </p>
        </div>
      )}
    </div>
  );
}

function MetricRow({ label, value, risk }: { label: string; value: string; risk?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[12px] text-text-secondary">{label}</span>
      {risk ? (
        <RiskBadge risk={risk} />
      ) : (
        <span className="text-[13px] font-semibold text-text-primary">{value}</span>
      )}
    </div>
  );
}

function MetricRowWithDelta({
  label,
  value,
  original,
  unit,
}: {
  label: string;
  value: number;
  original: number;
  unit: string;
}) {
  const delta = value - original;
  const hasChange = Math.abs(delta) > 0;

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[12px] text-text-secondary">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-semibold text-text-primary">
          {value}{unit}
        </span>
        {hasChange && (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              delta > 0
                ? "bg-badge-green-soft text-badge-green"
                : "bg-risk-high-soft text-risk-high"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, string> = {
    Low: "bg-badge-green-soft text-badge-green",
    Medium: "bg-badge-orange-soft text-badge-orange",
    High: "bg-risk-high-soft text-risk-high",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        styles[risk] ?? styles.Medium
      }`}
    >
      {risk}
    </span>
  );
}

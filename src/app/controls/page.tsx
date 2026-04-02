"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout";
import { Panel, SectionHeader, Slider, Toggle, InlineLabelValue } from "@/components/ui";
import type { AgentControls } from "@/data/types";
import { defaultControls, computeImpact } from "@/data/controls";

export default function CustomerAgentPage() {
  const [controls, setControls] = useState<AgentControls>(defaultControls);

  const impact = useMemo(() => computeImpact(controls), [controls]);
  const baseline = useMemo(() => computeImpact(defaultControls), []);

  const dirty = JSON.stringify(controls) !== JSON.stringify(defaultControls);

  function toggleRule(id: string) {
    setControls((prev) => ({
      ...prev,
      escalationRules: prev.escalationRules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  }

  function aggrLabel(v: number): string {
    if (v <= 20) return "Very Conservative";
    if (v <= 40) return "Conservative";
    if (v <= 60) return "Balanced";
    if (v <= 80) return "Aggressive";
    return "Very Aggressive";
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center border-b border-border-default px-4 md:px-6">
          <h1 className="text-sm font-semibold text-text-primary">
            Customer agent
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Thresholds */}
            <div>
              <SectionHeader title="Resolution & Approval Thresholds" />
              <Panel className="mt-3 space-y-6">
                <Slider
                  label="Auto-resolution confidence threshold"
                  value={controls.autoResolutionThreshold}
                  min={50}
                  max={99}
                  unit="%"
                  onChange={(v) =>
                    setControls((p) => ({ ...p, autoResolutionThreshold: v }))
                  }
                  hint="Tickets above this confidence level are resolved without human review."
                />
                <Slider
                  label="Refund auto-approval limit"
                  value={controls.refundApprovalLimit}
                  min={100}
                  max={2000}
                  step={50}
                  formatValue={(v) => `$${v.toLocaleString()}`}
                  onChange={(v) =>
                    setControls((p) => ({ ...p, refundApprovalLimit: v }))
                  }
                  hint="Refunds above this amount require the approval pipeline."
                />
              </Panel>
            </div>

            {/* Aggressiveness */}
            <div>
              <SectionHeader
                title="Agent Behavior"
                action={
                  <span className="text-[12px] text-text-secondary">
                    {aggrLabel(controls.aggressiveness)}
                  </span>
                }
              />
              <Panel className="mt-3">
                <Slider
                  label="Aggressiveness"
                  value={controls.aggressiveness}
                  min={0}
                  max={100}
                  onChange={(v) =>
                    setControls((p) => ({ ...p, aggressiveness: v }))
                  }
                />
                <div className="mt-3 flex justify-between text-[11px] text-text-tertiary">
                  <span>Safest — more escalations, higher accuracy</span>
                  <span>Fastest — more auto-resolve, higher risk</span>
                </div>
              </Panel>
            </div>

            {/* Escalation rules */}
            <div>
              <SectionHeader
                title="Escalation Rules"
                action={
                  <span className="text-[11px] text-text-tertiary">
                    {controls.escalationRules.filter((r) => r.enabled).length} of{" "}
                    {controls.escalationRules.length} active
                  </span>
                }
              />
              <Panel flush className="mt-3">
                {controls.escalationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-start gap-4 border-b border-border-default px-5 py-3.5 last:border-b-0"
                  >
                    <div className="pt-0.5">
                      <Toggle
                        checked={rule.enabled}
                        onChange={() => toggleRule(rule.id)}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13px] font-medium ${
                          rule.enabled
                            ? "text-text-primary"
                            : "text-text-tertiary"
                        }`}
                      >
                        {rule.label}
                      </p>
                      <p
                        className={`mt-0.5 text-[12px] ${
                          rule.enabled
                            ? "text-text-secondary"
                            : "text-text-tertiary"
                        }`}
                      >
                        {rule.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        rule.enabled
                          ? "bg-badge-green-soft text-badge-green"
                          : "bg-surface-tertiary text-text-tertiary"
                      }`}
                    >
                      {rule.enabled ? "Active" : "Off"}
                    </span>
                  </div>
                ))}
              </Panel>
            </div>

            {/* Impact summary */}
            <Panel>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                Impact Preview
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[12px] text-text-tertiary">Auto-Resolution</p>
                  <p className="text-[18px] font-semibold text-text-primary">
                    {impact.autoResolutionRate}%
                  </p>
                  <DeltaLabel current={impact.autoResolutionRate} base={baseline.autoResolutionRate} />
                </div>
                <div>
                  <p className="text-[12px] text-text-tertiary">Escalation Rate</p>
                  <p className="text-[18px] font-semibold text-text-primary">
                    {impact.escalationRate}%
                  </p>
                  <DeltaLabel current={impact.escalationRate} base={baseline.escalationRate} invert />
                </div>
                <div>
                  <p className="text-[12px] text-text-tertiary">Avg Resolution</p>
                  <p className="text-[18px] font-semibold text-text-primary">
                    {impact.avgResolutionTime}m
                  </p>
                  <DeltaLabel current={impact.avgResolutionTime} base={baseline.avgResolutionTime} invert />
                </div>
              </div>
            </Panel>

            {/* Actions */}
            {dirty && (
              <div className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent-soft px-5 py-3">
                <p className="text-[13px] text-text-secondary">
                  You have unsaved changes.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setControls(defaultControls)}
                    className="rounded-lg border border-border-default bg-surface-primary px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:border-border-strong"
                  >
                    Reset
                  </button>
                  <button className="rounded-lg bg-surface-inverse px-4 py-2 text-[13px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90">
                    Apply Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function DeltaLabel({
  current,
  base,
  invert = false,
}: {
  current: number;
  base: number;
  invert?: boolean;
}) {
  const diff = current - base;
  if (Math.abs(diff) < 0.1) {
    return <p className="text-[11px] text-text-tertiary">No change</p>;
  }
  const arrow = diff > 0 ? "+" : "";
  const isGood = invert ? diff < 0 : diff > 0;
  return (
    <p
      className={`text-[11px] ${
        isGood ? "text-badge-green" : "text-risk-high"
      }`}
    >
      {arrow}
      {diff.toFixed(1)}pp
    </p>
  );
}

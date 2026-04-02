import type { AgentControls, ImpactPreview } from "./types";

// ——— Mock defaults: replace with API call later ———

export const defaultControls: AgentControls = {
  autoResolutionThreshold: 85,
  refundApprovalLimit: 500,
  aggressiveness: 45,
  escalationRules: [
    {
      id: "esc-confidence",
      label: "Low confidence escalation",
      description:
        "Escalate to human when AI confidence drops below the auto-resolution threshold",
      enabled: true,
    },
    {
      id: "esc-sentiment",
      label: "Negative sentiment detection",
      description:
        "Escalate when customer sentiment is classified as angry or frustrated",
      enabled: true,
    },
    {
      id: "esc-repeat",
      label: "Repeat contact escalation",
      description:
        "Escalate when the same customer contacts support 3+ times in 24 hours",
      enabled: true,
    },
    {
      id: "esc-refund-high",
      label: "High-value refund review",
      description:
        "Require approval pipeline for refunds exceeding the approval threshold",
      enabled: true,
    },
    {
      id: "esc-pii",
      label: "PII request hold",
      description:
        "Hold and flag tickets where customer requests data export or deletion",
      enabled: false,
    },
    {
      id: "esc-vip",
      label: "VIP account routing",
      description:
        "Route enterprise and VIP accounts directly to senior support queue",
      enabled: false,
    },
  ],
};

/**
 * Deterministic impact model (approximates how controls affect KPIs).
 * In production this would be a backend simulation endpoint.
 */
export function computeImpact(controls: AgentControls): ImpactPreview {
  const {
    autoResolutionThreshold,
    refundApprovalLimit,
    aggressiveness,
    escalationRules,
  } = controls;

  const enabledRuleCount = escalationRules.filter((r) => r.enabled).length;

  // Base rates (calibrated to current mock dashboard data)
  const baseAutoRate = 77.5;
  const baseEscRate = 8.4;
  const baseResTime = 3.8;

  // Threshold: lower threshold = more auto-resolved but riskier
  const thresholdDelta = (85 - autoResolutionThreshold) / 100;
  const autoRateFromThreshold = baseAutoRate + thresholdDelta * 40;

  // Aggressiveness: higher = faster + more auto-resolve, lower = safer
  const aggrFactor = (aggressiveness - 45) / 100;
  const autoRateFromAggr = autoRateFromThreshold + aggrFactor * 15;

  // Escalation rules: more rules = higher escalation rate
  const ruleEscPenalty = (enabledRuleCount - 4) * 1.2;

  // Refund limit: lower limit = more approvals needed = more escalations
  const refundEscPenalty = ((500 - refundApprovalLimit) / 500) * 3;

  const autoResolutionRate = clamp(autoRateFromAggr, 40, 98);
  const escalationRate = clamp(
    baseEscRate + ruleEscPenalty + refundEscPenalty - aggrFactor * 8,
    1,
    35,
  );

  // Resolution time: inversely related to aggressiveness, raised by more rules
  const resTime = clamp(
    baseResTime -
      aggrFactor * 2 +
      ruleEscPenalty * 0.3 +
      refundEscPenalty * 0.15,
    1.2,
    12,
  );

  return {
    autoResolutionRate: round1(autoResolutionRate),
    escalationRate: round1(escalationRate),
    avgResolutionTime: round1(resTime),
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function round1(v: number) {
  return Math.round(v * 10) / 10;
}

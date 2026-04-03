export interface EditablePlanStep {
  id: string;
  text: string;
  detail?: string;
  enabled: boolean;
  isOriginal: boolean;
}

export interface ContextSource {
  id: string;
  title: string;
  type: "knowledge-base" | "external-system" | "internal-policy";
  tag: string;
  included: boolean;
}

export interface SimulationResult {
  confidence: number;
  risk: "Low" | "Medium" | "High";
  success: number;
  reasons: string[];
}

export interface GuidedStep {
  id: string;
  title: string;
  description: string;
}

export const GUIDED_STEPS: GuidedStep[] = [
  {
    id: "issue",
    title: "Support issue received",
    description:
      "An SSO login failure affecting 15 users has been reported. Review the customer's message.",
  },
  {
    id: "investigate",
    title: "Agent retrieves context",
    description:
      "The agent pulls relevant knowledge sources and system data to understand the issue.",
  },
  {
    id: "plan",
    title: "Agent proposes resolution plan",
    description:
      "Based on retrieved context, the agent generates a step-by-step plan.",
  },
  {
    id: "refine",
    title: "Refine the plan",
    description:
      "Edit steps, reorder actions, toggle items on/off, and manage context sources.",
  },
  {
    id: "simulate",
    title: "Simulate outcome",
    description:
      "Compare metrics between the original agent plan and your modified version.",
  },
  {
    id: "decide",
    title: "Choose a plan",
    description:
      "Select which plan to execute: the original or your refined version.",
  },
  {
    id: "execute",
    title: "Execute",
    description:
      "Confirm and execute the selected plan. The agent will process all steps in order.",
  },
];

// SSO scenario data

export const SSO_CONTEXT_SOURCES: ContextSource[] = [
  {
    id: "src-1",
    title: "SSO Configuration Guide",
    type: "knowledge-base",
    tag: "Knowledge Base",
    included: true,
  },
  {
    id: "src-2",
    title: "IdP Status Dashboard",
    type: "external-system",
    tag: "External System",
    included: true,
  },
  {
    id: "src-3",
    title: "Session Token Policy",
    type: "internal-policy",
    tag: "Internal Policy",
    included: true,
  },
  {
    id: "src-4",
    title: "General Auth Troubleshooting",
    type: "knowledge-base",
    tag: "Knowledge Base",
    included: true,
  },
  {
    id: "src-5",
    title: "SAML Certificate Rotation Guide",
    type: "knowledge-base",
    tag: "Knowledge Base",
    included: false,
  },
  {
    id: "src-6",
    title: "Recent SSO Incidents Log",
    type: "external-system",
    tag: "Internal System",
    included: false,
  },
];

export const SSO_ORIGINAL_PLAN: EditablePlanStep[] = [
  {
    id: "p-1",
    text: "Verify SSO configuration in admin panel",
    enabled: true,
    isOriginal: true,
  },
  {
    id: "p-2",
    text: "Check identity provider connection status",
    enabled: true,
    isOriginal: true,
  },
  {
    id: "p-3",
    text: "Review authentication error logs from past 24h",
    enabled: true,
    isOriginal: true,
  },
  {
    id: "p-4",
    text: "Reset SSO session tokens for affected users",
    detail: "Requires operator approval",
    enabled: true,
    isOriginal: true,
  },
  {
    id: "p-5",
    text: "Clear cached SAML assertions and re-authenticate",
    enabled: true,
    isOriginal: true,
  },
  {
    id: "p-6",
    text: "Send temporary password as login fallback",
    enabled: true,
    isOriginal: true,
  },
  {
    id: "p-7",
    text: "Escalate to identity platform team if unresolved",
    enabled: true,
    isOriginal: true,
  },
];

export function computeSimulation(
  originalPlan: EditablePlanStep[],
  modifiedPlan: EditablePlanStep[],
  originalSources: ContextSource[],
  modifiedSources: ContextSource[],
): { original: SimulationResult; modified: SimulationResult } {
  const originalResult: SimulationResult = {
    confidence: 72,
    risk: "Medium",
    success: 68,
    reasons: [],
  };

  // Count meaningful changes
  const enabledOriginal = originalPlan.filter((s) => s.enabled);
  const enabledModified = modifiedPlan.filter((s) => s.enabled);
  const reasons: string[] = [];
  let boost = 0;

  // Check for added steps (operator expertise)
  const addedSteps = modifiedPlan.filter((s) => !s.isOriginal && s.enabled);
  if (addedSteps.length > 0) {
    boost += addedSteps.length * 5;
    reasons.push(
      `Added ${addedSteps.length} targeted step${addedSteps.length > 1 ? "s" : ""}`,
    );
  }

  // Check for removed/disabled steps (noise reduction)
  const disabledOriginals = modifiedPlan.filter(
    (s) => s.isOriginal && !s.enabled,
  );
  if (disabledOriginals.length > 0) {
    boost += disabledOriginals.length * 3;
    reasons.push(
      `Removed ${disabledOriginals.length} redundant step${disabledOriginals.length > 1 ? "s" : ""}`,
    );
  }

  // Check for edited steps
  const editedSteps = modifiedPlan.filter((s) => {
    const orig = originalPlan.find((o) => o.id === s.id);
    return orig && orig.text !== s.text && s.enabled;
  });
  if (editedSteps.length > 0) {
    boost += editedSteps.length * 2;
    reasons.push(
      `Refined ${editedSteps.length} step${editedSteps.length > 1 ? "s" : ""} with specific instructions`,
    );
  }

  // Check for context source changes
  const origIncluded = originalSources.filter((s) => s.included).length;
  const modIncluded = modifiedSources.filter((s) => s.included).length;
  const newSources = modifiedSources.filter(
    (s) => s.included && !originalSources.find((o) => o.id === s.id && o.included),
  );
  const removedSources = originalSources.filter(
    (s) => s.included && !modifiedSources.find((m) => m.id === s.id && m.included),
  );

  if (newSources.length > 0) {
    boost += newSources.length * 4;
    reasons.push(`Included ${newSources.length} additional knowledge source${newSources.length > 1 ? "s" : ""}`);
  }
  if (removedSources.length > 0) {
    boost += removedSources.length * 2;
    reasons.push("Removed low-relevance context source");
  }

  // Reorder detection
  const origOrder = originalPlan.map((s) => s.id);
  const modOrder = modifiedPlan.filter((s) => s.isOriginal).map((s) => s.id);
  if (JSON.stringify(origOrder) !== JSON.stringify(modOrder)) {
    boost += 2;
    if (!reasons.some((r) => r.includes("Reordered"))) {
      reasons.push("Optimized step execution order");
    }
  }

  if (reasons.length === 0) {
    reasons.push("No modifications made");
  }

  const cappedBoost = Math.min(boost, 25);

  const modified: SimulationResult = {
    confidence: originalResult.confidence + cappedBoost,
    risk: cappedBoost >= 12 ? "Low" : cappedBoost >= 5 ? "Medium" : originalResult.risk,
    success: Math.min(originalResult.success + Math.round(cappedBoost * 1.2), 98),
    reasons,
  };

  return { original: originalResult, modified };
}

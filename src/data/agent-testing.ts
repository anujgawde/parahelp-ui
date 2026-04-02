import type { MemoryFile, TestCase } from "./types";

export const memoryFiles: MemoryFile[] = [
  {
    id: "mf-1",
    name: "cancellation-requests",
    badge: "create memory file",
    content:
      "When a customer requests cancellation, first check their subscription status and billing cycle. If within the first 14 days, offer a full refund. If past 14 days, offer a prorated refund for the remaining period. Always attempt to understand the reason for cancellation and offer relevant alternatives before processing.",
  },
  {
    id: "mf-2",
    name: "refund-requests",
    badge: "create memory file",
    content:
      "For refund requests, verify the purchase date and eligibility. Auto-approve refunds under $500 for purchases within 30 days. For amounts over $500, escalate to human approval. Always check for previous refund history to detect potential abuse patterns.",
  },
];

export const testCases: TestCase[] = [
  {
    id: "tc-1",
    name: "Eligible For Refund",
    passed: true,
    details:
      'Test scenario: Customer purchased Pro plan 5 days ago for $29/month, requesting full refund.\nExpected: Auto-approve refund of $29.\nResult: Agent correctly identified eligibility within 14-day window, processed $29 refund via Stripe, and sent confirmation email.\nVerdict: PASS',
  },
  {
    id: "tc-2",
    name: "Not Eligible For Refund",
    passed: true,
    details:
      'Test scenario: Customer purchased Pro plan 45 days ago for $29/month, requesting full refund.\nExpected: Deny full refund, offer prorated amount.\nResult: Agent correctly identified that the 14-day window has passed, calculated prorated refund of $14.03, and offered it as an alternative.\nVerdict: PASS',
  },
];

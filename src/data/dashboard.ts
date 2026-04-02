export const dashboardMetrics = {
  autoResolved: { value: 812, total: 1048, changePercent: 4.2 },
  avgResolutionTime: { minutes: 3.8, changePercent: -12 },
  escalationRate: { percent: 8.4, changePercent: -1.8 },
  csat: { score: 4.6, changePercent: 2.1 },
};

export const issueCategories = [
  { name: "Billing & Payments", count: 284, percentOfTotal: 27, topRisk: "medium" as const },
  { name: "Account Access", count: 198, percentOfTotal: 19, topRisk: "high" as const },
  { name: "Bug Reports", count: 172, percentOfTotal: 16, topRisk: "high" as const },
  { name: "Subscription Changes", count: 156, percentOfTotal: 15, topRisk: "low" as const },
  { name: "Feature Requests", count: 134, percentOfTotal: 13, topRisk: "low" as const },
  { name: "Onboarding Help", count: 104, percentOfTotal: 10, topRisk: "low" as const },
];

export const agentPerformance = [
  { name: "Billing Agent", resolved: 268, escalated: 16, avgConfidence: 92 },
  { name: "Access Agent", resolved: 178, escalated: 20, avgConfidence: 88 },
  { name: "Technical Agent", resolved: 152, escalated: 20, avgConfidence: 84 },
  { name: "General Agent", resolved: 214, escalated: 12, avgConfidence: 90 },
];

// 7-day ticket volume trend
export const ticketVolumeTrend = [
  { day: "Mon", total: 128, resolved: 104 },
  { day: "Tue", total: 145, resolved: 121 },
  { day: "Wed", total: 132, resolved: 112 },
  { day: "Thu", total: 158, resolved: 138 },
  { day: "Fri", total: 172, resolved: 148 },
  { day: "Sat", total: 86, resolved: 74 },
  { day: "Sun", total: 64, resolved: 58 },
];

// Resolution breakdown
export const resolutionBreakdown = {
  aiResolved: 812,
  humanResolved: 148,
  escalated: 88,
};

// Hourly ticket distribution (24h)
export const hourlyDistribution = [
  0, 2, 1, 1, 0, 3, 8, 14, 22, 18, 16, 14,
  12, 15, 17, 19, 16, 12, 8, 6, 4, 3, 2, 1,
];

export const recentActivity = [
  { id: "evt-1", ticketId: "TK-4201", description: "Auto-resolved billing inquiry", timestamp: "2 min ago", status: "resolved" as const },
  { id: "evt-2", ticketId: "TK-4200", description: "Escalated — low confidence on SSO issue", timestamp: "8 min ago", status: "escalated" as const },
  { id: "evt-3", ticketId: "TK-4199", description: "Refund processed ($42.00)", timestamp: "12 min ago", status: "resolved" as const },
  { id: "evt-4", ticketId: "TK-4198", description: "Feature request logged — export to CSV", timestamp: "18 min ago", status: "resolved" as const },
  { id: "evt-5", ticketId: "TK-4197", description: "Password reset completed", timestamp: "24 min ago", status: "resolved" as const },
  { id: "evt-6", ticketId: "TK-4196", description: "Escalated — customer sentiment negative", timestamp: "31 min ago", status: "escalated" as const },
  { id: "evt-7", ticketId: "TK-4195", description: "Subscription downgrade processed", timestamp: "45 min ago", status: "resolved" as const },
];

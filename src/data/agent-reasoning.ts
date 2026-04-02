import type { TicketResolution } from "./types";

export const ticketResolutions: Record<string, TicketResolution> = {
  // Default / billing email change
  default: {
    id: "TK-7842",
    source: "zendesk",
    title: "Support ticket",
    customerMessage:
      "Hi, can you change my billing email to jake@parahelp.com and send me my latest invoice?",
    retrievedContext: [
      { id: "ctx-1", label: "Memory files", status: "matches", statusText: "3 matches", icon: "memory" },
      { id: "ctx-2", label: "Knowledge base", status: "matches", statusText: "2 matches", icon: "knowledge" },
      { id: "ctx-3", label: "Subscription email", status: "retrieved", statusText: "Retrieved", icon: "stripe" },
      { id: "ctx-4", label: "Last invoice", status: "retrieved", statusText: "Retrieved", icon: "stripe" },
      { id: "ctx-5", label: "Request human approval", status: "approved", statusText: "Approved", icon: "approval" },
    ],
    resolutionPlan: [
      { id: "step-1", label: "Search knowledge base", icon: "link", status: "complete" },
      { id: "step-2", label: "Retrieve subscription email", icon: "stripe", status: "complete" },
      { id: "step-3", label: "Retrieve last invoice", icon: "stripe", status: "complete" },
      { id: "step-4", label: "Request human approval", icon: "approval", status: "complete" },
      { id: "step-5", label: "Await human approval", icon: "approval", status: "complete" },
      { id: "step-6", label: "Change subscription email", icon: "stripe", status: "complete" },
      { id: "step-7", label: "Reply to customer", icon: "zendesk", status: "complete" },
    ],
  },

  // Refund request
  "TK-4199": {
    id: "TK-4199",
    source: "zendesk",
    title: "Support ticket",
    customerMessage:
      "I was charged $42 for a renewal I didn't authorize. I cancelled my subscription last month. Please refund this charge immediately.",
    retrievedContext: [
      { id: "ctx-1", label: "Memory files", status: "matches", statusText: "4 matches", icon: "memory" },
      { id: "ctx-2", label: "Cancellation history", status: "retrieved", statusText: "Retrieved", icon: "stripe" },
      { id: "ctx-3", label: "Payment record", status: "retrieved", statusText: "Retrieved", icon: "stripe" },
      { id: "ctx-4", label: "Refund policy", status: "matches", statusText: "1 match", icon: "knowledge" },
    ],
    resolutionPlan: [
      { id: "step-1", label: "Search knowledge base", icon: "link", status: "complete" },
      { id: "step-2", label: "Verify cancellation date", icon: "stripe", status: "complete" },
      { id: "step-3", label: "Retrieve payment details", icon: "stripe", status: "complete" },
      { id: "step-4", label: "Calculate refund amount", icon: "link", status: "complete" },
      { id: "step-5", label: "Process refund ($42.00)", icon: "stripe", status: "complete" },
      { id: "step-6", label: "Reply to customer", icon: "zendesk", status: "complete" },
    ],
  },

  // SSO login failure — requires approval
  "TK-4200": {
    id: "TK-4200",
    source: "zendesk",
    title: "Support ticket",
    customerMessage:
      "I can't log in with SSO anymore. It was working fine yesterday but now I get a 403 Forbidden error. I've tried clearing cookies and using incognito. Our team of 15 people is locked out.",
    retrievedContext: [
      { id: "ctx-1", label: "Memory files", status: "matches", statusText: "2 matches", icon: "memory" },
      { id: "ctx-2", label: "Knowledge base", status: "matches", statusText: "3 matches", icon: "knowledge" },
      { id: "ctx-3", label: "SSO configuration", status: "retrieved", statusText: "Retrieved", icon: "stripe" },
      { id: "ctx-4", label: "Service status", status: "retrieved", statusText: "No outages", icon: "knowledge" },
    ],
    resolutionPlan: [
      { id: "step-1", label: "Search knowledge base", icon: "link", status: "complete" },
      { id: "step-2", label: "Check SSO configuration", icon: "stripe", status: "complete" },
      { id: "step-3", label: "Check service status", icon: "link", status: "complete" },
      { id: "step-4", label: "Request human approval", icon: "approval", status: "approval-gate" },
      { id: "step-5", label: "Reset SSO credentials", icon: "stripe", status: "pending" },
      { id: "step-6", label: "Notify affected users", icon: "zendesk", status: "pending" },
      { id: "step-7", label: "Reply to customer", icon: "zendesk", status: "pending" },
    ],
  },

  // Auto-resolved billing inquiry
  "TK-4201": {
    id: "TK-4201",
    source: "zendesk",
    title: "Support ticket",
    customerMessage:
      "When does my current billing cycle end? I want to know before I upgrade to the Enterprise plan.",
    retrievedContext: [
      { id: "ctx-1", label: "Memory files", status: "matches", statusText: "1 match", icon: "memory" },
      { id: "ctx-2", label: "Subscription details", status: "retrieved", statusText: "Retrieved", icon: "stripe" },
      { id: "ctx-3", label: "Pricing page", status: "matches", statusText: "1 match", icon: "knowledge" },
    ],
    resolutionPlan: [
      { id: "step-1", label: "Search knowledge base", icon: "link", status: "complete" },
      { id: "step-2", label: "Retrieve billing cycle", icon: "stripe", status: "complete" },
      { id: "step-3", label: "Retrieve upgrade options", icon: "stripe", status: "complete" },
      { id: "step-4", label: "Reply to customer", icon: "zendesk", status: "complete" },
    ],
  },

  // Password reset
  "TK-4197": {
    id: "TK-4197",
    source: "zendesk",
    title: "Support ticket",
    customerMessage:
      "I forgot my password and the reset email isn't arriving. I've checked spam. Can you manually send me a reset link?",
    retrievedContext: [
      { id: "ctx-1", label: "Memory files", status: "matches", statusText: "2 matches", icon: "memory" },
      { id: "ctx-2", label: "Knowledge base", status: "matches", statusText: "1 match", icon: "knowledge" },
      { id: "ctx-3", label: "Account email status", status: "retrieved", statusText: "Retrieved", icon: "stripe" },
    ],
    resolutionPlan: [
      { id: "step-1", label: "Verify account email", icon: "stripe", status: "complete" },
      { id: "step-2", label: "Check email delivery logs", icon: "link", status: "complete" },
      { id: "step-3", label: "Trigger password reset", icon: "stripe", status: "complete" },
      { id: "step-4", label: "Reply to customer", icon: "zendesk", status: "complete" },
    ],
  },

  // Feature request — export
  "TK-4198": {
    id: "TK-4198",
    source: "zendesk",
    title: "Support ticket",
    customerMessage:
      "Is there a way to export our support analytics data to CSV? We need this for our quarterly board report. If not, can you add this as a feature request?",
    retrievedContext: [
      { id: "ctx-1", label: "Memory files", status: "matches", statusText: "1 match", icon: "memory" },
      { id: "ctx-2", label: "Knowledge base", status: "matches", statusText: "2 matches", icon: "knowledge" },
    ],
    resolutionPlan: [
      { id: "step-1", label: "Search knowledge base", icon: "link", status: "complete" },
      { id: "step-2", label: "Check feature availability", icon: "link", status: "complete" },
      { id: "step-3", label: "Log feature request", icon: "link", status: "complete" },
      { id: "step-4", label: "Reply to customer", icon: "zendesk", status: "complete" },
    ],
  },

  // Subscription downgrade
  "TK-4195": {
    id: "TK-4195",
    source: "zendesk",
    title: "Support ticket",
    customerMessage:
      "We'd like to downgrade from Enterprise to Pro plan. Can you tell me what features we'd lose and process the change at the end of this billing cycle?",
    retrievedContext: [
      { id: "ctx-1", label: "Memory files", status: "matches", statusText: "3 matches", icon: "memory" },
      { id: "ctx-2", label: "Knowledge base", status: "matches", statusText: "2 matches", icon: "knowledge" },
      { id: "ctx-3", label: "Current subscription", status: "retrieved", statusText: "Retrieved", icon: "stripe" },
      { id: "ctx-4", label: "Request human approval", status: "approved", statusText: "Approved", icon: "approval" },
    ],
    resolutionPlan: [
      { id: "step-1", label: "Search knowledge base", icon: "link", status: "complete" },
      { id: "step-2", label: "Compare plan features", icon: "link", status: "complete" },
      { id: "step-3", label: "Retrieve current subscription", icon: "stripe", status: "complete" },
      { id: "step-4", label: "Request human approval", icon: "approval", status: "complete" },
      { id: "step-5", label: "Schedule downgrade", icon: "stripe", status: "complete" },
      { id: "step-6", label: "Reply to customer", icon: "zendesk", status: "complete" },
    ],
  },

  // Negative sentiment escalation
  "TK-4196": {
    id: "TK-4196",
    source: "zendesk",
    title: "Support ticket",
    customerMessage:
      "This is absolutely unacceptable. I've been trying to get help for 3 days and nobody has responded. Your service is terrible and I want to speak to a manager immediately. I'm cancelling if this isn't resolved TODAY.",
    retrievedContext: [
      { id: "ctx-1", label: "Memory files", status: "matches", statusText: "2 matches", icon: "memory" },
      { id: "ctx-2", label: "Ticket history", status: "retrieved", statusText: "3 prior tickets", icon: "knowledge" },
      { id: "ctx-3", label: "Sentiment analysis", status: "retrieved", statusText: "Negative", icon: "knowledge" },
    ],
    resolutionPlan: [
      { id: "step-1", label: "Analyze sentiment", icon: "link", status: "complete" },
      { id: "step-2", label: "Review ticket history", icon: "link", status: "complete" },
      { id: "step-3", label: "Escalate to human agent", icon: "approval", status: "complete" },
    ],
  },
};

// Keep backward compat
export const ticketResolution = ticketResolutions["default"];

/* ——— Chat / Assistant types ——— */

export interface ChatConversation {
  id: string;
  title: string;
  lastMessageAt: string;
  visibility: "private" | "public";
  messages: ChatMessage[];
  pendingApprovals: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  author: string;
  avatarInitials?: string;
  timestamp: string;
  content: string;
  toolCalls?: ToolCall[];
  actions?: ActionBlock[];
}

export interface ToolCall {
  id: string;
  label: string;
  target?: string;
  resultSummary?: string;
  icon: "file" | "search" | "code" | "memory";
  expandable?: boolean;
}

export interface ActionBlock {
  id: string;
  type: "update_memory_file" | "create_memory_file";
  fileName: string;
  diffSummary: string;
  diff: DiffLine[];
}

export interface DiffLine {
  lineNumber: number;
  content: string;
  type: "unchanged" | "added" | "removed";
}

/* ——— Ticket Resolution / Agent Reasoning types ——— */

export type ContextItemStatus = "matches" | "retrieved" | "approved" | "pending" | "loading";

export interface RetrievedContextItem {
  id: string;
  label: string;
  status: ContextItemStatus;
  statusText: string;
  icon: "memory" | "knowledge" | "stripe" | "zendesk" | "approval";
}

export type PlanStepStatus = "pending" | "loading" | "complete" | "error" | "approval-gate";

export interface ResolutionPlanStep {
  id: string;
  label: string;
  icon: "link" | "stripe" | "zendesk" | "approval" | "wait";
  status: PlanStepStatus;
}

export interface TicketResolution {
  id: string;
  source: "zendesk";
  title: string;
  customerMessage: string;
  retrievedContext: RetrievedContextItem[];
  resolutionPlan: ResolutionPlanStep[];
}

/* ——— Agent Testing types ——— */

export interface MemoryFile {
  id: string;
  name: string;
  badge: string;
  content?: string;
}

export interface TestCase {
  id: string;
  name: string;
  passed: boolean;
  details?: string;
}

/* ——— Navigation types ——— */

export interface RecentChat {
  id: string;
  title: string;
  timeAgo: string;
}

/* ——— Agent controls types (kept from previous) ——— */

export interface AgentControls {
  autoResolutionThreshold: number;
  refundApprovalLimit: number;
  aggressiveness: number;
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface ImpactPreview {
  autoResolutionRate: number;
  escalationRate: number;
  avgResolutionTime: number;
}

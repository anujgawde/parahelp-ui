import { ChatConversation } from "./types";

export const conversations: ChatConversation[] = [
  {
    id: "chat-1",
    title: "Check service status",
    lastMessageAt: "16 hours ago",
    visibility: "private",
    pendingApprovals: 1,
    messages: [
      {
        id: "msg-1",
        role: "user",
        author: "Replit Admin",
        avatarInitials: "RA",
        timestamp: "16 hours ago",
        content:
          "I just configured a check service page status tool. When customers mention issues with our platform, the agent should use this tool to check for any known service issues.",
      },
      {
        id: "msg-2",
        role: "agent",
        author: "Parahelp",
        timestamp: "16 hours ago",
        content: "Gathering context on the current configuration.",
        toolCalls: [
          {
            id: "tc-1",
            label: "Read base file",
            target: "tools.md",
            icon: "file",
          },
          {
            id: "tc-2",
            label: "Searched memory files",
            resultSummary: "10 results",
            icon: "search",
            expandable: true,
          },
          {
            id: "tc-3",
            label: "Read memory file",
            target: "technical-troubleshooting.md",
            icon: "file",
          },
          {
            id: "tc-4",
            label: "Read support tool code",
            icon: "code",
          },
        ],
        actions: [
          {
            id: "action-1",
            type: "update_memory_file",
            fileName: "technical-troubleshooting.md",
            diffSummary: "+1 lines",
            diff: [
              {
                lineNumber: 2,
                content:
                  'You can help with product and feature troubleshooting inquiries. This includes questions like "why isn\'t the domain verified?", "agent not working", "it says error", "Error caused by either Replit AI, Replit Agent, Replit Assistant", or any other problem related to or caused by Replit.',
                type: "unchanged",
              },
              {
                lineNumber: 3,
                content:
                  "Before starting any troubleshooting, you should ALWAYS use the search_helpcenter tool to find relevant information to answer the user. You can also use possibly relevant guidelines and team snippets to help you answer the user if they are relevant.",
                type: "unchanged",
              },
              {
                lineNumber: 4,
                content:
                  '**Check for Service Issues:** When users report issues that could be related to platform-wide problems (e.g., "Replit is down", "nothing is working", "can\'t access my projects", deployment failures, workspace loading issues, or any error that seems widespread), use the `check_service_status` tool to check for any known service issues or outages. If there is an active incident, inform the user about it and let them know the team is working on a fix.',
                type: "added",
              },
            ],
          },
        ],
      },
      {
        id: "msg-3",
        role: "agent",
        author: "Parahelp",
        timestamp: "16 hours ago",
        content:
          "I've added the instruction for using the check service status tool to the technical troubleshooting memory file. The agent will now automatically check for service issues when users report platform-wide problems.\n\nWould you like me to run test simulations to verify this works correctly?",
      },
    ],
  },
  {
    id: "chat-2",
    title: "Analyze bug patterns",
    lastMessageAt: "30 min. ago",
    visibility: "private",
    pendingApprovals: 0,
    messages: [
      {
        id: "msg-4",
        role: "user",
        author: "Replit Admin",
        avatarInitials: "RA",
        timestamp: "30 min. ago",
        content:
          "Analyze all tickets related to bug reports from the past 7 days and identify patterns \u2014 specifically bug reports mentioned in over 5 tickets.",
      },
      {
        id: "msg-5",
        role: "agent",
        author: "Parahelp",
        timestamp: "30 min. ago",
        content: "Researching historical bug report tickets from the past 7 days.",
        toolCalls: [
          {
            id: "tc-5",
            label: "Searched tickets",
            resultSummary: "47 bug reports",
            icon: "search",
            expandable: true,
          },
          {
            id: "tc-6",
            label: "Analyzed ticket patterns",
            resultSummary: "4 patterns found",
            icon: "search",
          },
        ],
      },
      {
        id: "msg-6",
        role: "agent",
        author: "Parahelp",
        timestamp: "28 min. ago",
        content:
          "I identified **4 distinct bug patterns** from 47 bug report tickets in the past 7 days:\n\n**1. Workspace loading failures** \u2014 12 tickets\nUsers report workspaces hanging at \"Loading...\" indefinitely. Primarily affects Pro plan users.\n\n**2. Deployment timeout errors** \u2014 9 tickets\nDeployments failing with timeout after 120s. Correlated with Node.js 20 projects.\n\n**3. Git push permission denied** \u2014 7 tickets\nUsers receiving 403 errors when pushing to connected GitHub repos. Started after the OAuth update.\n\n**4. AI Assistant context loss** \u2014 6 tickets\nThe AI assistant forgets context mid-conversation. Users report needing to re-explain their project.\n\nWould you like me to dive deeper into any specific pattern?",
      },
    ],
  },
];

export const activeConversationId = "chat-1";

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  PlusIcon,
  ScheduleIcon,
  MessageIcon,
  ActivityIcon,
  AgentIcon,
  ChevronDownIcon,
} from "../icons";

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Scheduled chats", href: "/scheduled", icon: ScheduleIcon },
  { label: "Chats", href: "/chats", icon: MessageIcon },
  { label: "Activity", href: "/activity", icon: ActivityIcon },
  { label: "Customer agent", href: "/controls", icon: AgentIcon },
] as const;

const RECENT_CHATS = [
  { id: "1", title: "Analyze bug patterns", timeAgo: "30 min. ago" },
  { id: "2", title: "Check service status", timeAgo: "16 hours ago" },
  { id: "3", title: "Update refund policy", timeAgo: "16 hours ago" },
  { id: "4", title: "Configure Stripe tools", timeAgo: "2 days ago" },
  { id: "5", title: "Optimize troubleshooting", timeAgo: "3 days ago" },
  { id: "6", title: "Weekly performance report", timeAgo: "5 days ago" },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [recentExpanded, setRecentExpanded] = useState(true);

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border-default bg-surface-primary">
      {/* Brand */}
      <div className="flex h-14 items-center px-5">
        <Image
          src="/company.png"
          alt="Parahelp"
          width={107}
          height={24}
          className="h-5 w-auto"
          unoptimized
        />
      </div>

      {/* New chat button */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-border-default px-3 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          New chat
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3 pt-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href === "/chats" && pathname.startsWith("/chats"));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors
                ${
                  isActive
                    ? "bg-surface-tertiary text-text-primary"
                    : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                }
              `}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive
                    ? "text-text-primary"
                    : "text-text-tertiary group-hover:text-text-secondary"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Recent chats */}
      <div className="mt-4 flex flex-1 flex-col overflow-hidden px-3">
        <button
          onClick={() => setRecentExpanded(!recentExpanded)}
          className="flex items-center gap-1 px-3 pb-1.5 text-[12px] font-medium text-text-tertiary hover:text-text-secondary transition-colors"
        >
          <ChevronDownIcon
            className={`h-3 w-3 transition-transform ${
              recentExpanded ? "" : "-rotate-90"
            }`}
          />
          Recent chats
        </button>

        {recentExpanded && (
          <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {RECENT_CHATS.map((chat) => (
              <Link
                key={chat.id}
                href="/"
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-[13px] text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
              >
                <span className="truncate">{chat.title}</span>
                <span className="shrink-0 text-[11px] text-text-tertiary">
                  {chat.timeAgo}
                </span>
              </Link>
            ))}
            <button className="px-3 py-1.5 text-left text-[13px] text-text-tertiary hover:text-text-secondary transition-colors">
              ... All chats
            </button>
          </div>
        )}
      </div>

      {/* User footer */}
      <div className="border-t border-border-default px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-tertiary shrink-0">
            <span className="text-[11px] font-semibold text-text-secondary">
              RA
            </span>
          </div>
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-[13px] font-medium leading-tight text-text-primary truncate">
              Replit Admin
            </span>
            <span className="text-[11px] text-text-tertiary">Admin</span>
          </div>
          <ChevronDownIcon className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
        </div>
      </div>
    </aside>
  );
}

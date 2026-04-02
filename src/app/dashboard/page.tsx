"use client";

import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { AppShell } from "@/components/layout";
import { Panel, SectionHeader } from "@/components/ui";
import {
  dashboardMetrics,
  issueCategories,
  recentActivity,
  agentPerformance,
  ticketVolumeTrend,
  resolutionBreakdown,
  hourlyDistribution,
} from "@/data/dashboard";

const CHART_COLORS = {
  green: "#22C55E",
  greenSoft: "#DCFCE7",
  blue: "#3B82F6",
  blueSoft: "#DBEAFE",
  orange: "#F97316",
  orangeSoft: "#FED7AA",
  gray: "#A8A5A1",
  graySoft: "#F0EFED",
  accent: "#f2692f",
  grid: "rgba(0,0,0,0.06)",
  text: "#6b6862",
  textLight: "#a8a5a1",
};

const CustomTooltipStyle: React.CSSProperties = {
  backgroundColor: "#1c1b18",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  color: "#fdfcfc",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 100,
};

export default function DashboardPage() {
  const { autoResolved, avgResolutionTime, escalationRate, csat } =
    dashboardMetrics;

  const pieData = [
    {
      name: "AI Resolved",
      value: resolutionBreakdown.aiResolved,
      color: CHART_COLORS.green,
    },
    {
      name: "Human Resolved",
      value: resolutionBreakdown.humanResolved,
      color: CHART_COLORS.blue,
    },
    {
      name: "Escalated",
      value: resolutionBreakdown.escalated,
      color: CHART_COLORS.orange,
    },
  ];

  const hourlyData = hourlyDistribution.map((val, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    tickets: val,
  }));

  const totalTickets =
    resolutionBreakdown.aiResolved +
    resolutionBreakdown.humanResolved +
    resolutionBreakdown.escalated;
  const aiPercent = Math.round(
    (resolutionBreakdown.aiResolved / totalTickets) * 100,
  );

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center border-b border-border-default px-4 md:px-6">
          <h1 className="text-sm font-semibold text-text-primary">Dashboard</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <MetricCard
                label="Auto-Resolved"
                value={`${autoResolved.value} / ${autoResolved.total}`}
                change={autoResolved.changePercent}
              />
              <MetricCard
                label="Avg Resolution Time"
                value={`${avgResolutionTime.minutes}m`}
                change={avgResolutionTime.changePercent}
                invertGood
              />
              <MetricCard
                label="Escalation Rate"
                value={`${escalationRate.percent}%`}
                change={escalationRate.changePercent}
                invertGood
              />
              <MetricCard
                label="CSAT"
                value={`${csat.score} / 5`}
                change={csat.changePercent}
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-4 items-stretch lg:grid-cols-3">
              {/* Ticket volume trend */}
              <div className="lg:col-span-2 flex flex-col">
                <SectionHeader
                  title="Ticket Volume"
                  action={
                    <span className="text-[11px] text-text-tertiary">
                      Last 7 days
                    </span>
                  }
                />
                <Panel className="mt-3 flex-1">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={ticketVolumeTrend}>
                      <defs>
                        <linearGradient
                          id="totalGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.gray}
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.gray}
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="resolvedGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.green}
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.green}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={CHART_COLORS.grid}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: CHART_COLORS.textLight }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: CHART_COLORS.textLight }}
                        width={36}
                      />
                      <Tooltip
                        contentStyle={CustomTooltipStyle}
                        cursor={{ stroke: CHART_COLORS.grid }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke={CHART_COLORS.gray}
                        strokeWidth={2}
                        fill="url(#totalGrad)"
                        name="Total"
                        dot={{ r: 3, fill: CHART_COLORS.gray, strokeWidth: 0 }}
                        activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stroke={CHART_COLORS.green}
                        strokeWidth={2}
                        fill="url(#resolvedGrad)"
                        name="Resolved"
                        dot={{ r: 3, fill: CHART_COLORS.green, strokeWidth: 0 }}
                        activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: 11,
                          color: CHART_COLORS.text,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Resolution breakdown donut */}
              <div className="relative z-10 flex flex-col">
                <SectionHeader title="Resolution Breakdown" />
                <Panel className="mt-3 flex-1 flex flex-col justify-center">
                  <div className="flex flex-col items-center">
                    <div className="relative overflow-visible">
                      <ResponsiveContainer width={180} height={180} style={{ overflow: "visible" }}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                          >
                            {pieData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={CustomTooltipStyle}
                            wrapperStyle={{ zIndex: 100 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[22px] font-semibold text-text-primary leading-none">
                          {aiPercent}%
                        </span>
                        <span className="text-[11px] text-text-tertiary mt-0.5">
                          AI resolved
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2">
                      {pieData.map((seg) => (
                        <div
                          key={seg.name}
                          className="flex items-center gap-1.5"
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: seg.color }}
                          />
                          <span className="text-[11px] text-text-tertiary">
                            {seg.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              </div>
            </div>

            {/* Hourly distribution + categories */}
            <div className="grid grid-cols-1 gap-4 items-stretch lg:grid-cols-5">
              {/* Hourly distribution */}
              <div className="lg:col-span-2 flex flex-col">
                <SectionHeader
                  title="Hourly Distribution"
                  action={
                    <span className="text-[11px] text-text-tertiary">
                      Today
                    </span>
                  }
                />
                <Panel className="mt-3 flex-1">
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={CHART_COLORS.grid}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: CHART_COLORS.textLight }}
                        interval={3}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: CHART_COLORS.textLight }}
                        width={28}
                      />
                      <Tooltip
                        contentStyle={CustomTooltipStyle}
                        cursor={{ fill: "rgba(0,0,0,0.03)" }}
                      />
                      <Bar
                        dataKey="tickets"
                        name="Tickets"
                        radius={[3, 3, 0, 0]}
                        fill={CHART_COLORS.accent}
                        fillOpacity={0.8}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              {/* Top issue categories */}
              <div className="lg:col-span-3 flex flex-col">
                <SectionHeader
                  title="Top Issue Categories"
                  action={
                    <span className="text-[11px] text-text-tertiary">
                      Last 7 days
                    </span>
                  }
                />
                <Panel flush className="mt-3 flex-1">
                  <div className="flex items-center gap-3 border-b border-border-default px-5 py-2.5">
                    <span className="flex-1 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                      Category
                    </span>
                    <span className="w-12 text-right text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                      Count
                    </span>
                    <span className="w-20 text-right text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                      Share
                    </span>
                    <span className="w-20 text-right text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                      Top Risk
                    </span>
                  </div>
                  {issueCategories.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center gap-3 border-b border-border-default px-5 py-2.5 last:border-b-0"
                    >
                      <span className="flex-1 text-[13px] text-text-primary">
                        {cat.name}
                      </span>
                      <span className="w-12 text-right font-mono text-[12px] text-text-secondary">
                        {cat.count}
                      </span>
                      <div className="flex w-20 items-center justify-end gap-2">
                        <div className="h-1 w-10 overflow-hidden rounded-full bg-surface-tertiary">
                          <div
                            className="h-full rounded-full bg-text-tertiary"
                            style={{ width: `${cat.percentOfTotal}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-text-tertiary">
                          {cat.percentOfTotal}%
                        </span>
                      </div>
                      <div className="flex w-20 justify-end">
                        <RiskPill level={cat.topRisk} />
                      </div>
                    </div>
                  ))}
                </Panel>
              </div>
            </div>

            {/* Agent performance */}
            <div>
              <SectionHeader title="Agent Performance" />
              <Panel className="mt-3 space-y-0 p-0">
                {agentPerformance.map((agent) => {
                  const total = agent.resolved + agent.escalated;
                  const resolveRate = Math.round(
                    (agent.resolved / total) * 100,
                  );
                  return (
                    <div
                      key={agent.name}
                      className="flex items-center gap-6 border-b border-border-default px-5 py-3 last:border-b-0"
                    >
                      <span className="w-36 text-[13px] font-medium text-text-primary">
                        {agent.name}
                      </span>
                      <div className="flex flex-1 items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-tertiary">
                          <div
                            className="h-full rounded-full bg-badge-green transition-all"
                            style={{ width: `${resolveRate}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-[12px] text-text-secondary">
                          {resolveRate}%
                        </span>
                      </div>
                      <span className="text-[11px] text-text-tertiary">
                        {agent.resolved} resolved
                      </span>
                      <span className="text-[11px] text-text-tertiary">
                        {agent.escalated} esc.
                      </span>
                      <span className="rounded-full bg-badge-green-soft px-2 py-0.5 text-[11px] font-medium text-badge-green">
                        {agent.avgConfidence}%
                      </span>
                    </div>
                  );
                })}
              </Panel>
            </div>

            {/* Recent activity */}
            <div>
              <SectionHeader title="Recent Chats" />
              <Panel flush className="mt-3">
                {recentActivity.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/chats/${evt.ticketId}`}
                    className="flex items-center gap-3 border-b border-border-default px-5 py-3 last:border-b-0 transition-colors hover:bg-surface-tertiary/40"
                  >
                    <span className="w-20 shrink-0 font-mono text-[12px] text-text-secondary">
                      {evt.ticketId}
                    </span>
                    <span className="flex-1 text-[13px] text-text-primary">
                      {evt.description}
                    </span>
                    <StatusDot status={evt.status} />
                    <span className="shrink-0 text-[11px] text-text-tertiary">
                      {evt.timestamp}
                    </span>
                  </Link>
                ))}
              </Panel>
            </div>

            {/* Performance summary */}
            <div>
              <SectionHeader title="Performance Summary" />
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Panel>
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                    Volume
                  </p>
                  <LabelValue label="Tickets today" value="142" />
                  <LabelValue label="AI-handled" value="118 (83%)" />
                  <LabelValue label="Human-handled" value="24 (17%)" />
                </Panel>
                <Panel>
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                    Speed
                  </p>
                  <LabelValue label="Median first reply" value="12s" />
                  <LabelValue label="Median resolution" value="3.2m" />
                  <LabelValue label="P95 resolution" value="14.8m" />
                </Panel>
                <Panel>
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                    Quality
                  </p>
                  <LabelValue label="Confidence > 90%" value="68%" />
                  <LabelValue label="Escalation trigger" value="< 40%" />
                  <LabelValue
                    label="Active agents"
                    value={
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-badge-green" />
                        4 online
                      </span>
                    }
                  />
                </Panel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ——— Helper components ——— */

function MetricCard({
  label,
  value,
  change,
  invertGood = false,
}: {
  label: string;
  value: string;
  change: number;
  invertGood?: boolean;
}) {
  const isGood = invertGood ? change < 0 : change > 0;
  const arrow = change > 0 ? "\u2191" : "\u2193";
  const changeText =
    Math.abs(change) < 0.1
      ? "No change"
      : `${arrow} ${Math.abs(change)}% vs last 7d`;
  const changeColor = isGood ? "text-badge-green" : "text-risk-high";

  return (
    <Panel>
      <p className="text-[12px] text-text-tertiary">{label}</p>
      <p className="mt-1 text-[22px] font-semibold text-text-primary leading-tight">
        {value}
      </p>
      <p className={`mt-1 text-[11px] ${changeColor}`}>{changeText}</p>
    </Panel>
  );
}

function RiskPill({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: "bg-badge-green-soft text-badge-green",
    medium: "bg-badge-orange-soft text-badge-orange",
    high: "bg-risk-high-soft text-risk-high",
    critical: "bg-risk-critical-soft text-risk-critical",
  };
  const labels: Record<string, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        styles[level] ?? styles.low
      }`}
    >
      {labels[level] ?? level}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    resolved: "bg-badge-green",
    escalated: "bg-risk-high",
    open: "bg-badge-blue",
    active: "bg-badge-orange",
  };
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${
        colors[status] ?? colors.resolved
      }`}
    />
  );
}

function LabelValue({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className="text-[13px] font-medium text-text-primary">{value}</span>
    </div>
  );
}

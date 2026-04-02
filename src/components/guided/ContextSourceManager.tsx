"use client";

import { useState } from "react";
import type { ContextSource } from "./types";

interface ContextSourceManagerProps {
  sources: ContextSource[];
  onChange: (sources: ContextSource[]) => void;
  editable: boolean;
  highlighted: boolean;
}

const TYPE_ICONS: Record<ContextSource["type"], { bg: string; text: string }> = {
  "knowledge-base": { bg: "bg-badge-blue-soft", text: "text-badge-blue" },
  "external-system": { bg: "bg-badge-purple-soft", text: "text-badge-purple" },
  "internal-policy": { bg: "bg-badge-green-soft", text: "text-badge-green" },
};

export function ContextSourceManager({
  sources,
  onChange,
  editable,
  highlighted,
}: ContextSourceManagerProps) {
  const [showAvailable, setShowAvailable] = useState(false);

  const included = sources.filter((s) => s.included);
  const available = sources.filter((s) => !s.included);

  function removeSource(id: string) {
    onChange(
      sources.map((s) => (s.id === id ? { ...s, included: false } : s)),
    );
  }

  function addSource(id: string) {
    onChange(
      sources.map((s) => (s.id === id ? { ...s, included: true } : s)),
    );
    if (available.length <= 1) setShowAvailable(false);
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 ${
        highlighted
          ? "border-accent/30 bg-surface-primary shadow-md shadow-accent/5"
          : "border-border-default bg-surface-secondary"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-text-tertiary"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="8" r="6" />
            <line x1="8" y1="5" x2="8" y2="8" />
            <line x1="8" y1="10.5" x2="8" y2="11" />
          </svg>
          <h4 className="text-[13px] font-semibold text-text-primary">
            Retrieved context
          </h4>
          <span className="text-[11px] text-text-tertiary">
            {included.length} source{included.length !== 1 ? "s" : ""}
          </span>
        </div>
        {editable && available.length > 0 && (
          <button
            onClick={() => setShowAvailable(!showAvailable)}
            className="flex items-center gap-1 text-[11px] font-medium text-accent transition-colors hover:text-accent-hover"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="8" y1="3" x2="8" y2="13" />
              <line x1="3" y1="8" x2="13" y2="8" />
            </svg>
            Add source
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {included.map((source) => {
          const style = TYPE_ICONS[source.type];
          return (
            <div
              key={source.id}
              className="group flex items-center gap-2.5 rounded-lg border border-border-default bg-surface-primary px-3 py-2 transition-all"
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${style.bg}`}
              >
                <svg
                  className={`h-3 w-3 ${style.text}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.5 1.5H4a1 1 0 00-1 1v11a1 1 0 001 1h8a1 1 0 001-1V4.5L9.5 1.5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[12px] font-medium text-text-primary">
                  {source.title}
                </span>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}
              >
                {source.tag}
              </span>
              {editable && (
                <button
                  onClick={() => removeSource(source.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove source"
                >
                  <svg
                    className="h-3.5 w-3.5 text-text-tertiary hover:text-risk-high transition-colors"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <line x1="4" y1="4" x2="12" y2="12" />
                    <line x1="12" y1="4" x2="4" y2="12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Available sources dropdown */}
      {showAvailable && editable && available.length > 0 && (
        <div className="mt-2 rounded-lg border border-dashed border-accent/30 bg-accent-soft/30 p-2 animate-fade-in">
          <p className="text-[11px] text-text-tertiary mb-1.5 px-1">
            Available sources
          </p>
          {available.map((source) => {
            const style = TYPE_ICONS[source.type];
            return (
              <button
                key={source.id}
                onClick={() => addSource(source.id)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-primary"
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${style.bg}`}
                >
                  <svg
                    className={`h-2.5 w-2.5 ${style.text}`}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="8" y1="3" x2="8" y2="13" />
                    <line x1="3" y1="8" x2="13" y2="8" />
                  </svg>
                </div>
                <span className="text-[12px] text-text-secondary">
                  {source.title}
                </span>
                <span
                  className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${style.bg} ${style.text}`}
                >
                  {source.tag}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

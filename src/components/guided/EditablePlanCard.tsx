"use client";

import { useState, useRef, useEffect } from "react";
import type { EditablePlanStep } from "./types";

interface EditablePlanCardProps {
  steps: EditablePlanStep[];
  onChange: (steps: EditablePlanStep[]) => void;
  editable: boolean;
  highlighted: boolean;
}

export function EditablePlanCard({
  steps,
  onChange,
  editable,
  highlighted,
}: EditablePlanCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  function updateStep(id: string, updates: Partial<EditablePlanStep>) {
    onChange(steps.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }

  function removeStep(id: string) {
    onChange(steps.filter((s) => s.id !== id));
  }

  function moveStep(id: string, direction: -1 | 1) {
    const idx = steps.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= steps.length) return;
    const next = [...steps];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    onChange(next);
  }

  function addStep() {
    const newStep: EditablePlanStep = {
      id: `p-new-${Date.now()}`,
      text: "",
      enabled: true,
      isOriginal: false,
    };
    onChange([...steps.slice(0, -1), newStep, ...steps.slice(-1)]);
    // Auto-focus the new step
    setTimeout(() => setEditingId(newStep.id), 50);
  }

  const enabledCount = steps.filter((s) => s.enabled).length;

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 ${
        highlighted
          ? "border-accent/30 bg-surface-primary shadow-lg shadow-accent/5 ring-1 ring-accent/10"
          : "border-border-default bg-surface-secondary"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
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
            <rect x="3" y="2" width="10" height="12" rx="1" />
            <line x1="6" y1="5" x2="10" y2="5" />
            <line x1="6" y1="8" x2="10" y2="8" />
            <line x1="6" y1="11" x2="8" y2="11" />
          </svg>
          <h4 className="text-[13px] font-semibold text-text-primary">
            Resolution plan
          </h4>
          <span className="text-[11px] text-text-tertiary">
            {enabledCount} step{enabledCount !== 1 ? "s" : ""} active
          </span>
        </div>
      </div>

      {editable && (
        <p className="text-[12px] text-accent mb-3">
          The agent proposes a plan. You can refine it before execution.
        </p>
      )}

      {/* Steps */}
      <div className="flex flex-col gap-1">
        {steps.map((step, index) => (
          <PlanStepRow
            key={step.id}
            step={step}
            index={index}
            totalSteps={steps.length}
            editable={editable}
            isEditing={editingId === step.id}
            onStartEdit={() => setEditingId(step.id)}
            onStopEdit={() => setEditingId(null)}
            onUpdate={(updates) => updateStep(step.id, updates)}
            onRemove={() => removeStep(step.id)}
            onMove={(dir) => moveStep(step.id, dir)}
          />
        ))}
      </div>

      {/* Add step button */}
      {editable && (
        <button
          onClick={addStep}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong py-2 text-[12px] font-medium text-text-tertiary transition-all hover:border-accent/40 hover:bg-accent-soft/30 hover:text-accent"
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
          Add step
        </button>
      )}
    </div>
  );
}

/* ——— Step Row ——— */

function PlanStepRow({
  step,
  index,
  totalSteps,
  editable,
  isEditing,
  onStartEdit,
  onStopEdit,
  onUpdate,
  onRemove,
  onMove,
}: {
  step: EditablePlanStep;
  index: number;
  totalSteps: number;
  editable: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onUpdate: (updates: Partial<EditablePlanStep>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div
      className={`group flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
        !step.enabled
          ? "border-transparent bg-surface-tertiary/50 opacity-50"
          : isEditing
            ? "border-accent/30 bg-surface-primary shadow-sm"
            : "border-border-default bg-surface-primary hover:border-border-strong"
      } ${!step.isOriginal && step.enabled ? "border-l-2 border-l-accent" : ""}`}
    >
      {/* Toggle */}
      {editable && (
        <button
          onClick={() => onUpdate({ enabled: !step.enabled })}
          className={`flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors ${
            step.enabled ? "bg-badge-green" : "bg-surface-tertiary"
          }`}
          role="switch"
          aria-checked={step.enabled}
        >
          <div
            className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
              step.enabled ? "translate-x-3" : "translate-x-0"
            }`}
          />
        </button>
      )}

      {/* Step number */}
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold ${
          step.enabled
            ? "bg-surface-tertiary text-text-secondary"
            : "bg-surface-tertiary/50 text-text-tertiary"
        }`}
      >
        {index + 1}
      </span>

      {/* Text / Input */}
      {editable && isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={step.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          onBlur={onStopEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onStopEdit();
            if (e.key === "Escape") onStopEdit();
          }}
          className="flex-1 bg-transparent text-[13px] text-text-primary outline-none"
          placeholder="Describe this step..."
        />
      ) : (
        <span
          onClick={editable ? onStartEdit : undefined}
          className={`flex-1 text-[13px] ${
            step.enabled ? "text-text-primary" : "text-text-tertiary line-through"
          } ${editable ? "cursor-text" : ""}`}
        >
          {step.text || (
            <span className="italic text-text-tertiary">Click to edit...</span>
          )}
        </span>
      )}

      {/* Badge for new steps */}
      {!step.isOriginal && step.enabled && (
        <span className="shrink-0 rounded-full bg-accent-soft px-1.5 py-0.5 text-[9px] font-semibold text-accent">
          NEW
        </span>
      )}

      {/* Reorder & delete controls */}
      {editable && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="flex h-5 w-5 items-center justify-center rounded text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary disabled:opacity-30 transition-colors"
            title="Move up"
          >
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="4,10 8,6 12,10" />
            </svg>
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === totalSteps - 1}
            className="flex h-5 w-5 items-center justify-center rounded text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary disabled:opacity-30 transition-colors"
            title="Move down"
          >
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="4,6 8,10 12,6" />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="flex h-5 w-5 items-center justify-center rounded text-text-tertiary hover:bg-risk-high-soft hover:text-risk-high transition-colors"
            title="Remove step"
          >
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

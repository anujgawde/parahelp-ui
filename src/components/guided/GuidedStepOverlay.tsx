"use client";

import { GUIDED_STEPS } from "./types";

interface GuidedStepOverlayProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  showDashboardButton?: boolean;
  onGoToDashboard?: () => void;
  executeReady?: boolean;
  onExecute?: () => void;
  executing?: boolean;
}

export function GuidedStepOverlay({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onExit,
  showDashboardButton,
  onGoToDashboard,
  executeReady,
  onExecute,
  executing,
}: GuidedStepOverlayProps) {
  const step = GUIDED_STEPS[currentStep];
  if (!step) return null;

  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  return (
    <div className="shrink-0 border-t border-border-default bg-surface-primary px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        {/* Progress dots */}
        <div className="flex gap-1.5 shrink-0">
          {GUIDED_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                i <= currentStep ? "bg-accent" : "bg-surface-tertiary"
              }`}
            />
          ))}
        </div>

        {/* Step info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-medium text-accent shrink-0">
              {currentStep + 1}/{totalSteps}
            </span>
            <span className="text-[13px] font-semibold text-text-primary truncate">
              {step.title}
            </span>
            <span className="text-[12px] text-text-tertiary truncate hidden sm:block">
              {step.description}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Tour complete → Go to dashboard */}
          {showDashboardButton && (
            <button
              onClick={onGoToDashboard}
              className="flex h-8 items-center rounded-md bg-accent px-4 text-[12px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Go back to dashboard
            </button>
          )}

          {/* Step 7 (execute) → Execute button */}
          {!showDashboardButton && isLast && executeReady && (
            <button
              onClick={onExecute}
              className="flex h-8 items-center gap-2 rounded-md bg-accent px-4 text-[12px] font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Execute
            </button>
          )}

          {/* Step 7 executing */}
          {!showDashboardButton && isLast && executing && (
            <button
              disabled
              className="flex h-8 items-center gap-2 rounded-md bg-surface-tertiary px-4 text-[12px] font-medium text-text-tertiary cursor-not-allowed"
            >
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M8 2a6 6 0 0 1 6 6" />
              </svg>
              Executing...
            </button>
          )}

          {/* Normal navigation (not last step, not completed) */}
          {!showDashboardButton && !isLast && (
            <>
              <button
                onClick={onExit}
                className="text-[12px] text-text-tertiary transition-colors hover:text-text-secondary mr-2"
              >
                Exit
              </button>
              {!isFirst && (
                <button
                  onClick={onPrev}
                  className="flex h-7 items-center rounded-md border border-border-default px-2.5 text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
                >
                  Back
                </button>
              )}
              <button
                onClick={onNext}
                className="flex h-7 items-center rounded-md bg-accent px-3 text-[12px] font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Next
              </button>
            </>
          )}

          {/* Last step but no selection yet and not executed */}
          {!showDashboardButton && isLast && !executeReady && !executing && (
            <>
              <button
                onClick={onExit}
                className="text-[12px] text-text-tertiary transition-colors hover:text-text-secondary mr-2"
              >
                Exit
              </button>
              <button
                onClick={onPrev}
                className="flex h-7 items-center rounded-md border border-border-default px-2.5 text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-secondary"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

/* ——— Tour step definition ——— */

export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  buttonHint: string;
  advance: "click" | "next";
  page: string;
  /** Action ID this step relates to (for skip-if-done logic) */
  actionId?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    target: "tour-greeting",
    title: "Agent summary",
    description:
      "Your internal agent summarizes what it did and what needs your attention.",
    buttonHint: "",
    advance: "next",
    page: "/dashboard",
  },
  {
    id: "stats",
    target: "tour-stats",
    title: "Key metrics",
    description:
      "Configs changed, tests passed, deployments, and gaps found; all at a glance.",
    buttonHint: "",
    advance: "next",
    page: "/dashboard",
  },
  {
    id: "action-publish",
    target: "tour-action-publish",
    title: "Publish a config",
    description:
      "This config is ready for production. Hover over the card and click the button below.",
    buttonHint: "Approve & publish",
    advance: "click",
    page: "/dashboard",
    actionId: "a-1",
  },
  {
    id: "action-hitl",
    target: "tour-action-hitl",
    title: "Human-in-the-loop review",
    description:
      "This ticket needs operator review before the agent can execute. Hover and click the button below.",
    buttonHint: "Review & refine plan",
    advance: "click",
    page: "/dashboard",
    actionId: "a-2",
  },
];

/* ——— Persistent state ——— */

function loadTourStep(): number {
  if (typeof window === "undefined") return 0;
  const v = localStorage.getItem("parahelp-tour-step");
  return v ? parseInt(v, 10) : 0;
}

function saveTourStep(step: number) {
  localStorage.setItem("parahelp-tour-step", String(step));
}

function isTourCompleted(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("parahelp-tour-completed") === "true";
}

function isActionDone(actionId: string): boolean {
  try {
    const actions = JSON.parse(
      localStorage.getItem("parahelp-dashboard-actions") || "{}",
    );
    return !!actions[actionId];
  } catch {
    return false;
  }
}

/** Find the next valid step index (skipping completed actions) */
function findNextValidStep(fromIndex: number): number | null {
  for (let i = fromIndex; i < TOUR_STEPS.length; i++) {
    const step = TOUR_STEPS[i];
    if (step.actionId && isActionDone(step.actionId)) continue;
    return i;
  }
  return null; // all done
}

/* ——— Context ——— */

interface TourCtx {
  active: boolean;
  currentStep: number;
  step: TourStep | null;
  next: () => void;
  exit: () => void;
  start: () => void;
  advanceFromClick: () => void;
}

const TourContext = createContext<TourCtx>({
  active: false,
  currentStep: 0,
  step: null,
  next: () => {},
  exit: () => {},
  start: () => {},
  advanceFromClick: () => {},
});

export function useTour() {
  return useContext(TourContext);
}

/* ——— Provider ——— */

export function TourProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Initialize from localStorage, skipping any completed steps
  useEffect(() => {
    if (isTourCompleted()) {
      setInitialized(true);
      return;
    }
    const saved = loadTourStep();
    const valid = findNextValidStep(saved);
    if (valid === null) {
      localStorage.setItem("parahelp-tour-completed", "true");
      setInitialized(true);
      return;
    }
    setCurrentStep(valid);
    saveTourStep(valid);
    setInitialized(true);
  }, []);

  // Activate/deactivate based on current page
  useEffect(() => {
    if (!initialized || isTourCompleted()) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    if (pathname === step.page) {
      const t = setTimeout(() => setActive(true), 500);
      return () => clearTimeout(t);
    } else {
      setActive(false);
    }
  }, [pathname, currentStep, initialized]);

  const step = active ? (TOUR_STEPS[currentStep] ?? null) : null;

  // Use a ref so setTimeout always calls the latest version
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  const goToStep = useCallback((idx: number) => {
    const valid = findNextValidStep(idx);
    if (valid === null) {
      setActive(false);
      localStorage.setItem("parahelp-tour-completed", "true");
      localStorage.removeItem("parahelp-tour-step");
      return;
    }
    setCurrentStep(valid);
    saveTourStep(valid);
  }, []);

  const next = useCallback(() => {
    goToStep(currentStepRef.current + 1);
  }, [goToStep]);

  const advanceFromClick = useCallback(() => {
    next();
  }, [next]);

  const exit = useCallback(() => {
    setActive(false);
    localStorage.setItem("parahelp-tour-completed", "true");
    localStorage.removeItem("parahelp-tour-step");
  }, []);

  const start = useCallback(() => {
    localStorage.removeItem("parahelp-tour-completed");
    localStorage.removeItem("parahelp-tour-step");
    localStorage.removeItem("parahelp-dashboard-actions");
    setCurrentStep(0);
    saveTourStep(0);
    setActive(true);
  }, []);

  return (
    <TourContext.Provider
      value={{ active, currentStep, step, next, exit, start, advanceFromClick }}
    >
      {children}
      {active && step && (
        <TourOverlay
          step={step}
          currentStep={currentStep}
          totalSteps={TOUR_STEPS.length}
          onNext={next}
          onExit={exit}
        />
      )}
    </TourContext.Provider>
  );
}

/* ——— Overlay ——— */

function TourOverlay({
  step,
  currentStep,
  totalSteps,
  onNext,
  onExit,
}: {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onExit: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const rafRef = useRef<number>(0);
  const scrolledRef = useRef(false);

  // Auto-scroll target into view with room for tooltip below
  useEffect(() => {
    scrolledRef.current = false;
  }, [step.target]);

  useEffect(() => {
    function update() {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        setRect(el.getBoundingClientRect());

        // Auto-scroll on first detection so element + tooltip are visible
        if (!scrolledRef.current) {
          scrolledRef.current = true;
          const elRect = el.getBoundingClientRect();
          // Need room for element + tooltip (~220px below element)
          const neededBottom = elRect.bottom + 220;
          if (neededBottom > window.innerHeight || elRect.top < 0) {
            const scrollContainer = el.closest(".overflow-y-auto");
            if (scrollContainer) {
              const containerRect = scrollContainer.getBoundingClientRect();
              const scrollBy = elRect.top - containerRect.top - 80; // 80px from top
              scrollContainer.scrollBy({
                top: scrollBy,
                behavior: "smooth",
              });
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(update);
    }
    const t = setTimeout(update, 50);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
    };
  }, [step.target]);

  if (!rect) return null;

  const pad = 8;
  const spotX = rect.left - pad;
  const spotY = rect.top - pad;
  const spotW = rect.width + pad * 2;
  const spotH = rect.height + pad * 2;

  const tooltipStyle: React.CSSProperties = {
    top: rect.bottom + 16,
    left: Math.max(16, rect.left),
    maxWidth: Math.min(360, window.innerWidth - 32),
  };

  const isClick = step.advance === "click";

  return (
    <>
      <div
        className="fixed inset-0 z-1000"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => {
          const scrollContainer = document.querySelector(
            ".overflow-y-auto",
          ) as HTMLElement | null;
          if (scrollContainer) {
            scrollContainer.scrollBy({
              top: e.deltaY,
              left: e.deltaX,
            });
          }
        }}
      >
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={spotX}
                y={spotY}
                width={spotW}
                height={spotH}
                rx="10"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.45)"
            mask="url(#tour-mask)"
          />
        </svg>
      </div>

      <div className="fixed z-1003 animate-guide-in" style={tooltipStyle}>
        <div className="w-80 rounded-xl border border-border-default bg-surface-primary shadow-xl shadow-black/10 p-4">
          <div className="flex gap-1 mb-3">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? "bg-text-primary" : "bg-surface-tertiary"
                }`}
              />
            ))}
          </div>

          <p className="text-[11px] font-medium text-text-tertiary mb-1">
            Step {currentStep + 1} of {totalSteps}
          </p>
          <h3 className="text-[14px] font-semibold text-text-primary mb-1">
            {step.title}
          </h3>
          <p className="text-[12px] text-text-secondary leading-relaxed mb-3">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={onExit}
              className="text-[12px] text-text-tertiary hover:text-text-secondary transition-colors"
            >
              Skip tour
            </button>
            {!isClick && (
              <button
                onClick={onNext}
                className="rounded-md bg-surface-inverse px-3.5 py-1.5 text-[12px] font-medium text-text-inverse transition-colors hover:bg-surface-inverse/90"
              >
                {currentStep === totalSteps - 1 ? "Finish" : "Next"}
              </button>
            )}
            {isClick && step.buttonHint && (
              <span className="rounded-md bg-surface-tertiary px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                Click &ldquo;{step.buttonHint}&rdquo;
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        [data-tour="${step.target}"] {
          position: relative;
          z-index: 1002 !important;
        }
      `}</style>
    </>
  );
}

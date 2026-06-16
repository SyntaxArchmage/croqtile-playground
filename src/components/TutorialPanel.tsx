"use client";

import { useState, useEffect } from "react";
import { TUTORIALS, type Tutorial, type TutorialStep } from "@/lib/tutorials";
import { getTutorialProgress, markTutorialStep } from "@/lib/progress";
import { renderTutorialContent } from "@/lib/renderTutorialContent";
import { ListSearchInput, matchesTitleSearch } from "@/components/ListSearchInput";

function clampStepIndex(index: number, stepCount: number): number {
  if (stepCount <= 0) return 0;
  return Math.max(0, Math.min(index, stepCount - 1));
}

function stepCode(steps: Tutorial["steps"], index: number): string {
  if (steps.length === 0) return "";
  const step = steps[clampStepIndex(index, steps.length)];
  return step?.code ?? steps[0]?.code ?? "";
}

function isTutorialComplete(tutorial: Tutorial): boolean {
  return tutorial.steps.length > 0 && getTutorialProgress(tutorial.id) >= tutorial.steps.length - 1;
}

function getNextTutorial(currentId: string): Tutorial | null {
  const index = TUTORIALS.findIndex((t) => t.id === currentId);
  if (index < 0 || index >= TUTORIALS.length - 1) return null;
  return TUTORIALS[index + 1];
}

function updateUrlParam(key: string, value: string | null, step?: number) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  if (step !== undefined && step > 0) {
    url.searchParams.set("step", String(step + 1));
  } else {
    url.searchParams.delete("step");
  }
  url.searchParams.delete("challenge");
  window.history.replaceState(null, "", url.toString());
}

interface Props {
  onLoadCode: (code: string) => void;
  onClose: () => void;
  initialId?: string;
}

export function TutorialPanel({ onLoadCode, onClose, initialId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(() => {
    if (initialId) {
      return TUTORIALS.find((t) => t.id === initialId) ?? null;
    }
    return null;
  });
  const [stepIndex, setStepIndex] = useState(() => {
    if (initialId) {
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const stepParam = params?.get("step");
      if (stepParam) {
        const parsed = parseInt(stepParam, 10);
        const tut = TUTORIALS.find((t) => t.id === initialId);
        if (!isNaN(parsed) && tut) {
          return clampStepIndex(parsed - 1, tut.steps.length);
        }
      }
    }
    return 0;
  });

  useEffect(() => {
    if (initialId && selectedTutorial) {
      onLoadCode(stepCode(selectedTutorial.steps, stepIndex));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only deep link init

  if (!selectedTutorial) {
    const filteredTutorials = TUTORIALS.filter((t) =>
      matchesTitleSearch(t.title, searchQuery),
    );

    return (
      <div className="h-full flex flex-col" role="region" aria-label="Tutorials">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">Tutorials</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
            aria-label="Close tutorials panel"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {(() => {
            const completed = TUTORIALS.filter((t) => isTutorialComplete(t)).length;
            const pct = TUTORIALS.length ? Math.round((completed / TUTORIALS.length) * 100) : 0;
            return (
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <div className="flex-1 h-1.5 rounded bg-[var(--bg-surface)]">
                  <div
                    className="h-full rounded bg-[var(--accent)] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span data-testid="tutorial-progress-summary">
                  {completed}/{TUTORIALS.length} done
                </span>
              </div>
            );
          })()}
          {TUTORIALS.length > 0 && TUTORIALS.every((t) => isTutorialComplete(t)) && (
            <div className="text-xs text-[var(--success)] bg-[var(--success)]/10 border border-[var(--success)]/30 rounded px-3 py-2" role="status">
              All tutorials completed!
            </div>
          )}
          <ListSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            ariaLabel="Search tutorials"
          />
          {filteredTutorials.length === 0 ? (
            <div className="text-xs text-[var(--text-muted)] text-center py-4">
              No tutorials match
            </div>
          ) : (
            filteredTutorials.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedTutorial(t);
                const resumeStep = clampStepIndex(getTutorialProgress(t.id) + 1, t.steps.length);
                setStepIndex(resumeStep);
                onLoadCode(stepCode(t.steps, resumeStep));
                if (t.steps.length > 0) {
                  markTutorialStep(t.id, resumeStep);
                  updateUrlParam("tutorial", t.id, resumeStep);
                } else {
                  updateUrlParam("tutorial", t.id);
                }
              }}
              aria-label={`${t.title}: ${t.description}`}
              className="w-full text-left p-3 rounded border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-surface)] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">{t.title}</span>
                {isTutorialComplete(t) ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900 text-green-300 border border-green-800">done</span>
                ) : t.steps.length > 0 && getTutorialProgress(t.id) >= 0 ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800">in progress</span>
                ) : null}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{t.description}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {t.steps.length === 0
                  ? "No steps"
                  : `${Math.min(getTutorialProgress(t.id) + 1, t.steps.length)}/${t.steps.length} steps`}
              </div>
            </button>
            ))
          )}
        </div>
      </div>
    );
  }

  const totalSteps = selectedTutorial.steps.length;
  const progress = getTutorialProgress(selectedTutorial.id);

  if (totalSteps === 0) {
    return (
      <div className="h-full flex flex-col" role="region" aria-label={`Tutorial: ${selectedTutorial.title}`}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <button
            type="button"
            onClick={() => { setSelectedTutorial(null); updateUrlParam("tutorial", null); }}
            className="text-xs text-[var(--accent)] hover:underline"
            aria-label="Back to tutorials list"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
            aria-label="Close tutorials panel"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">
            {selectedTutorial.title}
          </h2>
          <p className="text-sm text-[var(--text-muted)]" data-testid="no-steps-message">
            This tutorial has no steps yet.
          </p>
        </div>
      </div>
    );
  }

  const isLastStep = stepIndex === totalSteps - 1;
  const nextTutorial = getNextTutorial(selectedTutorial.id);

  const beginTutorial = (tutorial: Tutorial) => {
    setSearchQuery("");
    setSelectedTutorial(tutorial);
    const resumeStep = clampStepIndex(getTutorialProgress(tutorial.id) + 1, tutorial.steps.length);
    setStepIndex(resumeStep);
    onLoadCode(stepCode(tutorial.steps, resumeStep));
    if (tutorial.steps.length > 0) {
      markTutorialStep(tutorial.id, resumeStep);
      updateUrlParam("tutorial", tutorial.id, resumeStep);
    } else {
      updateUrlParam("tutorial", tutorial.id);
    }
  };

  const step = selectedTutorial.steps[stepIndex];
  if (!step) {
    return (
      <div className="h-full flex flex-col" role="region" aria-label={`Tutorial: ${selectedTutorial.title}`}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <button
            type="button"
            onClick={() => { setSelectedTutorial(null); updateUrlParam("tutorial", null); }}
            className="text-xs text-[var(--accent)] hover:underline"
            aria-label="Back to tutorials list"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
            aria-label="Close tutorials panel"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <p className="text-sm text-[var(--text-muted)]" data-testid="missing-step-message">
            Step {stepIndex + 1} is missing or invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" role="region" aria-label={`Tutorial: ${selectedTutorial.title}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          type="button"
          onClick={() => { setSelectedTutorial(null); updateUrlParam("tutorial", null); }}
          className="text-xs text-[var(--accent)] hover:underline"
          aria-label="Back to tutorials list"
        >
          ← Back
        </button>
        <span className="text-xs text-[var(--text-muted)]" aria-label={`Step ${stepIndex + 1} of ${totalSteps}`}>
          {stepIndex + 1} / {totalSteps}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
          aria-label="Close tutorials panel"
        >
          ×
        </button>
      </div>

      <div
        className="h-1 bg-[var(--bg-surface)]"
        role="progressbar"
        aria-valuenow={stepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Tutorial progress"
      >
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-xs text-[var(--text-muted)] mb-3"
          data-testid="tutorial-breadcrumb"
        >
          <button
            type="button"
            onClick={() => {
              setSelectedTutorial(null);
              updateUrlParam("tutorial", null);
            }}
            className="text-[var(--accent)] hover:underline"
          >
            Tutorials
          </button>
          <span aria-hidden="true">&gt;</span>
          <button
            type="button"
            onClick={() => {
              setStepIndex(0);
              onLoadCode(stepCode(selectedTutorial.steps, 0));
              markTutorialStep(selectedTutorial.id, 0);
              updateUrlParam("tutorial", selectedTutorial.id, 0);
            }}
            className="text-[var(--accent)] hover:underline"
          >
            {selectedTutorial.title}
          </button>
          <span aria-hidden="true">&gt;</span>
          <span className="text-[var(--text-primary)]">
            Step {stepIndex + 1}: {step.title}
          </span>
        </nav>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">
          {step.title}
        </h2>
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {step.content?.trim()
            ? renderTutorialContent(step.content, onLoadCode)
            : (
              <p className="text-[var(--text-muted)]" data-testid="empty-step-content">
                No content for this step.
              </p>
            )}
        </div>
        {isLastStep && (
          <div
            className="mt-6 p-3 rounded border border-green-800 bg-green-950/30"
            data-testid="tutorial-completion-message"
          >
            <p className="text-sm text-green-300">
              Tutorial complete! You&apos;ve learned about {selectedTutorial.title}.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          type="button"
          onClick={() => {
            const prev = Math.max(0, stepIndex - 1);
            setStepIndex(prev);
            onLoadCode(stepCode(selectedTutorial.steps, prev));
            markTutorialStep(selectedTutorial.id, prev);
            updateUrlParam("tutorial", selectedTutorial.id, prev);
          }}
          disabled={stepIndex === 0}
          className="px-3 py-1 text-xs rounded border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--bg-surface)]"
          aria-label="Previous step"
        >
          ← Prev
        </button>
        <div className="flex gap-1 items-center" role="group" aria-label="Tutorial steps">
          {selectedTutorial.steps.map((_, i) => {
            const visited = i <= progress;
            const isCurrent = i === stepIndex;
            return (
              <button
                key={i}
                type="button"
                data-testid="tutorial-step-dot"
                aria-label={`Step ${i + 1}`}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => {
                  setStepIndex(i);
                  onLoadCode(stepCode(selectedTutorial.steps, i));
                  markTutorialStep(selectedTutorial.id, i);
                  updateUrlParam("tutorial", selectedTutorial.id, i);
                }}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors hover:bg-[var(--accent)] ${
                  visited ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                }${isCurrent ? " ring-1 ring-[var(--accent)]" : ""}`}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => onLoadCode(stepCode(selectedTutorial.steps, stepIndex))}
          className="px-3 py-1 text-xs rounded bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90"
          aria-label="Load step code into editor"
        >
          Load Code
        </button>
        <div className="flex-1" />
        {isLastStep ? (
          nextTutorial ? (
            <button
              type="button"
              onClick={() => beginTutorial(nextTutorial)}
              className="px-3 py-1 text-xs rounded bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90"
              aria-label={`Next tutorial: ${nextTutorial.title}`}
              data-testid="next-tutorial-button"
            >
              Next Tutorial →
            </button>
          ) : (
            <span
              className="text-[10px] text-green-400 font-medium"
              data-testid="all-tutorials-completed"
            >
              All tutorials completed
            </span>
          )
        ) : (
          <button
            type="button"
            onClick={() => {
              const next = Math.min(totalSteps - 1, stepIndex + 1);
              setStepIndex(next);
              onLoadCode(stepCode(selectedTutorial.steps, next));
              markTutorialStep(selectedTutorial.id, next);
              updateUrlParam("tutorial", selectedTutorial.id, next);
            }}
            className="px-3 py-1 text-xs rounded border border-[var(--border)] hover:bg-[var(--bg-surface)]"
            aria-label="Next step"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

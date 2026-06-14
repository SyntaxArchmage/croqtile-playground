"use client";

import { useState } from "react";
import { TUTORIALS, type Tutorial, type TutorialStep } from "@/lib/tutorials";
import { getTutorialProgress, markTutorialStep } from "@/lib/progress";

interface Props {
  onLoadCode: (code: string) => void;
  onClose: () => void;
}

export function TutorialPanel({ onLoadCode, onClose }: Props) {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  if (!selectedTutorial) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">Tutorials</span>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {TUTORIALS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTutorial(t);
                const resumeStep = Math.min(getTutorialProgress(t.id) + 1, t.steps.length - 1);
                setStepIndex(resumeStep);
                onLoadCode(t.steps[resumeStep].code);
                markTutorialStep(t.id, resumeStep);
              }}
              className="w-full text-left p-3 rounded border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-surface)] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-primary)]">{t.title}</span>
                {getTutorialProgress(t.id) >= t.steps.length - 1 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900 text-green-300 border border-green-800">done</span>
                )}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{t.description}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {Math.min(getTutorialProgress(t.id) + 1, t.steps.length)}/{t.steps.length} steps
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const step: TutorialStep = selectedTutorial.steps[stepIndex];
  const totalSteps = selectedTutorial.steps.length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          onClick={() => setSelectedTutorial(null)}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          ← Back
        </button>
        <span className="text-xs text-[var(--text-muted)]">
          {stepIndex + 1} / {totalSteps}
        </span>
        <button
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
        >
          ×
        </button>
      </div>

      <div className="h-1 bg-[var(--bg-surface)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">
          {step.title}
        </h2>
        <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
          {step.content}
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          onClick={() => {
            const prev = Math.max(0, stepIndex - 1);
            setStepIndex(prev);
            onLoadCode(selectedTutorial.steps[prev].code);
            markTutorialStep(selectedTutorial.id, prev);
          }}
          disabled={stepIndex === 0}
          className="px-3 py-1 text-xs rounded border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--bg-surface)]"
        >
          ← Prev
        </button>
        <button
          onClick={() => onLoadCode(step.code)}
          className="px-3 py-1 text-xs rounded bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90"
        >
          Load Code
        </button>
        <div className="flex-1" />
        <button
          onClick={() => {
            const next = Math.min(totalSteps - 1, stepIndex + 1);
            setStepIndex(next);
            onLoadCode(selectedTutorial.steps[next].code);
            markTutorialStep(selectedTutorial.id, next);
          }}
          disabled={stepIndex === totalSteps - 1}
          className="px-3 py-1 text-xs rounded border border-[var(--border)] disabled:opacity-30 hover:bg-[var(--bg-surface)]"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

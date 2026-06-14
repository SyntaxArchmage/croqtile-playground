"use client";

import { useState, useEffect } from "react";
import { CHALLENGES, type Challenge } from "@/lib/challenges";
import { checkTests } from "@/lib/checkTests";
import { isChallengePassed, markChallengePassed } from "@/lib/progress";

interface Props {
  onLoadCode: (code: string) => void;
  onClose: () => void;
  lastOutput: string;
  initialId?: string;
}

export function ChallengePanel({ onLoadCode, onClose, lastOutput, initialId }: Props) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(() => {
    if (initialId) {
      return CHALLENGES.find((c) => c.id === initialId) ?? null;
    }
    return null;
  });
  const [showHint, setShowHint] = useState(false);

  const testResults = selectedChallenge ? checkTests(selectedChallenge, lastOutput) : [];
  const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

  useEffect(() => {
    if (selectedChallenge && allPassed && lastOutput) {
      markChallengePassed(selectedChallenge.id);
    }
  }, [selectedChallenge, allPassed, lastOutput]);

  if (!selectedChallenge) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">Challenges</span>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {CHALLENGES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedChallenge(c);
                setShowHint(false);
                onLoadCode(c.starterCode);
              }}
              className="w-full text-left p-3 rounded border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-surface)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {c.title}
                </span>
                <DifficultyBadge difficulty={c.difficulty} />
                {isChallengePassed(c.id) && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900 text-green-300 border border-green-800">passed</span>
                )}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                {c.tests.length} test{c.tests.length > 1 ? "s" : ""}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          onClick={() => setSelectedChallenge(null)}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          ← Back
        </button>
        <DifficultyBadge difficulty={selectedChallenge.difficulty} />
        <button
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          {selectedChallenge.title}
        </h2>
        <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
          {selectedChallenge.description}
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
            Tests
          </h3>
          {testResults.map((t, i) => (
            <div
              key={i}
              className={`p-2 rounded text-xs border ${
                t.passed
                  ? "border-green-800 bg-green-950/30 text-green-300"
                  : t.ran
                  ? "border-red-800 bg-red-950/30 text-red-300"
                  : "border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
              }`}
            >
              {t.passed ? "✓" : t.ran ? "✗" : "○"} {t.description}
            </div>
          ))}
        </div>

        {allPassed && lastOutput && (
          <div className="p-3 rounded border border-green-600 bg-green-950/30 text-center space-y-2">
            <div className="text-green-300 text-sm font-medium">
              All tests passed!
            </div>
            {(() => {
              const idx = CHALLENGES.indexOf(selectedChallenge);
              const next = idx >= 0 && idx < CHALLENGES.length - 1 ? CHALLENGES[idx + 1] : null;
              return next ? (
                <button
                  onClick={() => {
                    setSelectedChallenge(next);
                    setShowHint(false);
                    onLoadCode(next.starterCode);
                  }}
                  className="px-3 py-1 text-xs rounded bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90"
                >
                  Next: {next.title} →
                </button>
              ) : null;
            })()}
          </div>
        )}

        {selectedChallenge.hint && (
          <div className="mt-4">
            {showHint ? (
              <div className="p-2 rounded border border-[var(--border)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)]">
                💡 {selectedChallenge.hint}
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
              >
                Show hint
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          onClick={() => onLoadCode(selectedChallenge.starterCode)}
          className="px-3 py-1 text-xs rounded border border-[var(--border)] hover:bg-[var(--bg-surface)]"
        >
          Reset Code
        </button>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Challenge["difficulty"] }) {
  const colors = {
    easy: "text-green-400 border-green-800",
    medium: "text-yellow-400 border-yellow-800",
    hard: "text-red-400 border-red-800",
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
}


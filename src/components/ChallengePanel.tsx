"use client";

import { useState, useEffect, useRef } from "react";
import { CHALLENGES, type Challenge } from "@/lib/challenges";
import { checkTests } from "@/lib/checkTests";
import { isChallengePassed, markChallengePassed, getChallengeProgress, recordChallengeAttempt } from "@/lib/progress";

function updateUrlParam(key: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  url.searchParams.delete("tutorial");
  window.history.replaceState(null, "", url.toString());
}

interface Props {
  onLoadCode: (code: string) => void;
  onClose: () => void;
  lastOutput: string;
  getCode?: () => string;
  initialId?: string;
}

type DifficultyFilter = "all" | "easy" | "medium" | "hard";

export function ChallengePanel({ onLoadCode, onClose, lastOutput, getCode, initialId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(() => {
    if (initialId) {
      return CHALLENGES.find((c) => c.id === initialId) ?? null;
    }
    return null;
  });
  const [showHint, setShowHint] = useState(false);

  const testResults = selectedChallenge ? checkTests(selectedChallenge, lastOutput) : [];
  const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

  const prevOutputRef = useRef(lastOutput);
  useEffect(() => {
    if (!selectedChallenge || !lastOutput) return;
    if (lastOutput !== prevOutputRef.current) {
      prevOutputRef.current = lastOutput;
      recordChallengeAttempt(selectedChallenge.id);
      if (allPassed) {
        markChallengePassed(selectedChallenge.id, getCode?.());
      }
    }
  }, [selectedChallenge, allPassed, lastOutput, getCode]);

  useEffect(() => {
    if (initialId && selectedChallenge) {
      onLoadCode(selectedChallenge.starterCode);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only deep link init

  if (!selectedChallenge) {
    const query = searchQuery.trim().toLowerCase();
    const filteredChallenges = CHALLENGES.filter((c) => {
      if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    });

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">Challenges</span>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
            aria-label="Close challenges panel"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          <input
            type="text"
            placeholder="Search challenges..."
            aria-label="Search challenges"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          <div className="flex gap-1">
            {(
              [
                { value: "all", label: "All" },
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDifficultyFilter(value)}
                className={`text-xs px-2 py-0.5 rounded ${
                  difficultyFilter === value
                    ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                    : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {filteredChallenges.length === 0 ? (
            <div className="text-xs text-[var(--text-muted)] text-center py-4">
              No challenges match
            </div>
          ) : (
            filteredChallenges.map((c) => {
            const cp = getChallengeProgress(c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedChallenge(c);
                  setShowHint(false);
                  onLoadCode(c.starterCode);
                  updateUrlParam("challenge", c.id);
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
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
                  <span>{c.tests.length} test{c.tests.length > 1 ? "s" : ""}</span>
                  {cp.attempts > 0 && <span>{cp.attempts} attempt{cp.attempts !== 1 ? "s" : ""}</span>}
                </div>
              </button>
            );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          onClick={() => { setSelectedChallenge(null); updateUrlParam("challenge", null); }}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          ← Back
        </button>
        <DifficultyBadge difficulty={selectedChallenge.difficulty} />
        <button
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
          aria-label="Close challenges panel"
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
              <div>{t.passed ? "✓" : t.ran ? "✗" : "○"} {t.description}</div>
              {t.ran && !t.passed && t.expected && (
                <div className="mt-1.5 pt-1.5 border-t border-red-800/50 space-y-1 font-mono text-[10px]">
                  <div><span className="text-red-400/70">Expected:</span> <span className="text-red-200">{t.expected.length > 80 ? t.expected.slice(0, 80) + "..." : t.expected}</span></div>
                  <div><span className="text-red-400/70">Got:</span> <span className="text-red-200">{t.actual ? (t.actual.length > 80 ? t.actual.slice(0, 80) + "..." : t.actual) : "(no output)"}</span></div>
                </div>
              )}
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
                    updateUrlParam("challenge", next.id);
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
                {selectedChallenge.hint}
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
        {(() => {
          const cp = getChallengeProgress(selectedChallenge.id);
          return cp.bestCode ? (
            <button
              onClick={() => onLoadCode(cp.bestCode!)}
              className="px-3 py-1 text-xs rounded border border-green-800 text-green-400 hover:bg-green-950/30"
            >
              Load Best
            </button>
          ) : null;
        })()}
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Challenge["difficulty"] }) {
  const colors = {
    easy: "text-green-300 border-green-700 bg-green-950/40",
    medium: "text-yellow-200 border-yellow-700 bg-yellow-950/40",
    hard: "text-red-300 border-red-700 bg-red-950/40",
  };
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded border ${colors[difficulty]}`}
      aria-label={`Difficulty: ${difficulty}`}
    >
      {difficulty}
    </span>
  );
}

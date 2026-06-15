"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
type StatusFilter = "all" | "todo" | "passed";

export function ChallengePanel({ onLoadCode, onClose, lastOutput, getCode, initialId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(() => {
    if (initialId) {
      return CHALLENGES.find((c) => c.id === initialId) ?? null;
    }
    return null;
  });
  const [showHint, setShowHint] = useState(false);

  const testResults = useMemo(
    () => selectedChallenge ? checkTests(selectedChallenge, lastOutput) : [],
    [selectedChallenge, lastOutput],
  );
  const allPassed = testResults.length > 0 && testResults.every((r) => r.passed);

  const testContainerRef = useRef<HTMLDivElement>(null);
  const prevOutputRef = useRef(lastOutput);

  useEffect(() => {
    if (!lastOutput || !testContainerRef.current) return;
    const firstFailure = testContainerRef.current.querySelector<HTMLElement>(
      '[data-testid="test-result"].border-red-800'
    );
    if (typeof firstFailure?.scrollIntoView === "function") {
      firstFailure.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [testResults, lastOutput]);

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
      if (statusFilter !== "all") {
        const passed = isChallengePassed(c.id);
        if (statusFilter === "passed" && !passed) return false;
        if (statusFilter === "todo" && passed) return false;
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
          {(() => {
            const passed = CHALLENGES.filter((c) => isChallengePassed(c.id)).length;
            const pct = Math.round((passed / CHALLENGES.length) * 100);
            return (
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <div className="flex-1 h-1.5 rounded bg-[var(--bg-surface)]">
                  <div
                    className="h-full rounded bg-green-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span data-testid="challenge-progress-summary">
                  {passed}/{CHALLENGES.length} passed
                </span>
              </div>
            );
          })()}
          <input
            type="text"
            placeholder="Search challenges..."
            aria-label="Search challenges"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          <div className="flex gap-3 flex-wrap">
            <div className="flex gap-1" role="group" aria-label="Filter by difficulty">
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
                  aria-pressed={difficultyFilter === value}
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
            <div className="flex gap-1" role="group" aria-label="Filter by status">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "todo", label: "To Do" },
                  { value: "passed", label: "Passed" },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  aria-pressed={statusFilter === value}
                  className={`text-xs px-2 py-0.5 rounded ${
                    statusFilter === value
                      ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                      : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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

      <div ref={testContainerRef} className="flex-1 overflow-auto p-4 space-y-4">
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
              data-testid="test-result"
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
          <ChallengeSuccessBanner
            key={lastOutput}
            challengeId={selectedChallenge.id}
            onNext={(next) => {
              setSelectedChallenge(next);
              setShowHint(false);
              onLoadCode(next.starterCode);
              updateUrlParam("challenge", next.id);
            }}
          />
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

const CONFETTI_PIECES = [
  { left: "8%", top: "18%", color: "#a6e3a1", dx: -14, dy: -20, delay: 0, shape: "dot" as const },
  { left: "22%", top: "8%", color: "#89b4fa", dx: -8, dy: -24, delay: 40, shape: "star" as const },
  { left: "78%", top: "12%", color: "#f9e2af", dx: 16, dy: -22, delay: 20, shape: "dot" as const },
  { left: "92%", top: "25%", color: "#cba6f7", dx: 18, dy: -14, delay: 60, shape: "star" as const },
  { left: "15%", top: "72%", color: "#fab387", dx: -16, dy: 12, delay: 30, shape: "dot" as const },
  { left: "88%", top: "68%", color: "#a6e3a1", dx: 14, dy: 16, delay: 50, shape: "star" as const },
];

function ChallengeSuccessBanner({
  challengeId,
  onNext,
}: {
  challengeId: string;
  onNext: (next: Challenge) => void;
}) {
  const attempts = getChallengeProgress(challengeId).attempts;
  const idx = CHALLENGES.findIndex((c) => c.id === challengeId);
  const next = idx >= 0 && idx < CHALLENGES.length - 1 ? CHALLENGES[idx + 1] : null;

  return (
    <div
      className="relative p-3 rounded border border-green-600 bg-green-950/30 text-center space-y-2 overflow-hidden"
      style={{ animation: "challengeSuccessIn 300ms ease-out forwards" }}
    >
      {CONFETTI_PIECES.map((piece, i) => (
        <span
          key={i}
          aria-hidden
          className={`absolute pointer-events-none ${
            piece.shape === "dot" ? "w-1.5 h-1.5 rounded-full" : "text-[10px] leading-none"
          }`}
          style={{
            left: piece.left,
            top: piece.top,
            backgroundColor: piece.shape === "dot" ? piece.color : undefined,
            color: piece.shape === "star" ? piece.color : undefined,
            "--dx": `${piece.dx}px`,
            "--dy": `${piece.dy}px`,
            animation: `challengeConfetti 700ms ease-out ${piece.delay}ms forwards`,
          } as React.CSSProperties}
        >
          {piece.shape === "star" ? "★" : null}
        </span>
      ))}
      <div className="text-green-300 text-sm font-medium relative z-10">
        All tests passed!
      </div>
      <div className="text-green-400/80 text-xs relative z-10">
        Solved in {attempts} attempt{attempts !== 1 ? "s" : ""}
      </div>
      {next ? (
        <button
          onClick={() => onNext(next)}
          className="relative z-10 px-3 py-1 text-xs rounded bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90"
        >
          Next: {next.title} →
        </button>
      ) : null}
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

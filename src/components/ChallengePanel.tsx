"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { CHALLENGES, getChallengeHints, ALL_TAGS, getChallengeTags, type Challenge, type ChallengeTag } from "@/lib/challenges";
import { checkTests } from "@/lib/checkTests";
import { isChallengePassed, markChallengePassed, getChallengeProgress, recordChallengeAttempt } from "@/lib/progress";
import { ListSearchInput, matchesTitleSearch } from "@/components/ListSearchInput";

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
type TagFilter = "all" | ChallengeTag;

const PAGE_SIZE = 20;

export function ChallengePanel({ onLoadCode, onClose, lastOutput, getCode, initialId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tagFilter, setTagFilter] = useState<TagFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(() => {
    if (initialId) {
      return CHALLENGES.find((c) => c.id === initialId) ?? null;
    }
    return null;
  });
  const [revealedHintCount, setRevealedHintCount] = useState(0);
  const [progressRevision, setProgressRevision] = useState(0);

  const testResults = useMemo(
    () => selectedChallenge ? checkTests(selectedChallenge, lastOutput) : [],
    [selectedChallenge, lastOutput],
  );
  const hasTests = (selectedChallenge?.tests.length ?? 0) > 0;
  const allPassed = hasTests && testResults.every((r) => r.passed);

  const testContainerRef = useRef<HTMLDivElement>(null);
  const listHeadingRef = useRef<HTMLSpanElement>(null);
  const detailBackRef = useRef<HTMLButtonElement>(null);
  const prevOutputRef = useRef(lastOutput);
  const prevSelectedIdRef = useRef<string | null>(selectedChallenge?.id ?? null);

  const testAnnouncement = useMemo(() => {
    if (!selectedChallenge || !lastOutput) return "";
    if (allPassed) {
      return `All ${testResults.length} tests passed!`;
    }
    if (testResults.some((r) => r.ran)) {
      const passed = testResults.filter((r) => r.passed).length;
      const failed = testResults.filter((r) => r.ran && !r.passed).length;
      return `${passed} of ${testResults.length} tests passed, ${failed} failed`;
    }
    return "";
  }, [selectedChallenge, lastOutput, testResults, allPassed]);

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
    prevOutputRef.current = lastOutput;
  }, [selectedChallenge?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- reset ref on challenge switch only

  useEffect(() => {
    const currentId = selectedChallenge?.id ?? null;
    if (prevSelectedIdRef.current === currentId) return;
    prevSelectedIdRef.current = currentId;
    if (currentId) {
      detailBackRef.current?.focus();
    } else {
      listHeadingRef.current?.focus();
    }
  }, [selectedChallenge?.id]);

  useEffect(() => {
    if (!selectedChallenge || !lastOutput || !hasTests) return;
    if (lastOutput !== prevOutputRef.current) {
      prevOutputRef.current = lastOutput;
      recordChallengeAttempt(selectedChallenge.id);
      if (allPassed) {
        markChallengePassed(selectedChallenge.id, getCode?.());
      }
      setProgressRevision((n) => n + 1);
    }
  }, [selectedChallenge, allPassed, lastOutput, getCode, hasTests]);

  useEffect(() => {
    if (initialId && selectedChallenge) {
      onLoadCode(selectedChallenge.starterCode);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount-only deep link init

  const difficultyStats = useMemo(() => {
    void progressRevision; // recompute when challenge progress updates
    const stats = {
      all: { total: CHALLENGES.length, passed: 0 },
      easy: { total: 0, passed: 0 },
      medium: { total: 0, passed: 0 },
      hard: { total: 0, passed: 0 },
    };
    for (const c of CHALLENGES) {
      const passed = isChallengePassed(c.id);
      stats[c.difficulty].total++;
      if (passed) {
        stats.all.passed++;
        stats[c.difficulty].passed++;
      }
    }
    return stats;
  }, [progressRevision]);

  const filteredChallenges = useMemo(() => {
    void progressRevision;
    return CHALLENGES.filter((c) => {
      if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) {
        return false;
      }
      if (statusFilter !== "all") {
        const passed = isChallengePassed(c.id);
        if (statusFilter === "passed" && !passed) return false;
        if (statusFilter === "todo" && passed) return false;
      }
      if (tagFilter !== "all") {
        const tags = getChallengeTags(c);
        if (!tags.includes(tagFilter)) return false;
      }
      return matchesTitleSearch(c.title, searchQuery);
    });
  }, [searchQuery, difficultyFilter, statusFilter, tagFilter, progressRevision]);

  const resetPagination = () => setVisibleCount(PAGE_SIZE);

  if (!selectedChallenge) {
    const visibleChallenges = filteredChallenges.slice(0, visibleCount);
    const hasMore = visibleCount < filteredChallenges.length;

    return (
      <div className="h-full flex flex-col" role="region" aria-label="Challenges">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <span
            ref={listHeadingRef}
            tabIndex={-1}
            className="text-sm font-medium text-[var(--text-primary)] outline-none"
          >
            Challenges
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
            aria-label="Close challenges panel"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {(() => {
            const total = CHALLENGES.length;
            const passed = CHALLENGES.filter((c) => isChallengePassed(c.id)).length;
            const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
            return (
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <div
                  className="flex-1 h-1.5 rounded bg-[var(--bg-surface)]"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${passed} of ${total} challenges passed`}
                >
                  <div
                    className="h-full rounded bg-green-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span data-testid="challenge-progress-summary">
                  {passed}/{total} passed
                </span>
              </div>
            );
          })()}
          {CHALLENGES.length > 0 && CHALLENGES.every((c) => isChallengePassed(c.id)) && (
            <div className="text-xs text-[var(--success)] bg-[var(--success)]/10 border border-[var(--success)]/30 rounded px-3 py-2" role="status">
              All challenges completed!
            </div>
          )}
          <ListSearchInput
            value={searchQuery}
            onChange={(q) => {
              setSearchQuery(q);
              resetPagination();
            }}
            ariaLabel="Search challenges"
          />
          <div className="flex gap-3 flex-wrap" data-testid="challenge-filters">
            <div className="flex gap-1" role="group" aria-label="Filter by difficulty">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" },
                ] as const
              ).map(({ value, label }) => {
                const { total, passed } = difficultyStats[value];
                return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setDifficultyFilter(value);
                    resetPagination();
                  }}
                  aria-pressed={difficultyFilter === value}
                  aria-label={`${label}, ${passed} of ${total} passed`}
                  className={`text-xs px-2 py-0.5 rounded tabular-nums ${
                    difficultyFilter === value
                      ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                      : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label} ({passed}/{total})
                </button>
                );
              })}
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
                  type="button"
                  onClick={() => {
                    setStatusFilter(value);
                    resetPagination();
                  }}
                  aria-pressed={statusFilter === value}
                  aria-label={`${label} status`}
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
          <div className="flex gap-1 flex-wrap" role="group" aria-label="Filter by topic">
            <button
              type="button"
              onClick={() => { setTagFilter("all"); resetPagination(); }}
              aria-pressed={tagFilter === "all"}
              className={`text-xs px-2 py-0.5 rounded ${
                tagFilter === "all"
                  ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                  : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              All Topics
            </button>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => { setTagFilter(tag); resetPagination(); }}
                aria-pressed={tagFilter === tag}
                className={`text-xs px-2 py-0.5 rounded ${
                  tagFilter === tag
                    ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                    : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {filteredChallenges.length === 0 ? (
            <div className="text-xs text-[var(--text-muted)] text-center py-4">
              No challenges match
            </div>
          ) : (
            <>
              {visibleChallenges.map((c) => {
                const cp = getChallengeProgress(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedChallenge(c);
                      setRevealedHintCount(0);
                      onLoadCode(c.starterCode);
                      updateUrlParam("challenge", c.id);
                    }}
                    aria-label={`${c.title}, ${c.difficulty} difficulty, ${c.tests.length} test${c.tests.length !== 1 ? "s" : ""}${isChallengePassed(c.id) ? ", passed" : cp.status === "attempted" ? ", in progress" : ""}`}
                    className="w-full text-left p-3 rounded border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-surface)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {c.title}
                      </span>
                      <DifficultyBadge difficulty={c.difficulty} />
                      {isChallengePassed(c.id) ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900 text-green-300 border border-green-800">passed</span>
                      ) : cp.status === "attempted" ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-950/50 text-yellow-300 border border-yellow-800">in progress</span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
                      <span>{c.tests.length} test{c.tests.length !== 1 ? "s" : ""}</span>
                      {cp.attempts > 0 && <span>{cp.attempts} attempt{cp.attempts !== 1 ? "s" : ""}</span>}
                    </div>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {getChallengeTags(c).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] px-1 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  aria-label={`Show more challenges, ${filteredChallenges.length - visibleCount} remaining`}
                  className="w-full py-2 text-xs rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
                  data-testid="show-more-challenges"
                >
                  Show more ({filteredChallenges.length - visibleCount} remaining)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" role="region" aria-label={`Challenge: ${selectedChallenge.title}`}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {testAnnouncement}
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          ref={detailBackRef}
          type="button"
          onClick={() => { setSelectedChallenge(null); updateUrlParam("challenge", null); }}
          className="text-xs text-[var(--accent)] hover:underline"
          aria-label="Back to challenges list"
        >
          ← Back
        </button>
        <DifficultyBadge difficulty={selectedChallenge.difficulty} />
        <button
          type="button"
          onClick={onClose}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg"
          aria-label="Close challenges panel"
        >
          ×
        </button>
      </div>

      <div ref={testContainerRef} className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {selectedChallenge.title}
          </h2>
          {(() => {
            const cp = getChallengeProgress(selectedChallenge.id);
            return cp.attempts > 0 ? (
              <span className="text-xs text-[var(--text-muted)] tabular-nums" data-testid="attempt-count">
                {cp.attempts} {cp.attempts === 1 ? "attempt" : "attempts"}
              </span>
            ) : null;
          })()}
        </div>
        <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
          {selectedChallenge.description}
        </div>

        <div className="space-y-2" role="list" aria-label="Test results">
          <h3 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
            Tests
          </h3>
          {testResults.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]" data-testid="no-tests-message">
              No tests configured for this challenge.
            </p>
          ) : null}
          {testResults.map((t, i) => (
            <div
              key={i}
              role="listitem"
              data-testid="test-result"
              aria-label={`${t.passed ? "Passed" : t.ran ? "Failed" : "Not run"}: ${t.description}`}
              className={`p-2 rounded text-xs border ${
                t.passed
                  ? "border-green-800 bg-green-950/30 text-green-300"
                  : t.ran
                  ? "border-red-800 bg-red-950/30 text-red-300"
                  : "border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
              }`}
            >
              <div><span aria-hidden="true">{t.passed ? "✓" : t.ran ? "✗" : "○"}</span> {t.description}</div>
              {t.ran && !t.passed && (
                <div className="mt-1.5 pt-1.5 border-t border-red-800/50 space-y-1.5 font-mono text-[10px]">
                  <div
                    className="rounded border border-green-800/60 bg-green-950/25 p-1.5"
                    data-testid="test-expected"
                  >
                    <span className="text-green-400/90 font-sans font-medium uppercase tracking-wide text-[9px]">
                      Expected
                    </span>
                    <pre className="text-green-200 whitespace-pre-wrap mt-0.5 max-h-24 overflow-auto">{t.expected}</pre>
                  </div>
                  <div
                    className="rounded border border-red-800/60 bg-red-950/25 p-1.5"
                    data-testid="test-actual"
                  >
                    <span className="text-red-400/90 font-sans font-medium uppercase tracking-wide text-[9px]">
                      Actual
                    </span>
                    <pre className="text-red-200 whitespace-pre-wrap mt-0.5 max-h-24 overflow-auto">{t.actual || "(no output)"}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {allPassed && lastOutput && (
          <ChallengeSuccessBanner
            key={`${lastOutput}-${progressRevision}`}
            challengeId={selectedChallenge.id}
            onNext={(next) => {
              setSelectedChallenge(next);
              setRevealedHintCount(0);
              onLoadCode(next.starterCode);
              updateUrlParam("challenge", next.id);
            }}
          />
        )}

        {(() => {
          const hints = getChallengeHints(selectedChallenge);
          if (hints.length === 0) return null;
          const currentHint = revealedHintCount > 0 ? hints[revealedHintCount - 1] : null;
          const hasMoreHints = revealedHintCount < hints.length;
          return (
            <div className="mt-4" data-testid="hint-section">
              {revealedHintCount === 0 ? (
                <button
                  type="button"
                  onClick={() => setRevealedHintCount(1)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
                  aria-label="Show hint"
                >
                  Show hint
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[10px] text-[var(--text-muted)] tabular-nums"
                      data-testid="hint-counter"
                    >
                      Hint {revealedHintCount} of {hints.length}
                    </span>
                    <span
                      className="text-[10px] text-[var(--text-muted)]/70 tabular-nums"
                      data-testid="hint-usage"
                    >
                      Used {revealedHintCount}/{hints.length} hints
                    </span>
                  </div>
                  <div
                    className="p-2 rounded border border-[var(--border)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)]"
                    data-testid="hint-content"
                    aria-live="polite"
                  >
                    {currentHint}
                  </div>
                  {hasMoreHints && (
                    <button
                      type="button"
                      onClick={() => setRevealedHintCount((n) => n + 1)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
                      aria-label="Show next hint"
                      data-testid="next-hint-button"
                    >
                      Next Hint
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          type="button"
          onClick={() => onLoadCode(selectedChallenge.starterCode)}
          className="px-3 py-1 text-xs rounded border border-[var(--border)] hover:bg-[var(--bg-surface)]"
          aria-label="Reset code to starter template"
        >
          Reset Code
        </button>
        {(() => {
          const cp = getChallengeProgress(selectedChallenge.id);
          return cp.bestCode ? (
            <button
              type="button"
              onClick={() => onLoadCode(cp.bestCode!)}
              className="px-3 py-1 text-xs rounded border border-green-800 text-green-400 hover:bg-green-950/30"
              aria-label="Load best saved solution"
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
      role="status"
      aria-live="polite"
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
          type="button"
          onClick={() => onNext(next)}
          className="relative z-10 px-3 py-1 text-xs rounded bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:opacity-90"
          aria-label={`Next challenge: ${next.title}`}
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

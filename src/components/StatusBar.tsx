"use client";

import { memo, useSyncExternalStore } from "react";
import type { WorkerStatus, BuildManifest } from "@/lib/useChoreoWorker";
import type { CursorPosition, SelectionInfo } from "./Editor";
import type { PanelMode } from "@/lib/types";
import { CHALLENGES } from "@/lib/challenges";
import { TUTORIALS } from "@/lib/tutorials";
import { getTutorialProgress, isChallengePassed, subscribeProgress, getProgressRevision } from "@/lib/progress";

interface Props {
  status: WorkerStatus;
  compilerVersion?: string | null;
  buildManifest?: BuildManifest | null;
  target?: string;
  cursorPosition?: CursorPosition;
  lineCount?: number;
  selection?: SelectionInfo | null;
  elapsedMs?: number | null;
  hasUnsavedChanges?: boolean;
  panelMode?: PanelMode;
  onShowShortcuts?: () => void;
}

function formatElapsedMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

const statusConfig: Record<WorkerStatus, { label: string; color: string }> = {
  loading: { label: "Loading WASM...", color: "text-yellow-500" },
  ready: { label: "Ready", color: "text-[var(--success)]" },
  running: { label: "Running...", color: "text-blue-400" },
  error: { label: "Error", color: "text-[var(--error)]" },
};

export const StatusBar = memo(function StatusBar({ status, compilerVersion, buildManifest, target, cursorPosition, lineCount, selection, elapsedMs, hasUnsavedChanges, panelMode = "closed", onShowShortcuts }: Props) {
  const { label, color } = statusConfig[status];
  const statusLabel = status === "ready" && elapsedMs != null ? `${label} • ${formatElapsedMs(elapsedMs)}` : label;
  const version = compilerVersion ?? buildManifest?.version ?? null;
  const commit = buildManifest?.commit_short ?? null;

  useSyncExternalStore(subscribeProgress, getProgressRevision, () => 0);

  let progressSummary: string | null = null;
  if (panelMode === "challenge") {
    const passed = CHALLENGES.filter((c) => isChallengePassed(c.id)).length;
    progressSummary = `${passed}/${CHALLENGES.length} challenges passed`;
  } else if (panelMode === "tutorial") {
    const completed = TUTORIALS.filter((t) => getTutorialProgress(t.id) >= t.steps.length - 1).length;
    progressSummary = `${completed}/${TUTORIALS.length} tutorials completed`;
  }

  return (
    <div className="flex items-center gap-2 px-2 sm:px-4 py-1 border-t border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] overflow-x-auto whitespace-nowrap shrink-0">
      <span className={`flex items-center gap-1 ${color}`} aria-label={`Compiler status: ${statusLabel}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
        {statusLabel}
      </span>
      {hasUnsavedChanges && (
        <>
          <span className="text-[var(--border)]">|</span>
          <span className="flex items-center gap-1 text-amber-500" aria-label="Unsaved changes">
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            Unsaved
          </span>
        </>
      )}
      <span className="text-[var(--border)]">|</span>
      <span className="hidden sm:inline">
        Croqtile {version ?? "—"}
        {commit && <span className="ml-1 opacity-60">({commit})</span>}
      </span>
      {target && (
        <>
          <span className="hidden sm:inline text-[var(--border)]">|</span>
          <span className="hidden sm:inline">Target: {target}</span>
        </>
      )}
      {cursorPosition && (
        <>
          <span className="hidden md:inline text-[var(--border)]">|</span>
          <span className="hidden md:inline">Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </>
      )}
      {lineCount !== undefined && (
        <>
          <span className="hidden md:inline text-[var(--border)]">|</span>
          <span className="hidden md:inline">{lineCount} lines</span>
        </>
      )}
      {selection && selection.characters > 0 && (
        <>
          <span className="hidden md:inline text-[var(--border)]">|</span>
          <span className="hidden md:inline">
            {selection.lines > 1
              ? `${selection.lines} lines, ${selection.characters} chars selected`
              : `${selection.characters} chars selected`}
          </span>
        </>
      )}
      <div className="flex-1" />
      {progressSummary && (
        <span className="tabular-nums opacity-60 mr-2" aria-label={progressSummary}>
          {progressSummary}
        </span>
      )}
      {onShowShortcuts ? (
        <button
          type="button"
          onClick={onShowShortcuts}
          className="hidden sm:inline text-[var(--text-muted)] opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Show keyboard shortcuts"
        >
          Ctrl+Enter: Run | ?: All Shortcuts
        </button>
      ) : (
        <span className="hidden sm:inline opacity-50">Ctrl+Enter: Run | ?: Help</span>
      )}
    </div>
  );
});

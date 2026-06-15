"use client";

import { memo } from "react";
import type { WorkerStatus, BuildManifest } from "@/lib/useChoreoWorker";
import type { CursorPosition } from "./Editor";

interface Props {
  status: WorkerStatus;
  compilerVersion?: string | null;
  buildManifest?: BuildManifest | null;
  target?: string;
  cursorPosition?: CursorPosition;
  lineCount?: number;
  lastElapsedMs?: number | null;
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

export const StatusBar = memo(function StatusBar({ status, compilerVersion, buildManifest, target, cursorPosition, lineCount, lastElapsedMs }: Props) {
  const { label, color } = statusConfig[status];
  const version = compilerVersion ?? buildManifest?.version ?? null;
  const commit = buildManifest?.commit_short ?? null;

  return (
    <div className="flex items-center gap-2 px-4 py-1 border-t border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)]">
      <span className={`flex items-center gap-1 ${color}`} aria-label={`Compiler status: ${label}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
        {label}
      </span>
      <span className="text-[var(--border)]">|</span>
      <span>
        Croqtile {version ?? "—"}
        {commit && <span className="ml-1 opacity-60">({commit})</span>}
      </span>
      {target && (
        <>
          <span className="text-[var(--border)]">|</span>
          <span>Target: {target}</span>
        </>
      )}
      {cursorPosition && (
        <>
          <span className="text-[var(--border)]">|</span>
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </>
      )}
      {lineCount !== undefined && (
        <>
          <span className="text-[var(--border)]">|</span>
          <span>{lineCount} lines</span>
        </>
      )}
      {lastElapsedMs != null && (
        <>
          <span className="text-[var(--border)]">|</span>
          <span>{formatElapsedMs(lastElapsedMs)}</span>
        </>
      )}
      <div className="flex-1" />
      <span className="hidden sm:inline opacity-50">Ctrl+Enter: Run | Ctrl+Shift+Enter: Compile | Ctrl+S: Share | ?: Help</span>
    </div>
  );
});

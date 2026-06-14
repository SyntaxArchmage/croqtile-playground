"use client";

import { useState, useCallback } from "react";
import type { WorkerStatus } from "@/lib/useChoreoWorker";
import type { PanelMode } from "./Playground";
import { EXAMPLES } from "@/lib/examples";

interface Props {
  target: string;
  onTargetChange: (target: string) => void;
  onRun: () => void;
  onCompile: () => void;
  onDumpAST: () => void;
  onLoadCode: (code: string) => void;
  onShare: () => void;
  onTogglePanel: (mode: PanelMode) => void;
  panelMode: PanelMode;
  status: WorkerStatus;
}

export function Toolbar({
  target,
  onTargetChange,
  onRun,
  onCompile,
  onDumpAST,
  onLoadCode,
  onShare,
  onTogglePanel,
  panelMode,
  status,
}: Props) {
  const busy = status === "running";
  const [copied, setCopied] = useState(false);
  const handleShareClick = useCallback(() => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [onShare]);

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <button
        onClick={() => onTogglePanel("tutorial")}
        className={`p-1.5 rounded transition-colors ${
          panelMode === "tutorial"
            ? "bg-[var(--accent)] text-[var(--bg-primary)]"
            : "hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"
        }`}
        title="Tutorial"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </button>
      <button
        onClick={() => onTogglePanel("challenge")}
        className={`p-1.5 rounded transition-colors ${
          panelMode === "challenge"
            ? "bg-[var(--accent)] text-[var(--bg-primary)]"
            : "hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"
        }`}
        title="Challenge"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      <span className="text-sm font-semibold text-[var(--accent)]">Croqtile</span>
      <span className="text-xs text-[var(--text-muted)]">Playground</span>

      <div className="w-px h-5 bg-[var(--border)] mx-2" />

      <select
        value={target}
        onChange={(e) => onTargetChange(e.target.value)}
        className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
      >
        <option value="cc">cc (C++ CPU)</option>
        <option value="cute">cute (CUDA)</option>
      </select>

      <button
        onClick={onRun}
        disabled={busy}
        className="px-3 py-1 text-xs font-medium rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
        title="Execute with mock interpreter (Ctrl+Enter)"
        aria-label="Run code"
      >
        ▶ Run
      </button>

      <button
        onClick={onCompile}
        disabled={busy}
        className="px-3 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        title="View generated C++/CUDA source code"
      >
        Compile
      </button>

      <button
        onClick={onDumpAST}
        disabled={busy}
        className="px-3 py-1 text-xs font-medium rounded border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border)] text-[var(--text-primary)] disabled:opacity-50"
      >
        AST
      </button>

      <button
        onClick={handleShareClick}
        className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
          copied
            ? "border-green-600 bg-green-900/30 text-green-300"
            : "border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border)] text-[var(--text-primary)]"
        }`}
        title="Copy shareable link"
      >
        {copied ? "Copied!" : "Share"}
      </button>

      <div className="flex-1" />

      <select
        onChange={(e) => {
          const ex = EXAMPLES.find((x) => x.id === e.target.value);
          if (ex) onLoadCode(ex.code);
          e.target.value = "";
        }}
        value=""
        className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
      >
        <option value="" disabled>
          Examples...
        </option>
        {EXAMPLES.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>
    </div>
  );
}

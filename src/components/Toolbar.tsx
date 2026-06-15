"use client";

import { useState, useCallback, useEffect, useRef, memo } from "react";
import type { WorkerStatus } from "@/lib/useChoreoWorker";
import type { PanelMode } from "@/lib/types";
import { EXAMPLES } from "@/lib/examples";
import { resetProgress } from "@/lib/progress";

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

export const Toolbar = memo(function Toolbar({
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
  const [showMenu, setShowMenu] = useState(false);
  const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShareClick = useCallback(() => {
    onShare();
    setCopied(true);
    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
    }
    shareTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [onShare]);

  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showMenu) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest("[data-settings-menu]")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showMenu]);

  return (
    <nav className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]" aria-label="Playground toolbar">
      <button
        onClick={() => onTogglePanel("tutorial")}
        className={`p-1.5 rounded transition-colors ${
          panelMode === "tutorial"
            ? "bg-[var(--accent)] text-[var(--bg-primary)]"
            : "hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"
        }`}
        title="Tutorial"
        aria-label="Toggle tutorial panel"
        aria-pressed={panelMode === "tutorial"}
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
        aria-label="Toggle challenge panel"
        aria-pressed={panelMode === "challenge"}
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
        aria-label="Compilation target"
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
        title="View generated C++/CUDA source code (Ctrl+Shift+Enter)"
        aria-label="Compile code"
      >
        Compile
      </button>

      <button
        onClick={onDumpAST}
        disabled={busy}
        className="px-3 py-1 text-xs font-medium rounded border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border)] text-[var(--text-primary)] disabled:opacity-50"
        aria-label="Dump AST"
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
        title="Copy shareable link (Ctrl+S)"
        aria-label="Share code"
      >
        {copied ? "Copied!" : "Share"}
      </button>

      <div className="flex-1" />

      <div className="relative" data-settings-menu>
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="p-1.5 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors"
          title="Settings"
          aria-label="Settings menu"
          aria-expanded={showMenu}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg z-50 py-1">
            <button
              onClick={() => {
                if (window.confirm("Reset all tutorial and challenge progress?")) {
                  resetProgress();
                  setShowMenu(false);
                  window.location.reload();
                }
              }}
              className="w-full text-left px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              Reset progress
            </button>
          </div>
        )}
      </div>

      <select
        onChange={(e) => {
          const ex = EXAMPLES.find((x) => x.id === e.target.value);
          if (ex) onLoadCode(ex.code);
          e.target.value = "";
        }}
        value=""
        className="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
        aria-label="Load example code"
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
    </nav>
  );
});

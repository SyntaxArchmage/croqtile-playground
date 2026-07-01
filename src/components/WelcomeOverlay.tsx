"use client";

import { useCallback } from "react";
import { useIsMac, formatShortcut } from "@/lib/platform";

interface Props {
  onStartTutorial: () => void;
  onTryExample: () => void;
  onWriteCode: () => void;
  onDismiss: () => void;
}

export function WelcomeOverlay({ onStartTutorial, onTryExample, onWriteCode, onDismiss }: Props) {
  const isMac = useIsMac();

  const handleAction = useCallback((action: () => void) => {
    onDismiss();
    action();
  }, [onDismiss]);

  return (
    <div
      className="welcome-overlay fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 overlay-backdrop"
      onClick={onDismiss}
    >
      <div
        className="overlay-content max-w-lg w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
          aria-label="Close welcome overlay"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--accent)] mb-2">
            Croqtile Playground
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            GPU programming in your browser
          </p>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => handleAction(onStartTutorial)}
            className="welcome-card group flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent)] transition-colors text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Start Tutorial</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Learn Croqtile step by step</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAction(onTryExample)}
            className="welcome-card group flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--success)] transition-colors text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--success)] transition-colors">Try an Example</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Run a parallel computing demo instantly</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAction(onWriteCode)}
            className="welcome-card group flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--warning)] transition-colors text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--warning)]/10 flex items-center justify-center text-[var(--warning)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--warning)] transition-colors">Write Code</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Jump straight into the editor</div>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex gap-4 text-[10px] text-[var(--text-muted)]">
            <span><kbd className="px-1 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono">{formatShortcut("Ctrl+Enter", isMac)}</kbd> Run</span>
            <span><kbd className="px-1 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] font-mono">{formatShortcut("Ctrl+P", isMac)}</kbd> Commands</span>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

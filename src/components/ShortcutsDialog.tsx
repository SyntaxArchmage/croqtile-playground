"use client";

import { useRef } from "react";
import { useIsMac, formatShortcut } from "@/lib/platform";
import { useFocusTrap } from "@/lib/focusTrap";

export type ShortcutGroup = {
  title: string;
  shortcuts: { keys: string; desc: string }[];
};

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Execution",
    shortcuts: [
      { keys: "Ctrl+Enter", desc: "Run code" },
      { keys: "Ctrl+Shift+Enter", desc: "Compile code" },
      { keys: "Ctrl+Alt+D", desc: "Dump AST" },
    ],
  },
  {
    title: "Editor",
    shortcuts: [
      { keys: "Ctrl+Z", desc: "Undo" },
      { keys: "Ctrl+Shift+Z", desc: "Redo" },
      { keys: "Ctrl+F", desc: "Find in editor" },
      { keys: "Ctrl+H", desc: "Find and replace" },
      { keys: "Ctrl+G", desc: "Go to line" },
    ],
  },
  {
    title: "Output",
    shortcuts: [
      { keys: "Ctrl+L", desc: "Clear output" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { keys: "Ctrl+S", desc: "Share link" },
      { keys: "Ctrl+Shift+T", desc: "Toggle theme" },
      { keys: "Ctrl+P", desc: "Command palette" },
      { keys: "?", desc: "Toggle this help" },
      { keys: "Esc", desc: "Close dialog" },
    ],
  },
];

interface Props {
  onClose: () => void;
}

export function ShortcutsDialog({ onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isMac = useIsMac();
  useFocusTrap(dialogRef);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 overlay-backdrop"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dialog-title"
        className="overlay-content bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-4 sm:p-6 max-w-md w-[min(100%,calc(100vw-2rem))] shadow-2xl max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 id="shortcuts-dialog-title" className="text-sm font-semibold text-[var(--text-primary)]">
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center min-h-11 min-w-11 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close keyboard shortcuts"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0 space-y-4 text-xs">
          {SHORTCUT_GROUPS.map((group) => {
            const sectionId = `shortcuts-section-${group.title.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <section key={group.title} aria-labelledby={sectionId}>
                <h3
                  id={sectionId}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2"
                >
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.shortcuts.map(({ keys, desc }) => (
                    <li key={keys} className="flex items-center justify-between py-1">
                      <kbd className="px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] font-mono text-[10px]">
                        {formatShortcut(keys, isMac)}
                      </kbd>
                      <span className="text-[var(--text-muted)] ml-3 text-right">{desc}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 min-h-11 text-xs font-medium rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

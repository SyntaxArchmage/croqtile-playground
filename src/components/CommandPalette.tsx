"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";

export type CommandCategory = "execution" | "editor" | "navigation" | "view" | "file";

export type CommandItem = {
  label: string;
  action: () => void;
  shortcut?: string;
  category?: CommandCategory;
};

interface Props {
  commands: CommandItem[];
  onClose: () => void;
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const LISTBOX_ID = "command-listbox";

function optionId(index: number): string {
  return `command-option-${index}`;
}

export function CommandPalette({ commands, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? commands.filter((cmd) => cmd.label.toLowerCase().includes(q)) : commands;
  }, [search, commands]);

  const clamped = Math.min(highlight, Math.max(0, filtered.length - 1));

  const execute = useCallback(
    (cmd: CommandItem) => {
      onClose();
      cmd.action();
    },
    [onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[clamped];
        if (cmd) execute(cmd);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [filtered, clamped, execute, onClose],
  );

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    inputRef.current?.focus();

    const dialog = dialogRef.current;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    dialog?.addEventListener("keydown", handleKeyDown);
    return () => {
      dialog?.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (dialogRef.current && !dialogRef.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-center pt-[max(10vh,env(safe-area-inset-top,0px))] px-4 pb-4 bg-black/60"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg max-w-[400px] w-[min(100%,calc(100vw-2rem))] shadow-2xl overflow-hidden self-start max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-2rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setHighlight(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          aria-label="Search commands"
          aria-controls={LISTBOX_ID}
          aria-expanded="true"
          aria-autocomplete="list"
          aria-activedescendant={filtered.length > 0 ? optionId(clamped) : undefined}
          className="w-full min-h-11 px-3 py-2 bg-[var(--bg-primary)] border-b border-[var(--border)] text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        <ul id={LISTBOX_ID} className="flex-1 min-h-0 overflow-y-auto py-1" role="listbox" aria-label="Commands">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-xs text-[var(--text-muted)]" role="presentation">No matching commands</li>
          ) : (
            filtered.map((cmd, index) => (
              <li key={cmd.label} id={optionId(index)} role="option" aria-selected={index === clamped}>
                <button
                  type="button"
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setHighlight(index)}
                  aria-label={cmd.shortcut ? `${cmd.label}, ${cmd.shortcut}` : cmd.label}
                  className={`w-full flex items-center justify-between px-3 py-3 min-h-11 text-left text-sm ${
                    index === clamped
                      ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{cmd.label}</span>
                    {cmd.category && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)]" aria-hidden="true">
                        {cmd.category}
                      </span>
                    )}
                  </span>
                  {cmd.shortcut && (
                    <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)] font-mono text-[10px] shrink-0">
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

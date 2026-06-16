"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";

export type CommandItem = {
  label: string;
  action: () => void;
  shortcut?: string;
};

interface Props {
  commands: CommandItem[];
  onClose: () => void;
}

export function CommandPalette({ commands, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

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
    inputRef.current?.focus();
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
      className="absolute inset-0 z-50 flex justify-center pt-[10vh] bg-black/60"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg max-w-[400px] w-full mx-4 shadow-2xl overflow-hidden self-start"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setHighlight(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          aria-label="Search commands"
          className="w-full min-h-11 px-3 py-2 bg-[var(--bg-primary)] border-b border-[var(--border)] text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
        />
        <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-xs text-[var(--text-muted)]">No matching commands</li>
          ) : (
            filtered.map((cmd, index) => (
              <li key={cmd.label} role="option" aria-selected={index === clamped}>
                <button
                  type="button"
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setHighlight(index)}
                  className={`w-full flex items-center justify-between px-3 py-3 min-h-11 text-left text-sm ${
                    index === clamped
                      ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
                  }`}
                >
                  <span>{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="ml-2 px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)] font-mono text-[10px]">
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

"use client";

import { memo, useCallback, useRef, useEffect } from "react";
import type { CompilerFlags, CompilerTarget } from "@/lib/settings";
import { DEFAULT_COMPILER_FLAGS, TARGET_ARCHITECTURES } from "@/lib/settings";

interface Props {
  flags: CompilerFlags;
  target: CompilerTarget;
  onChange: (flags: CompilerFlags) => void;
  onClose: () => void;
}

const FLAG_OPTIONS: { key: keyof Omit<CompilerFlags, "customFlags">; label: string; description: string }[] = [
  { key: "emitSource", label: "Emit Source (-es)", description: "Output generated source code" },
  { key: "dumpAst", label: "Dump AST (-e)", description: "Print the abstract syntax tree" },
  { key: "noPreprocess", label: "No Preprocess (-np)", description: "Skip the preprocessor stage" },
  { key: "dropComments", label: "Drop Comments (-dc)", description: "Remove comments before parsing" },
  { key: "noCodegen", label: "No Codegen (-s)", description: "Run semantic analysis only, skip code generation" },
  { key: "semanticOnly", label: "Semantic Only (-s)", description: "Stop after semantic analysis" },
];

export const CompilerOptionsPanel = memo(function CompilerOptionsPanel({
  flags,
  target,
  onChange,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleToggle = useCallback(
    (key: keyof CompilerFlags) => {
      onChange({ ...flags, [key]: !flags[key] });
    },
    [flags, onChange],
  );

  const handleCustomFlagsChange = useCallback(
    (value: string) => {
      onChange({ ...flags, customFlags: value });
    },
    [flags, onChange],
  );

  const handleReset = useCallback(() => {
    onChange({ ...DEFAULT_COMPILER_FLAGS });
  }, [onChange]);

  return (
    <div
      ref={panelRef}
      className="toolbar-dropdown absolute right-0 top-full mt-1 w-72 max-w-[calc(100vw-1rem)] rounded border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg z-50"
      role="dialog"
      aria-label="Compiler options"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
        <span className="text-xs font-semibold text-[var(--text-primary)]">Compiler Options</span>
        <button
          type="button"
          onClick={handleReset}
          className="text-[10px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-primary)] transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="py-1">
        {FLAG_OPTIONS.map(({ key, label, description }) => (
          <label
            key={key}
            className="flex items-start gap-2 px-3 py-1.5 hover:bg-[var(--bg-primary)] cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={flags[key] as boolean}
              onChange={() => handleToggle(key)}
              className="accent-[var(--accent)] mt-0.5 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs text-[var(--text-primary)]">{label}</div>
              <div className="text-[10px] text-[var(--text-muted)] leading-tight">{description}</div>
            </div>
          </label>
        ))}
      </div>

      {TARGET_ARCHITECTURES[target].archs.length > 1 && (
        <div className="px-3 py-2 border-t border-[var(--border)]">
          <label className="block">
            <span className="text-[10px] text-[var(--text-muted)]">Architecture</span>
            <select
              value={flags.architecture || TARGET_ARCHITECTURES[target].default}
              onChange={(e) => onChange({ ...flags, architecture: e.target.value })}
              className="mt-1 w-full px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
            >
              {TARGET_ARCHITECTURES[target].archs.map((arch) => (
                <option key={arch.id} value={arch.id}>
                  {arch.id} — {arch.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="px-3 py-2 border-t border-[var(--border)]">
        <label className="block">
          <span className="text-[10px] text-[var(--text-muted)]">Custom flags</span>
          <input
            type="text"
            value={flags.customFlags}
            onChange={(e) => handleCustomFlagsChange(e.target.value)}
            placeholder="-O2 --verbose ..."
            className="mt-1 w-full px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </label>
      </div>
    </div>
  );
});

"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";

type Tab = "output" | "errors" | "ast";

interface Props {
  output: string;
  errors: string;
  ast?: string;
  onClear?: () => void;
}

const DEFAULT_HEIGHT_PCT = 35;
const MIN_HEIGHT_PCT = 15;
const MAX_HEIGHT_PCT = 65;

export const OutputPanel = memo(function OutputPanel({ output, errors, ast = "", onClear }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("output");
  const [prevErrors, setPrevErrors] = useState(errors);
  const [prevOutput, setPrevOutput] = useState(output);
  const [prevAst, setPrevAst] = useState(ast);
  const [copied, setCopied] = useState(false);
  const [heightPct, setHeightPct] = useState(DEFAULT_HEIGHT_PCT);

  if (errors !== prevErrors) {
    setPrevErrors(errors);
    if (errors) setActiveTab("errors");
  }
  if (output !== prevOutput) {
    setPrevOutput(output);
    if (output && !errors) setActiveTab("output");
  }
  if (ast !== prevAst) {
    setPrevAst(ast);
    if (ast) setActiveTab("ast");
  }

  const content = activeTab === "ast" ? ast : activeTab === "output" ? output : errors;
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content]);

  const handleCopy = useCallback(() => {
    if (!content) return;
    navigator.clipboard.writeText(content).catch(() => {});
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }, [content]);

  const updateHeight = useCallback((clientY: number) => {
    const parent = panelRef.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const pct = ((rect.bottom - clientY) / rect.height) * 100;
    setHeightPct(Math.max(MIN_HEIGHT_PCT, Math.min(MAX_HEIGHT_PCT, pct)));
  }, []);

  const onResizeMouseDown = useCallback(() => {
    dragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      updateHeight(e.clientY);
    };

    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [updateHeight]);

  const onResizeTouchStart = useCallback(() => {
    dragging.current = true;

    const onTouchMove = (ev: TouchEvent) => {
      if (!dragging.current) return;
      updateHeight(ev.touches[0].clientY);
    };

    const onTouchEnd = () => {
      dragging.current = false;
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
  }, [updateHeight]);

  const tabClass = (tab: Tab) => `px-2 py-0.5 text-xs rounded ${
    activeTab === tab
      ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
  }`;

  return (
    <div
      ref={panelRef}
      className="min-h-[120px] border-t border-[var(--border)] flex flex-col"
      style={{ height: `${heightPct}%` }}
    >
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-valuenow={Math.round(heightPct)}
        aria-valuemin={MIN_HEIGHT_PCT}
        aria-valuemax={MAX_HEIGHT_PCT}
        aria-label="Resize output panel"
        tabIndex={0}
        onMouseDown={onResizeMouseDown}
        onTouchStart={onResizeTouchStart}
        onKeyDown={(e) => {
          const step = 2;
          if (e.key === "ArrowUp") { e.preventDefault(); setHeightPct((h) => Math.min(MAX_HEIGHT_PCT, h + step)); }
          if (e.key === "ArrowDown") { e.preventDefault(); setHeightPct((h) => Math.max(MIN_HEIGHT_PCT, h - step)); }
        }}
        className="h-1 cursor-row-resize bg-[var(--border)] hover:bg-[var(--accent)] focus:bg-[var(--accent)] focus:outline-none transition-colors flex-shrink-0 touch-none"
      />
      <div
        className="flex items-center gap-1 px-3 py-1 border-b border-[var(--border)] bg-[var(--bg-secondary)]"
        role="tablist"
        aria-label="Output panels"
        onKeyDown={(e) => {
          const tabs: Tab[] = ["output", "errors", "ast"];
          const idx = tabs.indexOf(activeTab);
          if (e.key === "ArrowRight") {
            e.preventDefault();
            const next = tabs[(idx + 1) % tabs.length];
            setActiveTab(next);
            document.getElementById(`${next}-tab`)?.focus();
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
            setActiveTab(prev);
            document.getElementById(`${prev}-tab`)?.focus();
          }
        }}
      >
        <button id="output-tab" role="tab" tabIndex={activeTab === "output" ? 0 : -1} aria-selected={activeTab === "output"} aria-controls="output-tabpanel" onClick={() => setActiveTab("output")} className={tabClass("output")}>
          Output
        </button>
        <button id="errors-tab" role="tab" tabIndex={activeTab === "errors" ? 0 : -1} aria-selected={activeTab === "errors"} aria-controls="output-tabpanel" onClick={() => setActiveTab("errors")} className={tabClass("errors")}>
          Errors
          {errors && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-red-500 inline-block" aria-hidden="true" />
          )}
        </button>
        <button id="ast-tab" role="tab" tabIndex={activeTab === "ast" ? 0 : -1} aria-selected={activeTab === "ast"} aria-controls="output-tabpanel" onClick={() => setActiveTab("ast")} className={tabClass("ast")}>
          AST
          {ast && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" aria-hidden="true" />
          )}
        </button>
        {(content || ((output || errors || ast) && onClear)) && (
          <div className="ml-auto flex items-center gap-1">
            {content && (
              <button
                onClick={handleCopy}
                className="px-2 py-0.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Copy output"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
            {(output || errors || ast) && onClear && (
              <button
                onClick={onClear}
                className="px-2 py-0.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Clear output"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        id="output-tabpanel"
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
        className="flex-1 overflow-auto p-3"
      >
        <pre className="text-xs font-mono text-[var(--text-primary)] whitespace-pre-wrap">
          {content || (
            <span className="text-[var(--text-muted)]">
              Click &ldquo;Run&rdquo; or &ldquo;Compile&rdquo; to see output.
            </span>
          )}
        </pre>
      </div>
    </div>
  );
});

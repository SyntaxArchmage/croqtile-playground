"use client";

import { useState, useEffect, useRef, useCallback, memo, type ReactNode } from "react";
import { loadSettings, saveSettings } from "@/lib/settings";

function isErrorLine(line: string): boolean {
  return (
    /\bline\s+\d+:?\b/i.test(line) ||
    /\bat\s+line\s+\d+\b/i.test(line) ||
    /:\d+:/.test(line)
  );
}

function formatWithLineNumbers(text: string): string {
  return text.split("\n").map((line, i) => `${i + 1}: ${line}`).join("\n");
}

function highlightErrorLines(text: string, withLineNumbers: boolean): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const displayLine = withLineNumbers ? `${i + 1}: ${line}` : line;
    return (
      <div
        key={i}
        className={
          isErrorLine(line)
            ? "error-line-highlight border-l-2 border-red-500 bg-red-950/20 pl-2"
            : undefined
        }
      >
        {displayLine || "\u00A0"}
      </div>
    );
  });
}

type Tab = "output" | "errors" | "ast";

interface Props {
  output: string;
  errors: string;
  ast?: string;
  onClear?: () => void;
}

const DEFAULT_HEIGHT_PCT = 30;
const MIN_HEIGHT_PCT = 15;
const MAX_HEIGHT_PCT = 65;

export const OutputPanel = memo(function OutputPanel({ output, errors, ast = "", onClear }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("output");
  const [prevErrors, setPrevErrors] = useState(errors);
  const [prevOutput, setPrevOutput] = useState(output);
  const [prevAst, setPrevAst] = useState(ast);
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(() => loadSettings().outputLineNumbers);
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
    if (ast && !errors) setActiveTab("ast");
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

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const toggleLineNumbers = useCallback(() => {
    setLineNumbers((prev) => {
      const next = !prev;
      saveSettings({ ...loadSettings(), outputLineNumbers: next });
      return next;
    });
  }, []);

  const handleCopy = useCallback(() => {
    if (!content) return;
    navigator.clipboard?.writeText(content).catch(() => {});
    setCopied(true);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
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
      if (!dragging.current || ev.touches.length === 0) return;
      updateHeight(ev.touches[0].clientY);
    };

    const onTouchEnd = () => {
      dragging.current = false;
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
  }, [updateHeight]);

  const tabClass = (tab: Tab) => `px-2 py-2 sm:py-0.5 min-h-11 sm:min-h-0 text-xs rounded transition-colors ${
    activeTab === tab
      ? "bg-[var(--bg-surface)] text-[var(--text-primary)] output-tab-active"
      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
  }`;

  return (
      <div
        ref={panelRef}
        className="min-h-[120px] border-t border-[var(--border)] flex flex-col"
        style={{ height: `${heightPct}%` }}
        role="region"
        aria-label="Output panel"
      >
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-valuenow={Math.round(heightPct)}
        aria-valuemin={MIN_HEIGHT_PCT}
        aria-valuemax={MAX_HEIGHT_PCT}
        aria-label="Resize output panel height"
        tabIndex={0}
        onMouseDown={onResizeMouseDown}
        onTouchStart={onResizeTouchStart}
        onKeyDown={(e) => {
          const step = 2;
          if (e.key === "ArrowUp") { e.preventDefault(); setHeightPct((h) => Math.min(MAX_HEIGHT_PCT, h + step)); }
          if (e.key === "ArrowDown") { e.preventDefault(); setHeightPct((h) => Math.max(MIN_HEIGHT_PCT, h - step)); }
        }}
        className="resize-handle-y h-1.5 cursor-row-resize bg-[var(--border)] hover:bg-[var(--accent)] focus-visible:bg-[var(--accent)] transition-colors flex-shrink-0"
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
        <button id="output-tab" type="button" role="tab" tabIndex={activeTab === "output" ? 0 : -1} aria-selected={activeTab === "output"} aria-controls="output-tabpanel" onClick={() => setActiveTab("output")} className={tabClass("output")}>
          Output
        </button>
        <button id="errors-tab" type="button" role="tab" tabIndex={activeTab === "errors" ? 0 : -1} aria-selected={activeTab === "errors"} aria-controls="output-tabpanel" aria-label={errors ? "Errors (has errors)" : "Errors"} onClick={() => setActiveTab("errors")} className={tabClass("errors")}>
          Errors
          {errors && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-red-500 inline-block" aria-hidden="true" />
          )}
        </button>
        <button id="ast-tab" type="button" role="tab" tabIndex={activeTab === "ast" ? 0 : -1} aria-selected={activeTab === "ast"} aria-controls="output-tabpanel" aria-label={ast ? "AST (available)" : "AST"} onClick={() => setActiveTab("ast")} className={tabClass("ast")}>
          AST
          {ast && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" aria-hidden="true" />
          )}
        </button>
        {(content || ((output || errors || ast) && onClear)) && (
          <div className="ml-auto flex items-center gap-1">
            {content && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-2 sm:py-0.5 min-h-11 sm:min-h-0 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label={copied ? "Copied to clipboard" : "Copy output to clipboard"}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    "Copied!"
                  ) : (
                    <>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setWordWrap((w) => !w)}
                  className="px-2 py-2 sm:py-0.5 min-h-11 sm:min-h-0 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="Toggle word wrap"
                  aria-pressed={wordWrap}
                >
                  {wordWrap ? "Wrap" : "No Wrap"}
                </button>
                <button
                  type="button"
                  onClick={toggleLineNumbers}
                  className="px-2 py-2 sm:py-0.5 min-h-11 sm:min-h-0 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="Toggle line numbers"
                  aria-pressed={lineNumbers}
                >
                  {lineNumbers ? "#" : "Lines"}
                </button>
              </>
            )}
            {(output || errors || ast) && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="px-2 py-2 sm:py-0.5 min-h-11 sm:min-h-0 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
        aria-live="polite"
        aria-relevant="additions text"
        className="flex-1 overflow-auto p-3"
      >
        {activeTab === "errors" && errors ? (
          <div className="text-xs font-mono text-[var(--text-primary)]">
            {highlightErrorLines(errors, lineNumbers)}
          </div>
        ) : (
          <pre className={`text-xs font-mono text-[var(--text-primary)] ${wordWrap ? "whitespace-pre-wrap" : "whitespace-pre"}`}>
            {(content && lineNumbers ? formatWithLineNumbers(content) : content) || (
              <span className="text-[var(--text-muted)] flex flex-col gap-1.5">
                <span>Click <strong>Run</strong> or press <kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] text-[10px] font-mono">Ctrl+Enter</kbd> to execute your code.</span>
                <span className="text-[10px] opacity-60">Use <kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] font-mono">Ctrl+Shift+Enter</kbd> to compile, or <kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] font-mono">Ctrl+Alt+D</kbd> to dump AST.</span>
              </span>
            )}
          </pre>
        )}
      </div>
    </div>
  );
});

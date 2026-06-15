"use client";

import { useState, useEffect, useRef } from "react";

type Tab = "output" | "errors";

interface Props {
  output: string;
  errors: string;
  onClear?: () => void;
}

function useAutoTab(output: string, errors: string): Tab {
  const [tab, setTab] = useState<Tab>("output");
  const [prevErrors, setPrevErrors] = useState(errors);
  const [prevOutput, setPrevOutput] = useState(output);

  if (errors !== prevErrors) {
    setPrevErrors(errors);
    if (errors) setTab("errors");
  }
  if (output !== prevOutput) {
    setPrevOutput(output);
    if (output && !errors) setTab("output");
  }

  return tab;
}

export function OutputPanel({ output, errors, onClear }: Props) {
  const autoTab = useAutoTab(output, errors);
  const [manualTab, setManualTab] = useState<Tab | null>(null);
  const activeTab = manualTab ?? autoTab;

  useEffect(() => {
    setManualTab(null);
  }, [autoTab]);

  const content = activeTab === "output" ? output : errors;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="h-[35%] min-h-[120px] border-t border-[var(--border)] flex flex-col">
      <div className="flex items-center gap-1 px-3 py-1 border-b border-[var(--border)] bg-[var(--bg-secondary)]" role="tablist" aria-label="Output panels">
        <button
          role="tab"
          aria-selected={activeTab === "output"}
          aria-controls="output-tabpanel"
          onClick={() => setManualTab("output")}
          className={`px-2 py-0.5 text-xs rounded ${
            activeTab === "output"
              ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Output
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "errors"}
          aria-controls="output-tabpanel"
          onClick={() => setManualTab("errors")}
          className={`px-2 py-0.5 text-xs rounded ${
            activeTab === "errors"
              ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Errors
          {errors && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
          )}
        </button>
        {(output || errors) && onClear && (
          <button
            onClick={onClear}
            className="ml-auto px-2 py-0.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Clear
          </button>
        )}
      </div>
      <div ref={scrollRef} id="output-tabpanel" role="tabpanel" className="flex-1 overflow-auto p-3">
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
}

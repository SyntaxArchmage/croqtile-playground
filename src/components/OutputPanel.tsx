"use client";

import { useState, useEffect, useRef } from "react";

type Tab = "output" | "errors";

interface Props {
  output: string;
  errors: string;
}

export function OutputPanel({ output, errors }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("output");
  const prevErrors = useRef(errors);

  useEffect(() => {
    if (errors && errors !== prevErrors.current) {
      setActiveTab("errors");
    } else if (output && !errors) {
      setActiveTab("output");
    }
    prevErrors.current = errors;
  }, [errors, output]);

  const content = activeTab === "output" ? output : errors;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="h-[35%] min-h-[120px] border-t border-[var(--border)] flex flex-col">
      <div className="flex items-center gap-1 px-3 py-1 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          onClick={() => setActiveTab("output")}
          className={`px-2 py-0.5 text-xs rounded ${
            activeTab === "output"
              ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Output
        </button>
        <button
          onClick={() => setActiveTab("errors")}
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
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-3">
        <pre className="text-xs font-mono text-[var(--text-primary)] whitespace-pre-wrap">
          {content || (
            <span className="text-[var(--text-muted)]">
              Click "Run" or "Compile" to see output.
            </span>
          )}
        </pre>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, memo } from "react";

type Tab = "output" | "errors" | "ast";

interface Props {
  output: string;
  errors: string;
  ast?: string;
  onClear?: () => void;
}

export const OutputPanel = memo(function OutputPanel({ output, errors, ast = "", onClear }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("output");
  const [prevErrors, setPrevErrors] = useState(errors);
  const [prevOutput, setPrevOutput] = useState(output);
  const [prevAst, setPrevAst] = useState(ast);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content]);

  const tabClass = (tab: Tab) => `px-2 py-0.5 text-xs rounded ${
    activeTab === tab
      ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
  }`;

  return (
    <div className="h-[35%] min-h-[120px] border-t border-[var(--border)] flex flex-col">
      <div className="flex items-center gap-1 px-3 py-1 border-b border-[var(--border)] bg-[var(--bg-secondary)]" role="tablist" aria-label="Output panels">
        <button role="tab" aria-selected={activeTab === "output"} aria-controls="output-tabpanel" onClick={() => setActiveTab("output")} className={tabClass("output")}>
          Output
        </button>
        <button role="tab" aria-selected={activeTab === "errors"} aria-controls="output-tabpanel" onClick={() => setActiveTab("errors")} className={tabClass("errors")}>
          Errors
          {errors && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
          )}
        </button>
        <button role="tab" aria-selected={activeTab === "ast"} aria-controls="output-tabpanel" onClick={() => setActiveTab("ast")} className={tabClass("ast")}>
          AST
          {ast && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
          )}
        </button>
        {(output || errors || ast) && onClear && (
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
});

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Editor } from "./Editor";
import { Toolbar } from "./Toolbar";
import { OutputPanel } from "./OutputPanel";
import { StatusBar } from "./StatusBar";
import { TutorialPanel } from "./TutorialPanel";
import { ChallengePanel } from "./ChallengePanel";
import { ResizableSplit } from "./ResizableSplit";
import { useChoreoWorker } from "@/lib/useChoreoWorker";
import { EXAMPLES } from "@/lib/examples";

export type PanelMode = "closed" | "tutorial" | "challenge";

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

function getInitialSource(): string {
  if (typeof window !== "undefined" && window.location.hash.length > 1) {
    try {
      return decodeURIComponent(window.location.hash.slice(1));
    } catch {
      // fall through
    }
  }
  return EXAMPLES[0].code;
}

export function Playground() {
  const [source, setSource] = useState<string>(getInitialSource);
  const [target, setTarget] = useState("cc");
  const [panelMode, setPanelMode] = useState<PanelMode>("closed");
  const editorRef = useRef<{ getValue: () => string }>(null);

  const { status, output, errors, compilerVersion, buildManifest, run, compile, dumpAST, clearOutput } =
    useChoreoWorker();

  const getCode = useCallback(() => editorRef.current?.getValue() ?? source, [source]);

  const handleRun = useCallback(() => run(getCode()), [getCode, run]);
  const handleCompile = useCallback(() => compile(getCode(), target), [getCode, target, compile]);
  const handleDumpAST = useCallback(() => dumpAST(getCode()), [getCode, dumpAST]);

  const handleShare = useCallback(() => {
    const code = getCode();
    const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(url).catch(() => {});
    window.history.replaceState(null, "", `#${encodeURIComponent(code)}`);
  }, [getCode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          handleCompile();
        } else {
          handleRun();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleShare();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun, handleCompile, handleShare]);

  const idePanel = (
    <div className="h-full flex flex-col relative">
      {status === "loading" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[var(--text-muted)]">Loading WASM compiler...</span>
          </div>
        </div>
      )}
      {status === "error" && !errors && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/90">
          <div className="max-w-sm p-6 rounded-lg border border-red-800 bg-red-950/30 text-center">
            <div className="text-lg text-red-400 mb-2">WASM Load Failed</div>
            <p className="text-sm text-[var(--text-muted)]">
              The compiler could not be loaded. WASM files may not be built yet.
              You can still edit code, but Run / Compile will not work.
            </p>
          </div>
        </div>
      )}
      <Toolbar
        target={target}
        onTargetChange={setTarget}
        onRun={handleRun}
        onCompile={handleCompile}
        onDumpAST={handleDumpAST}
        onLoadCode={setSource}
        onShare={handleShare}
        onTogglePanel={(mode) => setPanelMode((p) => p === mode ? "closed" : mode)}
        panelMode={panelMode}
        status={status}
      />
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0">
          <Editor ref={editorRef} value={source} onChange={setSource} />
        </div>
        <OutputPanel output={output} errors={errors} onClear={clearOutput} />
      </div>
      <StatusBar
        status={status}
        compilerVersion={compilerVersion}
        buildManifest={buildManifest}
      />
    </div>
  );

  if (panelMode === "closed") {
    return <div className="h-screen">{idePanel}</div>;
  }

  const contextPanel = panelMode === "tutorial" ? (
    <TutorialPanel
      onLoadCode={setSource}
      onClose={() => setPanelMode("closed")}
    />
  ) : (
    <ChallengePanel
      onLoadCode={setSource}
      onClose={() => setPanelMode("closed")}
      lastOutput={output}
    />
  );

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        <div className="h-[40%] min-h-0 overflow-hidden border-b border-[var(--border)]">
          {contextPanel}
        </div>
        <div className="flex-1 min-h-0">{idePanel}</div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ResizableSplit left={contextPanel} right={idePanel} />
    </div>
  );
}

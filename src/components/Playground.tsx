"use client";

import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from "react";
import { Editor } from "./Editor";
import { Toolbar } from "./Toolbar";
import { OutputPanel } from "./OutputPanel";
import { StatusBar } from "./StatusBar";
import { TutorialPanel } from "./TutorialPanel";
import { ChallengePanel } from "./ChallengePanel";
import { ResizableSplit } from "./ResizableSplit";
import { useChoreoWorker } from "@/lib/useChoreoWorker";
import { EXAMPLES } from "@/lib/examples";
import type { PanelMode } from "@/lib/types";
import { saveLastSource, loadLastSource } from "@/lib/progress";
import { decodeCode, encodeCode } from "@/lib/urlCodec";

const noop = () => () => {};

function clearPanelParams() {
  const url = new URL(window.location.href);
  url.searchParams.delete("tutorial");
  url.searchParams.delete("challenge");
  url.searchParams.delete("step");
  window.history.replaceState(null, "", url.toString());
}

function useIsMobile(breakpoint = 768): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches,
    () => false,
  );
}

function readInitialSource(): string {
  if (typeof window !== "undefined" && window.location.hash.length > 1) {
    return decodeCode(window.location.hash.slice(1));
  }
  if (typeof window !== "undefined") {
    const saved = loadLastSource();
    if (saved) return saved;
  }
  return EXAMPLES[0].code;
}

function readInitialPanelMode(): PanelMode {
  if (typeof window === "undefined") return "closed";
  const params = new URLSearchParams(window.location.search);
  if (params.has("tutorial")) return "tutorial";
  if (params.has("challenge")) return "challenge";
  return "closed";
}

export function Playground() {
  const initialSource = useSyncExternalStore(noop, readInitialSource, () => EXAMPLES[0].code);
  const initialPanelMode = useSyncExternalStore(noop, readInitialPanelMode, () => "closed" as PanelMode);

  const [source, setSource] = useState(initialSource);
  const [target, setTarget] = useState("cc");
  const [panelMode, setPanelMode] = useState(initialPanelMode);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const editorRef = useRef<{ getValue: () => string }>(null);
  const [prevInitSource, setPrevInitSource] = useState(initialSource);
  const [prevInitPanel, setPrevInitPanel] = useState(initialPanelMode);

  if (initialSource !== prevInitSource) {
    setPrevInitSource(initialSource);
    setSource(initialSource);
  }
  if (initialPanelMode !== prevInitPanel) {
    setPrevInitPanel(initialPanelMode);
    setPanelMode(initialPanelMode);
  }

  const { status, output, errors, compilerVersion, buildManifest, run, compile, dumpAST, clearOutput } =
    useChoreoWorker();

  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => saveLastSource(source), 1000);
    return () => clearTimeout(timer);
  }, [source]);

  const sourceRef = useRef(source);
  sourceRef.current = source;
  const getCode = useCallback(() => editorRef.current?.getValue() ?? sourceRef.current, []);

  const handleRun = useCallback(() => run(getCode()), [getCode, run]);
  const handleCompile = useCallback(() => compile(getCode(), target), [getCode, target, compile]);
  const handleDumpAST = useCallback(() => dumpAST(getCode()), [getCode, dumpAST]);

  const handleTogglePanel = useCallback((mode: PanelMode) => {
    setPanelMode((p) => {
      const next = p === mode ? "closed" : mode;
      if (next === "closed") clearPanelParams();
      return next;
    });
  }, []);

  const handleShare = useCallback(() => {
    const code = getCode();
    const encoded = encodeCode(code);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    navigator.clipboard.writeText(url).then(
      () => {},
      () => { window.alert("Could not copy link. Try copying the URL manually."); }
    );
    window.history.replaceState(null, "", `#${encoded}`);
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
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        setShowShortcuts((v) => !v);
      }
      if (e.key === "Escape") {
        setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun, handleCompile, handleShare]);

  const deepLinkId = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get(panelMode === "tutorial" ? "tutorial" : "challenge")
    : null;

  const shortcutsOverlay = showShortcuts && (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowShortcuts(false)}>
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</h2>
          <button onClick={() => setShowShortcuts(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Close">×</button>
        </div>
        <div className="space-y-2 text-xs">
          {[
            ["Ctrl+Enter", "Run code"],
            ["Ctrl+Shift+Enter", "Compile code"],
            ["Ctrl+S", "Share link"],
            ["?", "Toggle this help"],
            ["Esc", "Close dialog"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between py-1">
              <kbd className="px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] font-mono text-[10px]">{key}</kbd>
              <span className="text-[var(--text-muted)]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const idePanel = (
    <div className="h-full flex flex-col relative">
      {shortcutsOverlay}
      {status === "loading" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm" role="alert" aria-live="polite">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[var(--text-muted)]">Loading WASM compiler...</span>
          </div>
        </div>
      )}
      {status === "error" && !errors && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/90" role="alert" aria-live="assertive">
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
        onTogglePanel={handleTogglePanel}
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

  const closePanel = useCallback(() => {
    setPanelMode("closed");
    clearPanelParams();
  }, []);

  if (panelMode === "closed") {
    return <div className="h-screen">{idePanel}</div>;
  }

  const contextPanel = panelMode === "tutorial" ? (
    <TutorialPanel
      onLoadCode={setSource}
      onClose={closePanel}
      initialId={deepLinkId ?? undefined}
    />
  ) : (
    <ChallengePanel
      onLoadCode={setSource}
      onClose={closePanel}
      lastOutput={output}
      initialId={deepLinkId ?? undefined}
    />
  );

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

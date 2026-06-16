"use client";

import { useState, useCallback, useRef, useEffect, useSyncExternalStore, useMemo } from "react";
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
import { loadSettings, saveSettings, type EditorSettings } from "@/lib/settings";
import type { CursorPosition } from "./Editor";
import { decodeCode, encodeCode } from "@/lib/urlCodec";
import { formatChoreoCode } from "@/lib/formatCode";
import { CommandPalette, type CommandItem } from "./CommandPalette";

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
  const [target, setTarget] = useState(() => loadSettings().lastTarget);
  const [panelMode, setPanelMode] = useState(initialPanelMode);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ line: 1, column: 1 });
  const [settings, setSettings] = useState(() => loadSettings());
  const editorRef = useRef<{ getValue: () => string }>(null);
  const shortcutsDialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const lastLoadedCodeRef = useRef<string>(initialSource);
  const loadAndRunTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (loadAndRunTimerRef.current) clearTimeout(loadAndRunTimerRef.current); }, []);
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
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

  const { status, output, errors, ast, compilerVersion, buildManifest, lastElapsedMs, run, compile, dumpAST, clearOutput } =
    useChoreoWorker();

  const prevStatusRef = useRef(status);
  const prevOutputRef = useRef(output);
  const prevErrorsRef = useRef(errors);
  const prevAstRef = useRef(ast);

  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => saveLastSource(source), 1000);
    return () => clearTimeout(timer);
  }, [source]);

  useEffect(() => {
    if (status === "running" && prevStatusRef.current !== "running") {
      setStatusAnnouncement("Running code");
    } else if (output && output !== prevOutputRef.current) {
      setStatusAnnouncement(errors ? "Run finished with errors" : "Run finished. Output is available");
    } else if (errors && errors !== prevErrorsRef.current) {
      setStatusAnnouncement("Errors found");
    } else if (ast && ast !== prevAstRef.current) {
      setStatusAnnouncement("AST dump ready");
    }
    prevStatusRef.current = status;
    prevOutputRef.current = output;
    prevErrorsRef.current = errors;
    prevAstRef.current = ast;
  }, [status, output, errors, ast]);

  useEffect(() => {
    if (!showShortcuts) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    const dialog = shortcutsDialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !focusable?.length) return;
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
  }, [showShortcuts]);

  const sourceRef = useRef(source);
  useEffect(() => { sourceRef.current = source; }, [source]);
  const getCode = useCallback(() => editorRef.current?.getValue() ?? sourceRef.current, []);

  const skipLoadConfirmRef = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      skipLoadConfirmRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const confirmAndLoad = useCallback(
    (code: string): boolean => {
      const currentSource = editorRef.current?.getValue() ?? sourceRef.current;
      const isModified = currentSource !== lastLoadedCodeRef.current;
      const isDifferent = currentSource !== code;
      if (
        !skipLoadConfirmRef.current &&
        isModified &&
        isDifferent &&
        !window.confirm("You have unsaved changes. Load new code?")
      ) {
        return false;
      }
      lastLoadedCodeRef.current = code;
      setSource(code);
      return true;
    },
    [],
  );

  const handleLoadCode = useCallback(
    (code: string) => { confirmAndLoad(code); },
    [confirmAndLoad],
  );

  const handleLoadAndRun = useCallback(
    (code: string) => {
      if (confirmAndLoad(code)) {
        if (loadAndRunTimerRef.current) clearTimeout(loadAndRunTimerRef.current);
        loadAndRunTimerRef.current = setTimeout(() => {
          loadAndRunTimerRef.current = null;
          run(code);
        }, 100);
      }
    },
    [confirmAndLoad, run],
  );

  useEffect(() => {
    document.title =
      status === "running" ? "⏳ Running... | Croqtile Playground" : "Croqtile Playground";
  }, [status]);

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

  const settingsRef = useRef(settings);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  const handleTargetChange = useCallback((t: string) => {
    setTarget(t);
    saveSettings({ ...settingsRef.current, lastTarget: t });
  }, []);

  const handleSettingsChange = useCallback((s: EditorSettings) => {
    setSettings(s);
    saveSettings(s);
  }, []);

  const handleShare = useCallback(() => {
    const code = getCode();
    const encoded = encodeCode(code);
    const shareUrl = `${window.location.origin}${window.location.pathname}#${encoded}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(
        () => {},
        () => { window.alert("Could not copy link. Try copying the URL manually."); }
      );
    }
    const clean = new URL(window.location.href);
    clean.search = "";
    clean.hash = encoded;
    window.history.replaceState(null, "", clean.toString());
  }, [getCode]);

  const handleFormatCode = useCallback(() => {
    setSource(formatChoreoCode(getCode()));
  }, [getCode]);

  const closeCommandPalette = useCallback(() => {
    setShowCommandPalette(false);
  }, []);

  const paletteCommands = useMemo<CommandItem[]>(() => [
    { label: "Run Code", action: handleRun, shortcut: "Ctrl+Enter" },
    { label: "Compile Code", action: handleCompile, shortcut: "Ctrl+Shift+Enter" },
    { label: "Dump AST", action: handleDumpAST, shortcut: "Ctrl+Shift+D" },
    { label: "Share Link", action: handleShare, shortcut: "Ctrl+S" },
    { label: "Clear Output", action: clearOutput, shortcut: "Ctrl+L" },
    { label: "Open Tutorial", action: () => handleTogglePanel("tutorial") },
    { label: "Open Challenges", action: () => handleTogglePanel("challenge") },
    { label: "Format Code", action: handleFormatCode },
    { label: "Keyboard Shortcuts", action: () => setShowShortcuts(true), shortcut: "?" },
  ], [handleRun, handleCompile, handleDumpAST, handleShare, clearOutput, handleTogglePanel, handleFormatCode]);

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
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S") && !e.shiftKey) {
        e.preventDefault();
        handleShare();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        handleDumpAST();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        clearOutput();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        setShowShortcuts((v) => !v);
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun, handleCompile, handleDumpAST, handleShare, clearOutput]);

  const lineCount = useMemo(() => {
    let count = 1;
    for (let i = 0; i < source.length; i++) {
      if (source.charCodeAt(i) === 10) count++;
    }
    return count;
  }, [source]);

  const deepLinkId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get(panelMode === "tutorial" ? "tutorial" : "challenge");
  }, [panelMode]);

  const commandPaletteOverlay = showCommandPalette && (
    <CommandPalette commands={paletteCommands} onClose={closeCommandPalette} />
  );

  const shortcutsOverlay = showShortcuts && (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => setShowShortcuts(false)}
    >
      <div
        ref={shortcutsDialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dialog-title"
        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="shortcuts-dialog-title" className="text-sm font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</h2>
          <button onClick={() => setShowShortcuts(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Close keyboard shortcuts">×</button>
        </div>
        <div className="space-y-2 text-xs">
          {[
            ["Ctrl+Enter", "Run code"],
            ["Ctrl+Shift+Enter", "Compile code"],
            ["Ctrl+Shift+D", "Dump AST"],
            ["Ctrl+S", "Share link"],
            ["Ctrl+L", "Clear output"],
            ["Ctrl+P", "Command palette"],
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

  const skipLink = (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:bg-[var(--accent)] focus:text-[var(--bg-primary)] focus:text-sm focus:font-medium focus:outline-none"
    >
      Skip to editor
    </a>
  );

  const idePanel = (
    <div className="h-full flex flex-col relative">
      {skipLink}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusAnnouncement}
      </div>
      {commandPaletteOverlay}
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
        onTargetChange={handleTargetChange}
        onRun={handleRun}
        onCompile={handleCompile}
        onDumpAST={handleDumpAST}
        onLoadCode={handleLoadCode}
        getCode={getCode}
        onShare={handleShare}
        onFormat={handleFormatCode}
        onTogglePanel={handleTogglePanel}
        panelMode={panelMode}
        status={status}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      <div className="flex-1 min-h-0 flex flex-col">
        <div id="main-content" className="flex-1 min-h-0 relative" tabIndex={-1}>
          <Editor
            ref={editorRef}
            value={source}
            onChange={setSource}
            onCursorChange={setCursorPos}
            fontSize={settings.fontSize}
            wordWrap={settings.wordWrap}
          />
          {status === "ready" && (
            <button
              type="button"
              onClick={handleRun}
              className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white opacity-70 hover:opacity-100 shadow-lg transition-opacity"
              aria-label="Run code"
              title="Run (Ctrl+Enter)"
            >
              ▶
            </button>
          )}
        </div>
        <OutputPanel output={output} errors={errors} ast={ast} onClear={clearOutput} />
      </div>
      <StatusBar
        status={status}
        compilerVersion={compilerVersion}
        buildManifest={buildManifest}
        target={target}
        cursorPosition={cursorPos}
        lineCount={lineCount}
        lastElapsedMs={lastElapsedMs}
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
      onLoadCode={handleLoadAndRun}
      onClose={closePanel}
      initialId={deepLinkId ?? undefined}
    />
  ) : (
    <ChallengePanel
      onLoadCode={handleLoadCode}
      onClose={closePanel}
      lastOutput={output}
      getCode={getCode}
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

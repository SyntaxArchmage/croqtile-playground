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
import { saveSource } from "@/lib/sourceStorage";
import { loadSettings, saveSettings, type EditorSettings } from "@/lib/settings";
import type { CursorPosition, EditorHandle, SelectionInfo } from "./Editor";
import { encodeCode } from "@/lib/urlCodec";
import { formatChoreoCode } from "@/lib/formatCode";
import { downloadCoSource } from "@/lib/fileIO";
import { CommandPalette, type CommandItem } from "./CommandPalette";
import { readInitialSource, readInitialPanelMode, getDeepLinkId } from "@/lib/playgroundInit";

const noop = () => () => {};

function isTypingContext(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return true;
  if (target.isContentEditable || target.contentEditable === "true") return true;
  return target.closest(".monaco-editor") !== null;
}

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

export function Playground() {
  const initialSource = useSyncExternalStore(noop, readInitialSource, () => EXAMPLES[0].code);
  const initialPanelMode = useSyncExternalStore(noop, readInitialPanelMode, () => "closed" as PanelMode);

  const [source, setSource] = useState(initialSource);
  const [lastSavedSource, setLastSavedSource] = useState(initialSource);
  const [target, setTarget] = useState(() => loadSettings().lastTarget);
  const [panelMode, setPanelMode] = useState(initialPanelMode);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ line: 1, column: 1 });
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [settings, setSettings] = useState(() => loadSettings());
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);
  const editorRef = useRef<EditorHandle>(null);
  const openFileRef = useRef<(() => void) | null>(null);
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
    setLastSavedSource(initialSource);
  }
  if (initialPanelMode !== prevInitPanel) {
    setPrevInitPanel(initialPanelMode);
    setPanelMode(initialPanelMode);
  }

  useEffect(() => {
    lastLoadedCodeRef.current = initialSource;
  }, [initialSource]);

  const { status, output, errors, ast, compilerVersion, buildManifest, elapsedMs, run, compile, dumpAST, clearOutput } =
    useChoreoWorker();

  const prevStatusRef = useRef(status);
  const prevOutputRef = useRef(output);
  const prevErrorsRef = useRef(errors);
  const prevAstRef = useRef(ast);

  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      saveSource(source);
      setLastSavedSource(source);
    }, 5000);
    return () => clearTimeout(timer);
  }, [source]);

  useEffect(() => {
    const flush = () => saveSource(source);
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
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

  const getCode = useCallback(() => editorRef.current?.getValue() ?? source, [source]);

  const skipLoadConfirmRef = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      skipLoadConfirmRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const confirmAndLoad = useCallback(
    (code: string): boolean => {
      const currentSource = editorRef.current?.getValue() ?? source;
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
    [source],
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
    saveSettings({ ...loadSettings(), ...s });
  }, []);

  const handleToggleTheme = useCallback(() => {
    handleSettingsChange({
      ...settingsRef.current,
      theme: settingsRef.current.theme === "light" ? "dark" : "light",
    });
  }, [handleSettingsChange]);

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

  const handleUndo = useCallback(() => {
    editorRef.current?.undo();
  }, []);

  const handleRedo = useCallback(() => {
    editorRef.current?.redo();
  }, []);

  const handleFind = useCallback(() => {
    editorRef.current?.find();
  }, []);

  const handleReplace = useCallback(() => {
    editorRef.current?.replace();
  }, []);

  const openCommandPalette = useCallback(() => {
    setShowCommandPalette(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setShowCommandPalette(false);
  }, []);

  const handleDownload = useCallback(() => {
    downloadCoSource(getCode());
  }, [getCode]);

  const paletteCommands = useMemo<CommandItem[]>(() => [
    { label: "Run Code", action: handleRun, shortcut: "Ctrl+Enter" },
    { label: "Compile Code", action: handleCompile, shortcut: "Ctrl+Shift+Enter" },
    { label: "Dump AST", action: handleDumpAST, shortcut: "Ctrl+Alt+D" },
    { label: "Share Link", action: handleShare, shortcut: "Ctrl+S" },
    { label: "Clear Output", action: clearOutput, shortcut: "Ctrl+L" },
    { label: "Toggle Theme", action: handleToggleTheme, shortcut: "Ctrl+Shift+T" },
    { label: "Undo", action: handleUndo, shortcut: "Ctrl+Z" },
    { label: "Redo", action: handleRedo, shortcut: "Ctrl+Shift+Z" },
    { label: "Find", action: handleFind, shortcut: "Ctrl+F" },
    { label: "Replace", action: handleReplace, shortcut: "Ctrl+H" },
    { label: "Open File", action: () => openFileRef.current?.() },
    { label: "Download Code", action: handleDownload },
    { label: "Format Code", action: handleFormatCode },
    { label: "Open Tutorial", action: () => handleTogglePanel("tutorial") },
    { label: "Open Challenges", action: () => handleTogglePanel("challenge") },
    { label: "Keyboard Shortcuts", action: () => setShowShortcuts(true), shortcut: "?" },
  ], [handleRun, handleCompile, handleDumpAST, handleShare, clearOutput, handleToggleTheme, handleUndo, handleRedo, handleFind, handleReplace, handleDownload, handleTogglePanel, handleFormatCode]);

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
      if ((e.ctrlKey || e.metaKey) && e.altKey && !e.shiftKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        handleDumpAST();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        clearOutput();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        handleToggleTheme();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !isTypingContext(e.target)) {
        setShowShortcuts((v) => !v);
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun, handleCompile, handleDumpAST, handleShare, clearOutput, handleToggleTheme]);

  const lineCount = useMemo(() => {
    let count = 1;
    for (let i = 0; i < source.length; i++) {
      if (source.charCodeAt(i) === 10) count++;
    }
    return count;
  }, [source]);

  const deepLinkId = useMemo(() => getDeepLinkId(panelMode), [panelMode]);

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
          <button onClick={() => setShowShortcuts(false)} className="flex items-center justify-center min-h-11 min-w-11 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Close keyboard shortcuts">×</button>
        </div>
        <div className="space-y-2 text-xs">
          {[
            ["Ctrl+Enter", "Run code"],
            ["Ctrl+Shift+Enter", "Compile code"],
            ["Ctrl+Alt+D", "Dump AST"],
            ["Ctrl+S", "Share link"],
            ["Ctrl+L", "Clear output"],
            ["Ctrl+Shift+T", "Toggle theme"],
            ["Ctrl+Z", "Undo"],
            ["Ctrl+Shift+Z", "Redo"],
            ["Ctrl+F", "Find in editor"],
            ["Ctrl+H", "Find and replace"],
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

  const closePanel = useCallback(() => {
    setPanelMode("closed");
    clearPanelParams();
  }, []);

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
        onOpenCommandPalette={openCommandPalette}
        openFileRef={openFileRef}
      />
      <div className="flex-1 min-h-0 flex flex-col">
        <div id="main-content" className="flex-1 min-h-0 relative" tabIndex={-1}>
          <Editor
            ref={editorRef}
            value={source}
            onChange={setSource}
            onCursorChange={setCursorPos}
            onSelectionChange={setSelection}
            fontSize={settings.fontSize}
            fontFamily={settings.fontFamily}
            wordWrap={settings.wordWrap}
            minimap={settings.minimap}
            tabSize={settings.tabSize}
            theme={settings.theme}
          />
          {status === "ready" && (
            <button
              type="button"
              onClick={handleRun}
              className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white opacity-70 hover:opacity-100 shadow-lg transition-opacity"
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
        selection={selection}
        elapsedMs={elapsedMs}
        hasUnsavedChanges={source !== lastSavedSource}
      />
    </div>
  );

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

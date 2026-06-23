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
import { exportProgress } from "@/lib/progressExport";
import { CommandPalette, type CommandItem } from "./CommandPalette";
import { ShortcutsDialog } from "./ShortcutsDialog";
import { readInitialSource, readInitialPanelMode, getDeepLinkId } from "@/lib/playgroundInit";

const noop = () => () => {};

const TUTORIAL_AUTO_RUN_DELAY_MS = 500;

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

  const sourceRef = useRef(source);
  useEffect(() => {
    sourceRef.current = source;
  }, [source]);
  useEffect(() => {
    const flush = () => saveSource(sourceRef.current);
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, []);

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
        }, TUTORIAL_AUTO_RUN_DELAY_MS);
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

  const panelModeChangedRef = useRef(false);
  const handleTogglePanel = useCallback((mode: PanelMode) => {
    panelModeChangedRef.current = true;
    setPanelMode((p) => (p === mode ? "closed" : mode));
  }, []);

  useEffect(() => {
    if (panelModeChangedRef.current && panelMode === "closed") {
      clearPanelParams();
    }
  }, [panelMode]);

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

  const handleGoToLine = useCallback(() => {
    const input = window.prompt("Go to line:");
    if (input === null) return;
    const line = parseInt(input, 10);
    if (!Number.isFinite(line) || line < 1) return;
    editorRef.current?.goToLine(line);
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
    { label: "Run Code", action: handleRun, shortcut: "Ctrl+Enter", category: "execution" },
    { label: "Compile Code", action: handleCompile, shortcut: "Ctrl+Shift+Enter", category: "execution" },
    { label: "Dump AST", action: handleDumpAST, shortcut: "Ctrl+Alt+D", category: "execution" },
    { label: "Share Link", action: handleShare, shortcut: "Ctrl+S", category: "navigation" },
    { label: "Clear Output", action: clearOutput, shortcut: "Ctrl+L", category: "view" },
    { label: "Toggle Theme", action: handleToggleTheme, shortcut: "Ctrl+Shift+T", category: "view" },
    { label: "Undo", action: handleUndo, shortcut: "Ctrl+Z", category: "editor" },
    { label: "Redo", action: handleRedo, shortcut: "Ctrl+Shift+Z", category: "editor" },
    { label: "Find", action: handleFind, shortcut: "Ctrl+F", category: "editor" },
    { label: "Replace", action: handleReplace, shortcut: "Ctrl+H", category: "editor" },
    { label: "Go to Line", action: handleGoToLine, shortcut: "Ctrl+G", category: "editor" },
    { label: "Open File", action: () => openFileRef.current?.(), category: "file" },
    { label: "Download Code", action: handleDownload, category: "file" },
    { label: "Format Code", action: handleFormatCode, category: "editor" },
    { label: "Open Tutorial", action: () => handleTogglePanel("tutorial"), category: "navigation" },
    { label: "Open Challenges", action: () => handleTogglePanel("challenge"), category: "navigation" },
    { label: "Export Progress", action: exportProgress, category: "file" },
    { label: "Keyboard Shortcuts", action: () => setShowShortcuts(true), shortcut: "?", category: "navigation" },
  ], [handleRun, handleCompile, handleDumpAST, handleShare, clearOutput, handleToggleTheme, handleUndo, handleRedo, handleFind, handleReplace, handleGoToLine, handleDownload, handleTogglePanel, handleFormatCode]);

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
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P" || e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === "g" || e.key === "G")) {
        e.preventDefault();
        handleGoToLine();
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
  }, [handleRun, handleCompile, handleDumpAST, handleShare, clearOutput, handleToggleTheme, handleGoToLine]);

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
    <ShortcutsDialog onClose={() => setShowShortcuts(false)} />
  );

  const skipLink = (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:bg-[var(--accent)] focus:text-[var(--bg-primary)] focus:text-sm focus:font-medium"
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
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 bg-[var(--bg-secondary)] border-b border-[var(--border)] text-sm text-[var(--text-muted)]" role="status" aria-live="polite">
          <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          Loading WASM compiler...
        </div>
      )}
      {status === "error" && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 bg-yellow-900/50 border-b border-yellow-700 text-sm text-yellow-200" role="alert" aria-live="polite">
          <span>⚠ WASM compiler unavailable — you can edit code but Run/Compile won&apos;t work.</span>
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
        <main id="main-content" className="flex-1 min-h-0 relative" tabIndex={-1}>
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
              <span aria-hidden="true">▶</span>
            </button>
          )}
        </main>
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
        panelMode={panelMode}
      />
    </div>
  );

  if (panelMode === "closed") {
    return <div className="playground-screen">{idePanel}</div>;
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
      <div className="playground-screen flex flex-col">
        <div className="w-full min-h-[30vh] max-h-[45vh] shrink-0 overflow-hidden border-b border-[var(--border)]">
          {contextPanel}
        </div>
        <div className="flex-1 min-h-0 w-full">{idePanel}</div>
      </div>
    );
  }

  return (
    <div className="playground-screen">
      <ResizableSplit left={contextPanel} right={idePanel} />
    </div>
  );
}

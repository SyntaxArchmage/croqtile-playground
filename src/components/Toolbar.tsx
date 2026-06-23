"use client";

import { useState, useCallback, useEffect, useRef, memo } from "react";
import type { WorkerStatus } from "@/lib/useChoreoWorker";
import type { PanelMode } from "@/lib/types";
import { EXAMPLES } from "@/lib/examples";

import { TUTORIALS } from "@/lib/tutorials";
import { CHALLENGES, getChallengeTags, ALL_TAGS, type ChallengeTag } from "@/lib/challenges";
import { getTutorialProgress, isChallengePassed, resetProgress } from "@/lib/progress";
import type { EditorSettings } from "@/lib/settings";
import { FONT_FAMILY_OPTIONS } from "@/lib/settings";
import {
  downloadCoSource,
  isAllowedOpenExtension,
  MAX_OPEN_FILE_BYTES,
  printCode,
} from "@/lib/fileIO";
import { exportProgress, importProgress } from "@/lib/progressExport";

interface Props {
  target: string;
  onTargetChange: (target: string) => void;
  onRun: () => void;
  onCompile: () => void;
  onDumpAST: () => void;
  onLoadCode: (code: string) => void;
  getCode: () => string;
  onShare: () => void;
  onFormat: () => void;
  onTogglePanel: (mode: PanelMode) => void;
  panelMode: PanelMode;
  status: WorkerStatus;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
  onOpenCommandPalette?: () => void;
  openFileRef?: React.MutableRefObject<(() => void) | null>;
}

export const Toolbar = memo(function Toolbar({
  target,
  onTargetChange,
  onRun,
  onCompile,
  onDumpAST,
  onLoadCode,
  getCode,
  onShare,
  onFormat,
  onTogglePanel,
  panelMode,
  status,
  settings,
  onSettingsChange,
  onOpenCommandPalette,
  openFileRef,
}: Props) {
  const busy = status === "running";
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [resetConfirmPending, setResetConfirmPending] = useState(false);
  const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetConfirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressInputRef = useRef<HTMLInputElement>(null);
  const fileMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  const getFocusableMenuItems = useCallback((menuEl: HTMLDivElement | null) => {
    if (!menuEl) return [];
    return Array.from(
      menuEl.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"]'),
    );
  }, []);

  const handleMenuKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLDivElement>,
      close: () => void,
      menuRef: React.RefObject<HTMLDivElement | null>,
    ) => {
      const items = getFocusableMenuItems(menuRef.current);
      if (items.length === 0) return;

      const focusedIndex = items.indexOf(document.activeElement as HTMLElement);

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          return;
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = focusedIndex >= 0 ? (focusedIndex + 1) % items.length : 0;
          items[nextIndex].focus();
          return;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex =
            focusedIndex >= 0 ? (focusedIndex - 1 + items.length) % items.length : items.length - 1;
          items[prevIndex].focus();
          return;
        }
        case "Home":
          e.preventDefault();
          items[0].focus();
          return;
        case "End":
          e.preventDefault();
          items[items.length - 1].focus();
          return;
      }
    },
    [getFocusableMenuItems],
  );

  const handleShareClick = useCallback(() => {
    onShare();
    setCopied(true);
    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
    }
    shareTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [onShare]);

  const handleDownload = useCallback(() => {
    downloadCoSource(getCode());
  }, [getCode]);

  const handlePrint = useCallback(() => {
    printCode();
  }, []);

  const clearResetConfirm = useCallback(() => {
    setResetConfirmPending(false);
    if (resetConfirmTimeoutRef.current) {
      clearTimeout(resetConfirmTimeoutRef.current);
      resetConfirmTimeoutRef.current = null;
    }
  }, []);

  const handleResetProgressClick = useCallback(() => {
    if (resetConfirmPending) {
      clearResetConfirm();
      resetProgress();
      setShowMenu(false);
      window.location.reload();
      return;
    }

    setResetConfirmPending(true);
    if (resetConfirmTimeoutRef.current) {
      clearTimeout(resetConfirmTimeoutRef.current);
    }
    resetConfirmTimeoutRef.current = setTimeout(() => {
      setResetConfirmPending(false);
      resetConfirmTimeoutRef.current = null;
    }, 3000);
  }, [resetConfirmPending, clearResetConfirm]);

  const handleOpenClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleExportProgress = useCallback(() => {
    exportProgress();
    setShowMenu(false);
  }, []);

  const handleImportProgressClick = useCallback(() => {
    progressInputRef.current?.click();
  }, []);

  const handleProgressImportChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".json")) {
        window.alert("Please select a .json progress export file.");
        return;
      }
      if (file.size > MAX_OPEN_FILE_BYTES) {
        window.alert(`File is too large (max ${MAX_OPEN_FILE_BYTES / (1024 * 1024)} MB).`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") return;
        try {
          const parsed = JSON.parse(reader.result);
          const result = importProgress(parsed);
          if (!result.ok) {
            window.alert(result.error);
            return;
          }
          setShowMenu(false);
          window.location.reload();
        } catch {
          window.alert("Could not parse the selected file as JSON.");
        }
      };
      reader.onerror = () => {
        window.alert("Could not read the selected file.");
      };
      reader.readAsText(file);
    },
    [],
  );

  useEffect(() => {
    if (!openFileRef) return;
    openFileRef.current = handleOpenClick;
    return () => {
      openFileRef.current = null;
    };
  }, [openFileRef, handleOpenClick]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      if (!isAllowedOpenExtension(file.name)) {
        window.alert("Please select a .co or .txt file.");
        return;
      }
      if (file.size > MAX_OPEN_FILE_BYTES) {
        window.alert(`File is too large (max ${MAX_OPEN_FILE_BYTES / (1024 * 1024)} MB).`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onLoadCode(reader.result);
      };
      reader.onerror = () => {
        window.alert("Could not read the selected file.");
      };
      reader.readAsText(file);
    },
    [onLoadCode],
  );

  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current);
      }
      if (resetConfirmTimeoutRef.current) {
        clearTimeout(resetConfirmTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showMenu) {
      clearResetConfirm();
    }
  }, [showMenu, clearResetConfirm]);

  useEffect(() => {
    if (!showFileMenu) return;
    const items = getFocusableMenuItems(fileMenuRef.current);
    items[0]?.focus();
  }, [showFileMenu, getFocusableMenuItems]);

  useEffect(() => {
    if (!showMenu) return;
    const items = getFocusableMenuItems(settingsMenuRef.current);
    items[0]?.focus();
  }, [showMenu, getFocusableMenuItems]);

  useEffect(() => {
    if (!showMenu && !showFileMenu) return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showMenu && !target?.closest("[data-settings-menu]")) {
        setShowMenu(false);
      }
      if (showFileMenu && !target?.closest("[data-file-menu]")) {
        setShowFileMenu(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showMenu, showFileMenu]);

  return (
    <nav className="flex flex-wrap items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0" aria-label="Playground toolbar">
      <button
        type="button"
        onClick={() => onTogglePanel("tutorial")}
        className={`flex items-center justify-center min-h-11 min-w-11 rounded transition-colors ${
          panelMode === "tutorial"
            ? "bg-[var(--accent)] text-[var(--bg-primary)]"
            : "hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"
        }`}
        title="Tutorial"
        aria-label="Toggle tutorial panel"
        aria-pressed={panelMode === "tutorial"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onTogglePanel("challenge")}
        className={`flex items-center justify-center min-h-11 min-w-11 rounded transition-colors ${
          panelMode === "challenge"
            ? "bg-[var(--accent)] text-[var(--bg-primary)]"
            : "hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"
        }`}
        title="Challenge"
        aria-label="Toggle challenge panel"
        aria-pressed={panelMode === "challenge"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      <span className="hidden sm:inline text-sm font-semibold text-[var(--accent)]">Croqtile</span>
      <span className="hidden md:inline text-xs text-[var(--text-muted)]">Playground</span>

      <div className="hidden sm:block w-px h-5 bg-[var(--border)] mx-2" />

      <select
        value={target}
        onChange={(e) => onTargetChange(e.target.value)}
        className="min-h-11 px-2 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
        aria-label="Compilation target"
      >
        <option value="cc">cc (C++ CPU)</option>
        <option value="cute">cute (CUDA)</option>
      </select>

      <button
        type="button"
        onClick={onRun}
        disabled={busy}
        className="min-h-11 px-3 text-xs font-medium rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
        title="Execute with mock interpreter (Ctrl+Enter)"
        aria-label="Run code"
      >
        ▶ Run
      </button>

      <button
        type="button"
        onClick={onCompile}
        disabled={busy}
        className="min-h-11 px-3 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        title="View generated C++/CUDA source code (Ctrl+Shift+Enter)"
        aria-label="Compile code"
      >
        <span className="hidden sm:inline">Compile</span>
        <span className="sm:hidden">⚙</span>
      </button>

      <button
        type="button"
        onClick={onDumpAST}
        disabled={busy}
        className="hidden md:inline-flex min-h-11 px-3 text-xs font-medium rounded border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border)] text-[var(--text-primary)] disabled:opacity-50 items-center"
        title="Print AST dump (Ctrl+Alt+D)"
        aria-label="Dump AST"
      >
        AST
      </button>

      <button
        type="button"
        onClick={handleShareClick}
        className={`min-h-11 px-3 text-xs font-medium rounded border transition-colors ${
          copied
            ? "border-green-600 bg-green-900/30 text-green-300"
            : "border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border)] text-[var(--text-primary)]"
        }`}
        title="Copy shareable link (Ctrl+S)"
        aria-label={copied ? "Link copied to clipboard" : "Share code"}
      >
        {copied ? (
          <>
            <span className="hidden sm:inline">Copied!</span>
            <span className="sm:hidden">✓</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Share</span>
            <span className="sm:hidden">🔗</span>
          </>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".co,.txt"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <input
        ref={progressInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleProgressImportChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="relative" data-file-menu>
        <button
          type="button"
          onClick={() => setShowFileMenu((v) => !v)}
          className="min-h-11 px-3 text-xs font-medium rounded border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border)] text-[var(--text-primary)]"
          aria-label="File menu"
          aria-haspopup="menu"
          aria-expanded={showFileMenu}
        >
          File ▾
        </button>
        {showFileMenu && (
          <div
            ref={fileMenuRef}
            role="menu"
            aria-label="File"
            className="absolute left-0 top-full mt-1 w-40 max-w-[calc(100vw-1rem)] rounded border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg z-50 py-1"
            onKeyDown={(e) => handleMenuKeyDown(e, () => setShowFileMenu(false), fileMenuRef)}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => { handleOpenClick(); setShowFileMenu(false); }}
              className="w-full text-left px-3 py-3 min-h-11 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              Open file...
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => { handleDownload(); setShowFileMenu(false); }}
              className="w-full text-left px-3 py-3 min-h-11 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              Download .co
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => { handlePrint(); setShowFileMenu(false); }}
              className="w-full text-left px-3 py-3 min-h-11 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              Print Code
            </button>
            <div role="separator" className="border-t border-[var(--border)] my-1" />
            <button
              type="button"
              role="menuitem"
              onClick={() => { onFormat(); setShowFileMenu(false); }}
              className="w-full text-left px-3 py-3 min-h-11 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              Format code
            </button>
            <div role="separator" className="xs:hidden border-t border-[var(--border)] my-1" />
            <div role="group" aria-label="Examples" className="xs:hidden">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  role="menuitem"
                  onClick={() => { onLoadCode(ex.code); setShowFileMenu(false); }}
                  className="w-full text-left px-3 py-3 min-h-11 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {onOpenCommandPalette && (
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="sm:hidden flex items-center justify-center min-h-11 min-w-11 rounded border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border)] text-[var(--text-primary)]"
          aria-label="Open command palette"
          title="Commands"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      )}

      <div className="hidden sm:block flex-1 min-w-0" />

      <div className="relative" data-settings-menu>
        <button
          type="button"
          onClick={() => setShowMenu((v) => !v)}
          className="flex items-center justify-center min-h-11 min-w-11 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors"
          title="Settings"
          aria-label="Settings menu"
          aria-haspopup="menu"
          aria-expanded={showMenu}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
        {showMenu && (
          <div
            ref={settingsMenuRef}
            role="menu"
            aria-label="Settings"
            className="absolute right-0 top-full mt-1 w-52 max-w-[calc(100vw-1rem)] rounded border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg z-50 py-1"
            onKeyDown={(e) => handleMenuKeyDown(e, () => setShowMenu(false), settingsMenuRef)}
          >
            <div role="none" className="px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Font size</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    if (settings.fontSize > 10) {
                      onSettingsChange({ ...settings, fontSize: settings.fontSize - 1 });
                    }
                  }}
                  disabled={settings.fontSize <= 10}
                  className="min-h-8 min-w-8 flex items-center justify-center rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs disabled:opacity-40 hover:bg-[var(--border)] transition-colors"
                  aria-label="Decrease font size"
                >
                  −
                </button>
                <span className="text-xs text-[var(--text-primary)] w-6 text-center tabular-nums" aria-hidden="true">
                  {settings.fontSize}
                </span>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    if (settings.fontSize < 24) {
                      onSettingsChange({ ...settings, fontSize: settings.fontSize + 1 });
                    }
                  }}
                  disabled={settings.fontSize >= 24}
                  className="min-h-8 min-w-8 flex items-center justify-center rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs disabled:opacity-40 hover:bg-[var(--border)] transition-colors"
                  aria-label="Increase font size"
                >
                  +
                </button>
              </div>
            </div>
            <div role="none" className="px-3 py-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-[var(--text-secondary)]">Font family</span>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => onSettingsChange({ ...settings, fontFamily: e.target.value })}
                  className="w-full min-h-8 px-2 text-xs rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  aria-label="Editor font family"
                >
                  {FONT_FAMILY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div role="none" className="px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Tab size</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    if (settings.tabSize > 2) {
                      onSettingsChange({ ...settings, tabSize: settings.tabSize - 1 });
                    }
                  }}
                  disabled={settings.tabSize <= 2}
                  className="min-h-8 min-w-8 flex items-center justify-center rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs disabled:opacity-40 hover:bg-[var(--border)] transition-colors"
                  aria-label="Decrease tab size"
                >
                  −
                </button>
                <span className="text-xs text-[var(--text-primary)] w-6 text-center tabular-nums" aria-hidden="true">
                  {settings.tabSize}
                </span>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    if (settings.tabSize < 8) {
                      onSettingsChange({ ...settings, tabSize: settings.tabSize + 1 });
                    }
                  }}
                  disabled={settings.tabSize >= 8}
                  className="min-h-8 min-w-8 flex items-center justify-center rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs disabled:opacity-40 hover:bg-[var(--border)] transition-colors"
                  aria-label="Increase tab size"
                >
                  +
                </button>
              </div>
            </div>
            <label role="menuitemcheckbox" aria-checked={settings.wordWrap} className="flex items-center justify-between px-3 py-2 hover:bg-[var(--bg-primary)] cursor-pointer transition-colors">
              <span className="text-xs text-[var(--text-secondary)]">Word wrap</span>
              <input
                type="checkbox"
                checked={settings.wordWrap}
                onChange={(e) => onSettingsChange({ ...settings, wordWrap: e.target.checked })}
                className="accent-[var(--accent)]"
                aria-label="Toggle word wrap"
                tabIndex={-1}
              />
            </label>
            <label role="menuitemcheckbox" aria-checked={settings.minimap} className="flex items-center justify-between px-3 py-2 hover:bg-[var(--bg-primary)] cursor-pointer transition-colors">
              <span className="text-xs text-[var(--text-secondary)]">Minimap</span>
              <input
                type="checkbox"
                checked={settings.minimap}
                onChange={(e) => onSettingsChange({ ...settings, minimap: e.target.checked })}
                className="accent-[var(--accent)]"
                aria-label="Toggle minimap"
                tabIndex={-1}
              />
            </label>
            <label role="menuitemcheckbox" aria-checked={settings.theme === "light"} className="flex items-center justify-between px-3 py-2 hover:bg-[var(--bg-primary)] cursor-pointer transition-colors">
              <span className="text-xs text-[var(--text-secondary)]">Light theme</span>
              <input
                type="checkbox"
                checked={settings.theme === "light"}
                onChange={(e) => onSettingsChange({ ...settings, theme: e.target.checked ? "light" : "dark" })}
                className="accent-[var(--accent)]"
                aria-label="Toggle light theme"
                tabIndex={-1}
              />
            </label>
            <div role="separator" className="border-t border-[var(--border)] my-1" />
            {(() => {
              const tc = TUTORIALS.filter((t) => getTutorialProgress(t.id) >= t.steps.length - 1).length;
              const cp = CHALLENGES.filter((c) => isChallengePassed(c.id)).length;

              const diffStats = { easy: { total: 0, passed: 0 }, medium: { total: 0, passed: 0 }, hard: { total: 0, passed: 0 } };
              const tagStats: Record<ChallengeTag, { total: number; passed: number }> = {} as Record<ChallengeTag, { total: number; passed: number }>;
              for (const tag of ALL_TAGS) tagStats[tag] = { total: 0, passed: 0 };
              for (const c of CHALLENGES) {
                const passed = isChallengePassed(c.id);
                diffStats[c.difficulty].total++;
                if (passed) diffStats[c.difficulty].passed++;
                for (const tag of getChallengeTags(c)) {
                  tagStats[tag].total++;
                  if (passed) tagStats[tag].passed++;
                }
              }

              const diffColors = { easy: "bg-green-500", medium: "bg-yellow-500", hard: "bg-red-500" };

              return (
                <div role="group" aria-label="Progress" className="px-3 py-2 space-y-2" data-testid="progress-section">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                      <span>Tutorials</span>
                      <span className="tabular-nums">{tc}/{TUTORIALS.length} completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--success)] transition-all" style={{ width: `${TUTORIALS.length ? (tc / TUTORIALS.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                      <span>Challenges</span>
                      <span className="tabular-nums">{cp}/{CHALLENGES.length} passed</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--success)] transition-all" style={{ width: `${CHALLENGES.length ? (cp / CHALLENGES.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">By Difficulty</span>
                    <div className="flex items-end gap-1 mt-1 h-8" data-testid="difficulty-chart">
                      {(["easy", "medium", "hard"] as const).map((d) => {
                        const pct = diffStats[d].total > 0 ? (diffStats[d].passed / diffStats[d].total) * 100 : 0;
                        return (
                          <div key={d} className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="w-full bg-[var(--bg-primary)] rounded-t overflow-hidden relative" style={{ height: "24px" }}>
                              <div
                                className={`absolute bottom-0 w-full ${diffColors[d]} transition-all rounded-t`}
                                style={{ height: `${pct}%` }}
                                title={`${d}: ${diffStats[d].passed}/${diffStats[d].total} (${Math.round(pct)}%)`}
                              />
                            </div>
                            <span className="text-[8px] text-[var(--text-muted)] tabular-nums">{d[0].toUpperCase()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">By Topic</span>
                    <div className="space-y-0.5 mt-1" data-testid="topic-chart">
                      {ALL_TAGS.filter((t) => tagStats[t].total > 0).slice(0, 6).map((tag) => {
                        const pct = tagStats[tag].total > 0 ? (tagStats[tag].passed / tagStats[tag].total) * 100 : 0;
                        return (
                          <div key={tag} className="flex items-center gap-1">
                            <span className="text-[8px] text-[var(--text-muted)] w-12 truncate text-right">{tag}</span>
                            <div className="flex-1 h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--accent)] transition-all rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[8px] text-[var(--text-muted)] tabular-nums w-6">{Math.round(pct)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
            <div role="separator" className="border-t border-[var(--border)] my-1" />
            <button
              type="button"
              role="menuitem"
              onClick={handleExportProgress}
              className="w-full text-left px-3 py-3 min-h-11 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              Export progress
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleImportProgressClick}
              className="w-full text-left px-3 py-3 min-h-11 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
            >
              Import progress
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleResetProgressClick}
              className={`w-full text-left px-3 py-3 min-h-11 text-xs transition-colors ${
                resetConfirmPending
                  ? "text-red-400 hover:bg-red-900/20 font-medium"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
              }`}
              aria-label={
                resetConfirmPending
                  ? "Confirm reset of all tutorial and challenge progress"
                  : "Reset all tutorial and challenge progress"
              }
            >
              {resetConfirmPending ? "Confirm?" : "Reset progress"}
            </button>
          </div>
        )}
      </div>

      <select
        onChange={(e) => {
          const ex = EXAMPLES.find((x) => x.id === e.target.value);
          if (ex) onLoadCode(ex.code);
          e.target.value = "";
        }}
        value=""
        className="hidden xs:inline-block min-h-11 px-2 text-xs rounded border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
        aria-label="Load example code"
      >
        <option value="" disabled>
          Examples...
        </option>
        {EXAMPLES.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>
    </nav>
  );
});

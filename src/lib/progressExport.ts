import { loadProgress, saveProgress, loadLastSource, saveLastSource } from "./progress";
import { loadSettings, saveSettings } from "./settings";
import { SOURCE_STORAGE_KEY } from "./sourceStorage";

export const PROGRESS_EXPORT_VERSION = 1;
export const PROGRESS_EXPORT_MIME = "application/json;charset=utf-8";

const PROGRESS_KEY = "croqtile-playground-progress";
const SETTINGS_KEY = "croqtile-playground-settings";

export interface ProgressExportPayload {
  version: number;
  exportedAt: string;
  progress: ReturnType<typeof loadProgress>;
  settings: ReturnType<typeof loadSettings>;
  lastSource: string | null;
}

export type ImportProgressResult =
  | { ok: true }
  | { ok: false; error: string };

export function buildProgressExport(): ProgressExportPayload {
  return {
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    progress: loadProgress(),
    settings: loadSettings(),
    lastSource: loadLastSource(),
  };
}

export function buildProgressExportFilename(now = new Date()): string {
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `croqtile-progress-${timestamp}.json`;
}

function normalizeViaStorage<T>(
  key: string,
  raw: unknown,
  loader: () => T,
  fallback: unknown,
): T {
  const prev = localStorage.getItem(key);
  try {
    localStorage.setItem(key, JSON.stringify(raw ?? fallback));
    return loader();
  } finally {
    if (prev === null) localStorage.removeItem(key);
    else localStorage.setItem(key, prev);
  }
}

export function validateProgressExport(raw: unknown): ProgressExportPayload | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  if (obj.version !== PROGRESS_EXPORT_VERSION) return null;
  if (typeof obj.exportedAt !== "string" || obj.exportedAt.length === 0) return null;
  if (typeof obj.progress !== "object" || obj.progress === null) return null;
  if (typeof obj.settings !== "object" || obj.settings === null) return null;
  if (obj.lastSource !== null && typeof obj.lastSource !== "string") return null;

  if (typeof window === "undefined") return null;

  const progress = normalizeViaStorage(PROGRESS_KEY, obj.progress, loadProgress, {});
  const settings = normalizeViaStorage(SETTINGS_KEY, obj.settings, loadSettings, {});

  return {
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: obj.exportedAt,
    progress,
    settings,
    lastSource: obj.lastSource as string | null,
  };
}

export function importProgress(raw: unknown): ImportProgressResult {
  const validated = validateProgressExport(raw);
  if (!validated) {
    return { ok: false, error: "Invalid progress export file." };
  }

  if (typeof window === "undefined") {
    return { ok: false, error: "Import is only available in the browser." };
  }

  try {
    saveProgress(validated.progress);
    saveSettings(validated.settings);
    if (validated.lastSource !== null) {
      saveLastSource(validated.lastSource);
    } else {
      localStorage.removeItem(SOURCE_STORAGE_KEY);
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to save imported progress." };
  }
}

export function exportProgress(): void {
  const payload = buildProgressExport();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: PROGRESS_EXPORT_MIME });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = buildProgressExportFilename();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

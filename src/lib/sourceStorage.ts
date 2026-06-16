export const SOURCE_STORAGE_KEY = "croqtile-playground-last-source";

export function saveSource(code: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SOURCE_STORAGE_KEY, code);
  } catch {
    // localStorage full or unavailable
  }
}

export function loadSavedSource(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SOURCE_STORAGE_KEY);
  } catch {
    return null;
  }
}

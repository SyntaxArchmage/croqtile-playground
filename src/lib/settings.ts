const STORAGE_KEY = "croqtile-playground-settings";

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  wordWrap: true,
};

function getDefault(): EditorSettings {
  return { ...DEFAULT_SETTINGS };
}

export function loadSettings(): EditorSettings {
  if (typeof window === "undefined") return getDefault();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefault();
    const parsed = JSON.parse(raw);
    const def = getDefault();
    let fontSize = def.fontSize;
    if (typeof parsed.fontSize === "number" && parsed.fontSize >= 10 && parsed.fontSize <= 24) {
      fontSize = parsed.fontSize;
    }
    const wordWrap = typeof parsed.wordWrap === "boolean" ? parsed.wordWrap : def.wordWrap;
    return { fontSize, wordWrap };
  } catch {
    return getDefault();
  }
}

export function saveSettings(s: EditorSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // localStorage full or unavailable
  }
}

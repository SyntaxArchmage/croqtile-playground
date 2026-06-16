const STORAGE_KEY = "croqtile-playground-settings";

export type Theme = "dark" | "light";

export const FONT_FAMILY_OPTIONS = [
  { label: "JetBrains Mono", value: "JetBrains Mono, monospace" },
  { label: "Fira Code", value: "Fira Code, monospace" },
  { label: "Source Code Pro", value: "Source Code Pro, monospace" },
  { label: "monospace", value: "monospace" },
] as const;

const ALLOWED_FONT_FAMILIES = new Set<string>(FONT_FAMILY_OPTIONS.map((o) => o.value));

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  wordWrap: boolean;
  minimap: boolean;
  tabSize: number;
  lastTarget: string;
  theme: Theme;
  outputLineNumbers: boolean;
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  fontFamily: "JetBrains Mono, monospace",
  wordWrap: false,
  minimap: false,
  tabSize: 2,
  lastTarget: "cc",
  theme: "dark",
  outputLineNumbers: false,
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
    const minimap = typeof parsed.minimap === "boolean" ? parsed.minimap : def.minimap;
    let tabSize = def.tabSize;
    if (typeof parsed.tabSize === "number" && parsed.tabSize >= 2 && parsed.tabSize <= 8) {
      tabSize = parsed.tabSize;
    }
    const lastTarget = typeof parsed.lastTarget === "string" && ["cc", "cute"].includes(parsed.lastTarget)
      ? parsed.lastTarget : def.lastTarget;
    const theme = parsed.theme === "light" || parsed.theme === "dark" ? parsed.theme : def.theme;
    const outputLineNumbers = typeof parsed.outputLineNumbers === "boolean"
      ? parsed.outputLineNumbers
      : def.outputLineNumbers;
    const fontFamily = typeof parsed.fontFamily === "string" && ALLOWED_FONT_FAMILIES.has(parsed.fontFamily)
      ? parsed.fontFamily
      : def.fontFamily;
    return { fontSize, fontFamily, wordWrap, minimap, tabSize, lastTarget, theme, outputLineNumbers };
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

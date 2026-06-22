const STORAGE_KEY = "croqtile-playground-settings";

export type Theme = "dark" | "light";

export const FONT_FAMILY_OPTIONS = [
  { label: "JetBrains Mono", value: "JetBrains Mono, monospace" },
  { label: "Fira Code", value: "Fira Code, monospace" },
  { label: "Source Code Pro", value: "Source Code Pro, monospace" },
  { label: "monospace", value: "monospace" },
] as const;

const ALLOWED_FONT_FAMILIES = new Set<string>(FONT_FAMILY_OPTIONS.map((o) => o.value));

export const VALID_TARGETS = ["cc", "cute"] as const;
export type CompilerTarget = (typeof VALID_TARGETS)[number];

export interface CompilerFlags {
  emitSource: boolean;
  dumpAst: boolean;
  noPreprocess: boolean;
  dropComments: boolean;
  noCodegen: boolean;
  semanticOnly: boolean;
  customFlags: string;
}

export const DEFAULT_COMPILER_FLAGS: CompilerFlags = {
  emitSource: true,
  dumpAst: false,
  noPreprocess: false,
  dropComments: false,
  noCodegen: false,
  semanticOnly: false,
  customFlags: "",
};

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  wordWrap: boolean;
  minimap: boolean;
  tabSize: number;
  lastTarget: CompilerTarget;
  theme: Theme;
  outputLineNumbers: boolean;
  compilerFlags: CompilerFlags;
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
  compilerFlags: { ...DEFAULT_COMPILER_FLAGS },
};

function getDefault(): EditorSettings {
  return { ...DEFAULT_SETTINGS };
}

function parseCompilerFlags(raw: unknown, def: CompilerFlags): CompilerFlags {
  if (!raw || typeof raw !== "object") return { ...def };
  const r = raw as Record<string, unknown>;
  const bool = (k: keyof CompilerFlags) =>
    typeof r[k] === "boolean" ? (r[k] as boolean) : def[k];
  return {
    emitSource: bool("emitSource") as boolean,
    dumpAst: bool("dumpAst") as boolean,
    noPreprocess: bool("noPreprocess") as boolean,
    dropComments: bool("dropComments") as boolean,
    noCodegen: bool("noCodegen") as boolean,
    semanticOnly: bool("semanticOnly") as boolean,
    customFlags: typeof r.customFlags === "string" ? r.customFlags : def.customFlags,
  };
}

export function buildFlagString(flags: CompilerFlags): string {
  const parts: string[] = [];
  if (flags.dumpAst) parts.push("-e");
  if (flags.noPreprocess) parts.push("-np");
  if (flags.dropComments) parts.push("-dc");
  if (flags.noCodegen) parts.push("-s");
  if (flags.semanticOnly) parts.push("-s");
  if (flags.customFlags.trim()) {
    parts.push(...flags.customFlags.trim().split(/\s+/));
  }
  return parts.join(" ");
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
    const lastTarget = typeof parsed.lastTarget === "string" && (VALID_TARGETS as readonly string[]).includes(parsed.lastTarget)
      ? (parsed.lastTarget as CompilerTarget) : def.lastTarget;
    const theme = parsed.theme === "light" || parsed.theme === "dark" ? parsed.theme : def.theme;
    const outputLineNumbers = typeof parsed.outputLineNumbers === "boolean"
      ? parsed.outputLineNumbers
      : def.outputLineNumbers;
    const fontFamily = typeof parsed.fontFamily === "string" && ALLOWED_FONT_FAMILIES.has(parsed.fontFamily)
      ? parsed.fontFamily
      : def.fontFamily;
    const compilerFlags = parseCompilerFlags(parsed.compilerFlags, def.compilerFlags);
    return { fontSize, fontFamily, wordWrap, minimap, tabSize, lastTarget, theme, outputLineNumbers, compilerFlags };
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

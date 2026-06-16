import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Detect macOS / iOS for modifier-key display (⌘ vs Ctrl). */
export function detectIsMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const platform = navigator.platform ?? "";
  const ua = navigator.userAgent ?? "";
  return /Mac|iPhone|iPad|iPod/.test(platform) || /Mac OS X/.test(ua);
}

export function useIsMac(): boolean {
  return useSyncExternalStore(noop, detectIsMac, () => false);
}

/** Render a shortcut string with platform-appropriate modifier symbols. */
export function formatShortcut(shortcut: string, isMac: boolean): string {
  if (!isMac) return shortcut;
  return shortcut
    .replace(/Ctrl\+/g, "⌘")
    .replace(/Shift\+/g, "⇧")
    .replace(/Alt\+/g, "⌥")
    .replace(/\+/g, "");
}

import { EXAMPLES } from "@/lib/examples";
import { loadLastSource } from "@/lib/progress";
import type { PanelMode } from "@/lib/types";
import { decodeCode } from "@/lib/urlCodec";

export function readInitialSource(): string {
  if (typeof window !== "undefined" && window.location.hash.length > 1) {
    return decodeCode(window.location.hash.slice(1));
  }
  if (typeof window !== "undefined") {
    const saved = loadLastSource();
    if (saved) return saved;
  }
  return EXAMPLES[0].code;
}

export function readInitialPanelMode(): PanelMode {
  if (typeof window === "undefined") return "closed";
  const params = new URLSearchParams(window.location.search);
  if (params.has("tutorial")) return "tutorial";
  if (params.has("challenge")) return "challenge";
  return "closed";
}

export function getDeepLinkId(panelMode: PanelMode): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(
    panelMode === "tutorial" ? "tutorial" : "challenge",
  );
}

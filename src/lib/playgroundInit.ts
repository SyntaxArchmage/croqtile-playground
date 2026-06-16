import { EXAMPLES, type Example } from "@/lib/examples";
import { loadSavedSource } from "@/lib/sourceStorage";
import type { PanelMode } from "@/lib/types";
import { decodeCode } from "@/lib/urlCodec";

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export function findExampleBySlug(slug: string): Example | undefined {
  return EXAMPLES.find((ex) => ex.id === slug || slugify(ex.name) === slug);
}

export function readInitialSource(): string {
  if (typeof window !== "undefined" && window.location.hash.length > 1) {
    return decodeCode(window.location.hash.slice(1));
  }
  if (typeof window !== "undefined") {
    const exampleSlug = new URLSearchParams(window.location.search).get("example");
    if (exampleSlug) {
      const example = findExampleBySlug(exampleSlug);
      if (example) return example.code;
    }
  }
  if (typeof window !== "undefined") {
    const saved = loadSavedSource();
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

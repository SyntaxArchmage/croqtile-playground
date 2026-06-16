export const CROQTILE_MIME = "text/plain;charset=utf-8";
export const MAX_OPEN_FILE_BYTES = 1024 * 1024;

const ALLOWED_OPEN_EXTENSIONS = [".co", ".txt"] as const;

const CO_FUNCTION_RE = /__co__\s+\w+\s+(\w+)\s*\(/;

export function isAllowedOpenExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_OPEN_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function extractCoFunctionName(code: string): string | null {
  const match = code.match(CO_FUNCTION_RE);
  return match?.[1] ?? null;
}

export function buildDownloadFilename(code: string, now = new Date()): string {
  const fn = extractCoFunctionName(code);
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return fn ? `${fn}-${timestamp}.co` : `croqtile-${timestamp}.co`;
}

export function downloadCoSource(code: string): void {
  const blob = new Blob([code], { type: CROQTILE_MIME });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = buildDownloadFilename(code);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

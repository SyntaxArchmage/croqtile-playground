function countBraces(line: string): { opens: number; closes: number } {
  let opens = 0;
  let closes = 0;
  let inString = false;
  let escape = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "/" && line[i + 1] === "/") break;
    if (ch === "{") opens++;
    else if (ch === "}") closes++;
  }
  return { opens, closes };
}

export function formatChoreoCode(code: string): string {
  const lines = code.split(/\r?\n/);
  let level = 0;
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      result.push("");
      continue;
    }

    const { opens, closes } = countBraces(trimmed);
    const indentLevel = Math.max(0, level - closes);
    result.push("  ".repeat(indentLevel) + trimmed);
    level = Math.max(0, level - closes + opens);
  }

  return result.join("\n");
}

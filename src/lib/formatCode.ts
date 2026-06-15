interface BraceResult {
  leadingCloses: number;
  netChange: number;
  inBlockComment: boolean;
}

function countBraces(line: string, inBlockComment: boolean): BraceResult {
  let depth = 0;
  let minDepth = 0;
  let inString = false;
  let inChar = false;
  let escape = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inBlockComment) {
      if (ch === "*" && line[i + 1] === "/") { inBlockComment = false; i++; }
      continue;
    }
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === "'" && !inString) { inChar = !inChar; continue; }
    if (ch === '"' && !inChar) { inString = !inString; continue; }
    if (inString || inChar) continue;
    if (ch === "/" && line[i + 1] === "/") break;
    if (ch === "/" && line[i + 1] === "*") { inBlockComment = true; i++; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth < minDepth) minDepth = depth; }
  }
  return { leadingCloses: -minDepth, netChange: depth, inBlockComment };
}

export function formatChoreoCode(code: string): string {
  const lines = code.split(/\r?\n/);
  let level = 0;
  let inBlockComment = false;
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      result.push("");
      continue;
    }

    const br = countBraces(trimmed, inBlockComment);
    inBlockComment = br.inBlockComment;
    const indentLevel = Math.max(0, level - br.leadingCloses);
    result.push("  ".repeat(indentLevel) + trimmed);
    level = Math.max(0, level + br.netChange);
  }

  return result.join("\n");
}

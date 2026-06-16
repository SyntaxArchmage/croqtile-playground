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

function shouldSplitAfterClose(line: string, closeIndex: number): boolean {
  let inBlockComment = false;
  let inString = false;
  let inChar = false;
  let escape = false;

  for (let i = closeIndex + 1; i < line.length; i++) {
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
    if (ch === " ") continue;
    if (ch === "/" && line[i + 1] === "/") return false;
    if (ch === "/" && line[i + 1] === "*") { inBlockComment = true; i++; continue; }
    if (ch === "}") return true;
    return false;
  }
  return false;
}

function splitSameLineCloseBraces(line: string, startInBlockComment: boolean): string[] {
  const parts: string[] = [];
  let current = "";
  let inBlockComment = startInBlockComment;
  let inString = false;
  let inChar = false;
  let escape = false;

  const flush = () => {
    if (current.length > 0) {
      parts.push(current);
      current = "";
    }
  };

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inBlockComment) {
      current += ch;
      if (ch === "*" && line[i + 1] === "/") {
        current += "/";
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === "\\") {
      current += ch;
      escape = true;
      continue;
    }
    if (ch === "'" && !inString) {
      current += ch;
      inChar = !inChar;
      continue;
    }
    if (ch === '"' && !inChar) {
      current += ch;
      inString = !inString;
      continue;
    }
    if (inString || inChar) {
      current += ch;
      continue;
    }
    if (ch === "/" && line[i + 1] === "/") {
      current += line.slice(i);
      break;
    }
    if (ch === "/" && line[i + 1] === "*") {
      current += "/*";
      inBlockComment = true;
      i++;
      continue;
    }
    if (ch === "}") {
      current += ch;
      if (shouldSplitAfterClose(line, i)) {
        flush();
        while (i + 1 < line.length && line[i + 1] === " ") {
          i++;
        }
      }
      continue;
    }
    current += ch;
  }

  flush();
  return parts.length > 1 ? parts : [line];
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

    const subLines = splitSameLineCloseBraces(trimmed, inBlockComment);
    for (let subLine of subLines) {
      subLine = subLine.trim();
      if (subLine === "") continue;
      const br = countBraces(subLine, inBlockComment);
      inBlockComment = br.inBlockComment;
      const indentLevel = Math.max(0, level - br.leadingCloses);
      result.push("  ".repeat(indentLevel) + subLine);
      level = Math.max(0, level + br.netChange);
    }
  }

  return result.join("\n");
}

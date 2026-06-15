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

    let indentLevel = level;
    if (trimmed.includes("}")) {
      indentLevel = Math.max(0, level - 1);
    }

    result.push("  ".repeat(indentLevel) + trimmed);

    for (const ch of trimmed) {
      if (ch === "{") level++;
      else if (ch === "}") level = Math.max(0, level - 1);
    }
  }

  return result.join("\n");
}

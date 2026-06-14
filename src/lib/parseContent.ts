export interface ContentPart {
  type: "text" | "code";
  content: string;
}

export function parseContent(content: string): ContentPart[] {
  const parts = content.split(/```(\w*)\n([\s\S]*?)```/);
  const result: ContentPart[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      if (parts[i]) {
        result.push({ type: "text", content: parts[i] });
      }
    } else if (i % 3 === 2) {
      result.push({ type: "code", content: parts[i] });
    }
  }
  return result;
}

import { parseContent } from "../lib/parseContent";

describe("parseContent", () => {
  it("returns text-only for plain content", () => {
    const result = parseContent("Hello world");
    expect(result).toEqual([{ type: "text", content: "Hello world" }]);
  });

  it("parses a fenced code block", () => {
    const input = "Some text\n\n```croqtile\nfoo();\n```\n\nMore text";
    const result = parseContent(input);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: "text", content: "Some text\n\n" });
    expect(result[1]).toEqual({ type: "code", content: "foo();\n" });
    expect(result[2]).toEqual({ type: "text", content: "\n\nMore text" });
  });

  it("handles multiple code blocks", () => {
    const input = "A\n```js\nalpha\n```\nB\n```py\nbeta\n```\nC";
    const result = parseContent(input);
    const codeBlocks = result.filter((p) => p.type === "code");
    expect(codeBlocks).toHaveLength(2);
    expect(codeBlocks[0].content).toBe("alpha\n");
    expect(codeBlocks[1].content).toBe("beta\n");
  });

  it("returns empty array for empty string", () => {
    expect(parseContent("")).toEqual([]);
  });

  it("handles content with no trailing text after code block", () => {
    const input = "Intro\n```c\ncode\n```";
    const result = parseContent(input);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("text");
    expect(result[1].type).toBe("code");
  });
});

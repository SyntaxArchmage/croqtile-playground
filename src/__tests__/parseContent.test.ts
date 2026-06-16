import { parseContent } from "../lib/parseContent";

describe("parseContent", () => {
  describe("plain text", () => {
    it("returns text-only for plain content", () => {
      const result = parseContent("Hello world");
      expect(result).toEqual([{ type: "text", content: "Hello world" }]);
    });

    it("returns empty array for empty string", () => {
      expect(parseContent("")).toEqual([]);
    });

    it("preserves whitespace-only content as text", () => {
      expect(parseContent("   \n\n  ")).toEqual([
        { type: "text", content: "   \n\n  " },
      ]);
    });
  });

  describe("fenced code blocks", () => {
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

    it("handles content with no trailing text after code block", () => {
      const input = "Intro\n```c\ncode\n```";
      const result = parseContent(input);
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe("text");
      expect(result[1].type).toBe("code");
    });

    it("parses code blocks with CRLF line endings", () => {
      const input = "Text\r\n```croqtile\r\nfoo();\r\n```\r\nMore";
      const result = parseContent(input);
      expect(result).toHaveLength(3);
      expect(result[1]).toEqual({ type: "code", content: "foo();\r\n" });
    });

    it("parses code blocks with extra spaces after language tag", () => {
      const input = "Text\n```croqtile  \nfoo();\n```\nMore";
      const result = parseContent(input);
      expect(result).toHaveLength(3);
      expect(result[1]).toEqual({ type: "code", content: "foo();\n" });
    });

    it("handles consecutive code blocks with no text between them", () => {
      const input = "```js\nalpha\n```\n```py\nbeta\n```";
      const result = parseContent(input);
      const codeBlocks = result.filter((p) => p.type === "code");
      expect(codeBlocks).toHaveLength(2);
      expect(codeBlocks[0].content).toBe("alpha\n");
      expect(codeBlocks[1].content).toBe("beta\n");
    });

    it("parses a code block with no language tag", () => {
      const input = "Before\n```\nplain code\n```\nAfter";
      const result = parseContent(input);
      expect(result[1]).toEqual({ type: "code", content: "plain code\n" });
    });

    it("parses an empty code block", () => {
      const input = "Intro\n```croqtile\n```\nOutro";
      const result = parseContent(input);
      expect(result[1]).toEqual({ type: "code", content: "" });
    });
  });

  describe("code-only content", () => {
    it("returns only code parts when content is a single fenced block", () => {
      const result = parseContent("```js\nalpha\n```");
      expect(result).toEqual([{ type: "code", content: "alpha\n" }]);
    });

    it("returns multiple code parts with newline text between consecutive blocks", () => {
      const result = parseContent("```a\n1\n```\n```b\n2\n```");
      expect(result).toEqual([
        { type: "code", content: "1\n" },
        { type: "text", content: "\n" },
        { type: "code", content: "2\n" },
      ]);
    });
  });

  describe("nested and inline markdown", () => {
    it("preserves inline backticks and bold markers in text", () => {
      const input = "Use `foo()` and **bold** here\n\n```js\nbar();\n```";
      const result = parseContent(input);
      expect(result[0]).toEqual({
        type: "text",
        content: "Use `foo()` and **bold** here\n\n",
      });
      expect(result[1]).toEqual({ type: "code", content: "bar();\n" });
    });

    it("keeps markdown-like syntax in text between code blocks", () => {
      const input = "# Heading\n\n```js\nx\n```\n\n- list item\n> quote";
      const result = parseContent(input);
      expect(result[0].content).toContain("# Heading");
      expect(result[2].content).toContain("- list item");
      expect(result[2].content).toContain("> quote");
    });

    it("does not treat inline triple backticks as a fenced block without a newline", () => {
      const input = "See ```inline``` example";
      expect(parseContent(input)).toEqual([
        { type: "text", content: "See ```inline``` example" },
      ]);
    });

    it("closes at the first triple-backtick sequence inside code", () => {
      const input = "Text\n```js\nconst s = \"```\";\nmore();\n```\nTail";
      const result = parseContent(input);
      expect(result[1]).toEqual({
        type: "code",
        content: 'const s = "',
      });
      expect(result[2].content).toContain("more();");
    });
  });

  describe("special characters", () => {
    it("preserves unicode in text and code", () => {
      const input = "Emoji 🚀\n```croqtile\nprintln(\"café\", \"日本語\");\n```";
      const result = parseContent(input);
      expect(result[0].content).toContain("🚀");
      expect(result[1].content).toContain("日本語");
    });

    it("preserves HTML-like characters without modification", () => {
      const input = "<script>alert('x')</script>\n```html\n<div>&amp;</div>\n```";
      const result = parseContent(input);
      expect(result[0].content).toContain("<script>");
      expect(result[1].content).toContain("&amp;");
    });

    it("preserves quotes, backslashes, and template-like syntax", () => {
      const input = 'Text with "double" and \'single\'\n```js\nconst x = `\\n${1}`;\n```';
      const result = parseContent(input);
      expect(result[0].content).toContain('"double"');
      expect(result[1].content).toContain("\\n${1}");
    });
  });

  describe("malformed markdown", () => {
    it("treats an unclosed fence as plain text", () => {
      const input = "Intro\n```js\nnever closed";
      expect(parseContent(input)).toEqual([
        { type: "text", content: "Intro\n```js\nnever closed" },
      ]);
    });

    it("treats a fence without newline after language tag as plain text", () => {
      const input = "```jscode here```";
      expect(parseContent(input)).toEqual([
        { type: "text", content: "```jscode here```" },
      ]);
    });

    it("treats a lone closing fence as plain text", () => {
      const input = "orphan ``` closing fence";
      expect(parseContent(input)).toEqual([
        { type: "text", content: "orphan ``` closing fence" },
      ]);
    });

    it("treats mismatched fence count as text plus partial blocks", () => {
      const input = "```js\nvalid\n```\n```py\ninvalid";
      const result = parseContent(input);
      expect(result).toEqual([
        { type: "code", content: "valid\n" },
        { type: "text", content: "\n```py\ninvalid" },
      ]);
    });

    it("does not parse fences that use tabs instead of newlines after tag", () => {
      const input = "```js\tcode\n```";
      expect(parseContent(input)).toEqual([
        { type: "text", content: "```js\tcode\n```" },
      ]);
    });
  });
});

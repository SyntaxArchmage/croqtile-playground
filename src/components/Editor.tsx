"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-[var(--text-muted)] text-sm">
      Loading editor...
    </div>
  ),
});

export interface CursorPosition {
  line: number;
  column: number;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onCursorChange?: (pos: CursorPosition) => void;
  fontSize?: number;
  wordWrap?: boolean;
}

function registerChoreoLanguage(monaco: any) {
  if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === "choreo")) return;

  monaco.languages.register({ id: "choreo" });
  monaco.languages.setMonarchTokensProvider("choreo", {
    keywords: [
      "auto", "bool", "break", "case", "char", "const", "continue", "default",
      "do", "double", "else", "enum", "extern", "float", "for", "goto", "if",
      "inline", "int", "long", "namespace", "new", "return", "short", "signed",
      "sizeof", "static", "struct", "switch", "template", "this", "throw", "try",
      "typedef", "typename", "union", "unsigned", "using", "virtual", "void",
      "volatile", "while", "true", "false", "nullptr", "std",
    ],
    choreoKeywords: [
      "__co__", "__cok__", "dma", "tma", "mma", "exec", "shared", "local",
      "global", "inthreads", "ingroups", "inblocks", "foreach", "pipeline",
      "event", "signal", "wait", "arrive", "println", "print", "assert_true",
      "parallel", "rotate",
    ],
    typeKeywords: [
      "f16", "f32", "f64", "bf16", "i8", "i16", "i32", "i64",
      "u8", "u16", "u32", "u64", "s8", "s16", "s32", "s64",
      "half", "size_t",
    ],
    operators: [
      "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=",
      "&&", "||", "++", "--", "+", "-", "*", "/", "&", "|", "^", "%",
      "<<", ">>", "+=", "-=", "*=", "/=",
    ],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4})/,
    tokenizer: {
      root: [
        [/__\w+__/, "keyword.choreo"],
        [/[a-z_$][\w$]*/, {
          cases: {
            "@choreoKeywords": "keyword.choreo",
            "@typeKeywords": "type",
            "@keywords": "keyword",
            "@default": "identifier",
          },
        }],
        [/[A-Z][\w$]*/, "type.identifier"],
        { include: "@whitespace" },
        [/[{}()[\]]/, "@brackets"],
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
        [/\d*\.\d+([eE][-+]?\d+)?[fFdD]?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+[lL]?/, "number"],
        [/[;,.]/, "delimiter"],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
        [/'[^\\']'/, "string"],
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],
      comment: [
        [/[^/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[/*]/, "comment"],
      ],
    },
  });

  monaco.editor.defineTheme("choreo-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword.choreo", foreground: "f38ba8", fontStyle: "bold" },
      { token: "type", foreground: "fab387" },
      { token: "type.identifier", foreground: "a6e3a1" },
      { token: "keyword", foreground: "89b4fa" },
      { token: "comment", foreground: "6c7086", fontStyle: "italic" },
      { token: "string", foreground: "a6e3a1" },
      { token: "number", foreground: "fab387" },
      { token: "operator", foreground: "89dceb" },
    ],
    colors: {
      "editor.background": "#1e1e2e",
      "editor.foreground": "#cdd6f4",
      "editorLineNumber.foreground": "#6c7086",
      "editorLineNumber.activeForeground": "#cdd6f4",
      "editor.selectionBackground": "#45475a",
      "editor.lineHighlightBackground": "#252537",
    },
  });

  monaco.languages.registerCompletionItemProvider("choreo", {
    provideCompletionItems: (model: unknown, position: unknown) => {
      const suggestions = [
        // Choreo-specific constructs
        ...["__co__", "__cok__", "parallel", "foreach", "pipeline", "dma", "tma", "mma",
          "shared", "global", "local", "println", "print", "inthreads", "ingroups",
          "signal", "wait", "arrive", "rotate", "assert_true",
        ].map(kw => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          detail: "Choreo keyword",
        })),
        // Types
        ...["f16", "f32", "f64", "bf16", "i8", "i16", "i32", "i64",
          "u8", "u16", "u32", "u64", "half", "size_t", "float", "int", "void",
        ].map(t => ({
          label: t,
          kind: monaco.languages.CompletionItemKind.TypeParameter,
          insertText: t,
          detail: "Choreo type",
        })),
        // Common snippets
        {
          label: "co-function",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "__co__ void ${1:func_name}() {\n  ${0}\n}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Croqtile function",
          documentation: "Creates a new Croqtile function",
        },
        {
          label: "parallel-block",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "parallel {${1:i}} by [${2:N}] {\n  ${0}\n}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Parallel block",
          documentation: "Creates a parallel execution block",
        },
        {
          label: "foreach-loop",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "foreach ${1:i} in [${2:0}:${3:N}] {\n  ${0}\n}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Foreach loop",
          documentation: "Creates a foreach loop",
        },
        {
          label: "dma-transfer",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "dma(${1:src}[${2:0}:${3:N}], ${4:dst}[${5:0}:${6:N}]);",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "DMA transfer",
          documentation: "Direct memory access transfer",
        },
      ];
      return { suggestions };
    },
  });

  const keywordDocs: Record<string, string> = {
    __co__: "Declares a Croqtile function entry point.",
    __cok__: "Declares a Croqtile kernel function.",
    parallel: "Execute a block across multiple threads. Syntax: parallel {idx} by [N] { ... }",
    foreach: "Sequential loop over a range. Syntax: foreach i in [start:end] { ... }",
    dma: "Direct Memory Access transfer. Syntax: dma(src[a:b], dst[c:d])",
    tma: "Tensor Memory Access operation.",
    mma: "Matrix Multiply-Accumulate operation.",
    pipeline: "Multi-stage execution pipeline.",
    println: "Print a value followed by a newline.",
    print: "Print a value without a newline.",
    inthreads: "Execute within thread context.",
    rotate: "Rotate data within a group.",
    shared: "Declare shared memory (accessible by all threads in a block).",
    global: "Declare global memory (accessible by all threads).",
    local: "Declare local/register memory (per-thread).",
    signal: "Signal an event for synchronization.",
    wait: "Wait for an event signal.",
    arrive: "Arrive at a synchronization barrier.",
  };

  monaco.languages.registerHoverProvider("choreo", {
    provideHover: (model: { getWordAtPosition: (p: unknown) => { word: string } | null }, position: unknown) => {
      const word = model.getWordAtPosition(position);
      if (word && keywordDocs[word.word]) {
        return {
          contents: [{ value: keywordDocs[word.word] }],
        };
      }
      return null;
    },
  });
}

export const Editor = forwardRef<{ getValue: () => string }, Props>(
  function Editor({ value, onChange, onCursorChange, fontSize = 14, wordWrap = true }, ref) {
    const editorRef = useRef<unknown>(null);

    useImperativeHandle(ref, () => ({
      getValue: () => {
        const editor = editorRef.current as { getValue?: () => string } | null;
        return editor?.getValue?.() ?? value;
      },
    }));

    return (
      <MonacoEditor
        height="100%"
        defaultLanguage="choreo"
        theme="choreo-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          registerChoreoLanguage(monaco);
          monaco.editor.setTheme("choreo-dark");
          if (onCursorChange) {
            const pos = editor.getPosition();
            if (pos) onCursorChange({ line: pos.lineNumber, column: pos.column });
            editor.onDidChangeCursorPosition((e: { position: { lineNumber: number; column: number } }) => {
              onCursorChange({ line: e.position.lineNumber, column: e.position.column });
            });
          }
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-[var(--bg-primary)]">
            <span className="text-sm text-[var(--text-muted)]">Loading editor...</span>
          </div>
        }
        options={{
          fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          lineNumbers: "on",
          renderLineHighlight: "line",
          bracketPairColorization: { enabled: true },
          tabSize: 2,
          insertSpaces: true,
          autoIndent: "full",
          formatOnPaste: true,
          matchBrackets: "always",
          automaticLayout: true,
          wordWrap: wordWrap ? "on" : "off",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
        }}
      />
    );
  }
);

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

interface Props {
  value: string;
  onChange: (value: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      "parallel",
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
}

export const Editor = forwardRef<{ getValue: () => string }, Props>(
  function Editor({ value, onChange }, ref) {
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
        }}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          lineNumbers: "on",
          renderLineHighlight: "line",
          bracketPairColorization: { enabled: true },
          tabSize: 2,
          automaticLayout: true,
        }}
      />
    );
  }
);

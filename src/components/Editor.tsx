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
        defaultLanguage="c"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={(editor) => { editorRef.current = editor; }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          lineNumbers: "on",
          renderLineHighlight: "line",
          bracketPairColorization: { enabled: true },
        }}
      />
    );
  }
);

"use client";

import { useState, useCallback, useRef } from "react";
import { Editor } from "./Editor";
import { Toolbar } from "./Toolbar";
import { OutputPanel } from "./OutputPanel";
import { StatusBar } from "./StatusBar";
import { useChoreoWorker } from "@/lib/useChoreoWorker";
import { EXAMPLES } from "@/lib/examples";

export function Playground() {
  const [source, setSource] = useState<string>(EXAMPLES[0].code);
  const [target, setTarget] = useState("cc");
  const editorRef = useRef<{ getValue: () => string }>(null);

  const { status, output, errors, compilerVersion, buildManifest, run, compile, dumpAST } =
    useChoreoWorker();

  const getCode = () => editorRef.current?.getValue() ?? source;

  const handleRun = useCallback(() => run(getCode()), [source, run]);
  const handleCompile = useCallback(() => compile(getCode(), target), [source, target, compile]);
  const handleDumpAST = useCallback(() => dumpAST(getCode()), [source, dumpAST]);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        target={target}
        onTargetChange={setTarget}
        onRun={handleRun}
        onCompile={handleCompile}
        onDumpAST={handleDumpAST}
        onLoadCode={setSource}
        status={status}
      />
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0">
          <Editor ref={editorRef} value={source} onChange={setSource} />
        </div>
        <OutputPanel output={output} errors={errors} />
      </div>
      <StatusBar
        status={status}
        compilerVersion={compilerVersion}
        buildManifest={buildManifest}
      />
    </div>
  );
}

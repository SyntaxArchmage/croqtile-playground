"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Editor } from "./Editor";
import { Toolbar } from "./Toolbar";
import { OutputPanel } from "./OutputPanel";
import { StatusBar } from "./StatusBar";
import { TutorialPanel } from "./TutorialPanel";
import { ChallengePanel } from "./ChallengePanel";
import { ResizableSplit } from "./ResizableSplit";
import { useChoreoWorker } from "@/lib/useChoreoWorker";
import { EXAMPLES } from "@/lib/examples";

export type PanelMode = "closed" | "tutorial" | "challenge";

export function Playground() {
  const [source, setSource] = useState<string>(EXAMPLES[0].code);
  const [target, setTarget] = useState("cc");
  const [panelMode, setPanelMode] = useState<PanelMode>("closed");
  const editorRef = useRef<{ getValue: () => string }>(null);

  const { status, output, errors, compilerVersion, buildManifest, run, compile, dumpAST } =
    useChoreoWorker();

  const getCode = useCallback(() => editorRef.current?.getValue() ?? source, [source]);

  const handleRun = useCallback(() => run(getCode()), [getCode, run]);
  const handleCompile = useCallback(() => compile(getCode(), target), [getCode, target, compile]);
  const handleDumpAST = useCallback(() => dumpAST(getCode()), [getCode, dumpAST]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  const idePanel = (
    <div className="h-full flex flex-col">
      <Toolbar
        target={target}
        onTargetChange={setTarget}
        onRun={handleRun}
        onCompile={handleCompile}
        onDumpAST={handleDumpAST}
        onLoadCode={setSource}
        onTogglePanel={(mode) => setPanelMode((p) => p === mode ? "closed" : mode)}
        panelMode={panelMode}
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

  if (panelMode === "closed") {
    return <div className="h-screen">{idePanel}</div>;
  }

  const leftPanel = panelMode === "tutorial" ? (
    <TutorialPanel
      onLoadCode={setSource}
      onClose={() => setPanelMode("closed")}
    />
  ) : (
    <ChallengePanel
      onLoadCode={setSource}
      onClose={() => setPanelMode("closed")}
      lastOutput={output}
    />
  );

  return (
    <div className="h-screen">
      <ResizableSplit left={leftPanel} right={idePanel} />
    </div>
  );
}

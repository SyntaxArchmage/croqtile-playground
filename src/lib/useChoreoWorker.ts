"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type WorkerStatus = "loading" | "ready" | "running" | "error";

export interface BuildManifest {
  version: string | null;
  commit: string | null;
  commit_short: string | null;
  built_at: string | null;
}

export type CommandType = "mockRun" | "compile" | "dumpAST";

export function useChoreoWorker() {
  const [status, setStatus] = useState<WorkerStatus>("loading");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState("");
  const [ast, setAst] = useState("");
  const [compilerVersion, setCompilerVersion] = useState<string | null>(null);
  const [buildManifest, setBuildManifest] = useState<BuildManifest | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const statusRef = useRef<WorkerStatus>("loading");
  const lastCommandRef = useRef<CommandType | null>(null);

  useEffect(() => {
    fetch("/wasm/build-manifest.json")
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then((m) => setBuildManifest(m))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const worker = new Worker("/wasm/choreo-worker.js");
    workerRef.current = worker;

    const updateStatus = (s: WorkerStatus) => {
      statusRef.current = s;
      setStatus(s);
    };

    worker.onmessage = (e) => {
      const { type, data } = e.data;
      switch (type) {
        case "ready":
          updateStatus("ready");
          if (data?.version) setCompilerVersion(data.version);
          break;
        case "compile-result":
          updateStatus("ready");
          if (lastCommandRef.current === "dumpAST") {
            setAst(data.output ?? "");
          } else {
            setOutput(data.output ?? "");
          }
          setErrors(data.errors ?? "");
          break;
        case "error":
          updateStatus("error");
          setErrors(data.message ?? "Unknown error");
          break;
      }
    };

    worker.onerror = () => {
      updateStatus("error");
      setErrors("Worker failed to initialize. WASM files may not be available.");
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const postIfReady = useCallback((msg: Record<string, unknown>, cmd: CommandType) => {
    if (!workerRef.current || statusRef.current === "loading" || statusRef.current === "error") return;
    lastCommandRef.current = cmd;
    statusRef.current = "running";
    setStatus("running");
    setErrors("");
    workerRef.current.postMessage(msg);
  }, []);

  const run = useCallback((source: string) => {
    postIfReady({ type: "mockRun", source }, "mockRun");
  }, [postIfReady]);

  const compile = useCallback((source: string, target: string) => {
    postIfReady({ type: "compile", source, target, flags: "" }, "compile");
  }, [postIfReady]);

  const dumpAST = useCallback((source: string) => {
    postIfReady({ type: "dumpAST", source }, "dumpAST");
  }, [postIfReady]);

  const clearOutput = useCallback(() => {
    setOutput("");
    setErrors("");
    setAst("");
  }, []);

  return { status, output, errors, ast, compilerVersion, buildManifest, run, compile, dumpAST, clearOutput };
}

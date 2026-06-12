"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type WorkerStatus = "loading" | "ready" | "running" | "error";

export interface BuildManifest {
  version: string | null;
  commit: string | null;
  commit_short: string | null;
  built_at: string | null;
}

export function useChoreoWorker() {
  const [status, setStatus] = useState<WorkerStatus>("loading");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState("");
  const [compilerVersion, setCompilerVersion] = useState<string | null>(null);
  const [buildManifest, setBuildManifest] = useState<BuildManifest | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    fetch("/wasm/build-manifest.json")
      .then((r) => r.json())
      .then((m) => setBuildManifest(m))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const worker = new Worker("/wasm/choreo-worker.js");
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, data } = e.data;
      switch (type) {
        case "ready":
          setStatus("ready");
          if (data?.version) setCompilerVersion(data.version);
          break;
        case "compile-result":
          setStatus("ready");
          setOutput(data.output ?? "");
          setErrors(data.errors ?? "");
          break;
        case "error":
          setStatus("error");
          setErrors(data.message ?? "Unknown error");
          break;
      }
    };

    worker.onerror = () => {
      setStatus("error");
      setErrors("Worker failed to initialize. WASM files may not be available.");
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const run = useCallback((source: string) => {
    if (!workerRef.current || status === "loading") return;
    setStatus("running");
    workerRef.current.postMessage({ type: "mockRun", source });
  }, [status]);

  const compile = useCallback((source: string, target: string) => {
    if (!workerRef.current || status === "loading") return;
    setStatus("running");
    workerRef.current.postMessage({ type: "compile", source, target, flags: "" });
  }, [status]);

  const dumpAST = useCallback((source: string) => {
    if (!workerRef.current || status === "loading") return;
    setStatus("running");
    workerRef.current.postMessage({ type: "dumpAST", source });
  }, [status]);

  return { status, output, errors, compilerVersion, buildManifest, run, compile, dumpAST };
}

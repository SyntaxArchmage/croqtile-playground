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

export const EXECUTION_TIMEOUT_MS = 30000;

function parseBuildManifest(raw: unknown): BuildManifest | null {
  if (typeof raw !== "object" || raw === null) return null;
  const m = raw as Record<string, unknown>;
  const strOrNull = (v: unknown): string | null => (typeof v === "string" ? v : null);
  return {
    version: strOrNull(m.version),
    commit: strOrNull(m.commit),
    commit_short: strOrNull(m.commit_short),
    built_at: strOrNull(m.built_at),
  };
}

export function useChoreoWorker() {
  const [status, setStatus] = useState<WorkerStatus>("loading");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState("");
  const [ast, setAst] = useState("");
  const [compilerVersion, setCompilerVersion] = useState<string | null>(null);
  const [buildManifest, setBuildManifest] = useState<BuildManifest | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const statusRef = useRef<WorkerStatus>("loading");
  const lastCommandRef = useRef<CommandType | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  useEffect(() => {
    fetch(`${basePath}/wasm/build-manifest.json`)
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then((m) => setBuildManifest(parseBuildManifest(m)))
      .catch(() => {});
  }, [basePath]);

  useEffect(() => {
    const INIT_TIMEOUT_MS = 5000;
    const worker = new Worker(`${basePath}/wasm/choreo-worker.js`);
    workerRef.current = worker;

    const updateStatus = (s: WorkerStatus) => {
      statusRef.current = s;
      setStatus(s);
    };

    const initTimeout = setTimeout(() => {
      if (statusRef.current === "loading") {
        updateStatus("error");
        setErrors("WASM compiler timed out. The .wasm file may not be built yet. You can still edit code.");
      }
    }, INIT_TIMEOUT_MS);

    worker.onmessage = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      const { type, data } = e.data;
      const payload = data && typeof data === "object" ? data : {};
      switch (type) {
        case "ready":
          clearTimeout(initTimeout);
          if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
          updateStatus("ready");
          if (typeof payload.version === "string") setCompilerVersion(payload.version);
          break;
        case "compile-result":
          if (statusRef.current !== "running") break;
          if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
          updateStatus("ready");
          setElapsedMs(Math.round(performance.now() - startTimeRef.current));
          if (lastCommandRef.current === "dumpAST") {
            setAst(typeof payload.output === "string" ? payload.output : "");
          } else {
            setOutput(typeof payload.output === "string" ? payload.output : "");
          }
          setErrors(typeof payload.errors === "string" ? payload.errors : "");
          break;
        case "error":
          clearTimeout(initTimeout);
          if (statusRef.current === "error") break;
          if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
          updateStatus("error");
          setErrors(
            typeof payload.message === "string"
              ? payload.message
              : "Unknown error"
          );
          break;
      }
    };

    worker.onerror = (e) => {
      clearTimeout(initTimeout);
      if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
      updateStatus("error");
      const ev = e as ErrorEvent;
      const nested =
        ev.error && typeof ev.error === "object" && "message" in ev.error
          ? String((ev.error as Error).message)
          : "";
      const msg = (typeof ev.message === "string" && ev.message) || nested;
      setErrors(
        msg || "Worker failed to initialize. WASM files may not be available."
      );
    };

    return () => {
      clearTimeout(initTimeout);
      worker.terminate();
      workerRef.current = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [basePath]);

  const postIfReady = useCallback((msg: Record<string, unknown>, cmd: CommandType) => {
    if (!workerRef.current || statusRef.current === "loading" || statusRef.current === "error") return;
    lastCommandRef.current = cmd;
    statusRef.current = "running";
    setStatus("running");
    setErrors("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      if (statusRef.current === "running") {
        statusRef.current = "ready";
        setStatus("ready");
        setElapsedMs(Math.round(performance.now() - startTimeRef.current));
        setErrors("Execution timed out after 30 seconds.");
      }
    }, EXECUTION_TIMEOUT_MS);
    startTimeRef.current = performance.now();
    workerRef.current.postMessage(msg);
  }, []);

  const run = useCallback((source: string, target: string = "cc") => {
    postIfReady({ type: "mockRun", source, target }, "mockRun");
  }, [postIfReady]);

  const compile = useCallback((source: string, target: string, flags: string = "") => {
    postIfReady({ type: "compile", source, target, flags }, "compile");
  }, [postIfReady]);

  const dumpAST = useCallback((source: string) => {
    postIfReady({ type: "dumpAST", source }, "dumpAST");
  }, [postIfReady]);

  const clearOutput = useCallback(() => {
    setOutput("");
    setErrors("");
    setAst("");
  }, []);

  return { status, output, errors, ast, compilerVersion, buildManifest, elapsedMs, run, compile, dumpAST, clearOutput };
}

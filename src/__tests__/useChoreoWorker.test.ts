/**
 * Unit tests for useChoreoWorker hook behavior with a mocked Web Worker.
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useChoreoWorker } from "@/lib/useChoreoWorker";

const EXECUTION_TIMEOUT_MS = 30000;

class MockWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  postMessage = jest.fn();
  terminate = jest.fn();
}

let mockWorker: MockWorker;

beforeEach(() => {
  mockWorker = new MockWorker();
  global.Worker = jest.fn(() => mockWorker) as unknown as typeof Worker;
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ version: "1.0.0", commit: null, commit_short: null, built_at: null }),
  });
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

function postWorkerMessage(type: string, data: Record<string, unknown> = {}) {
  act(() => {
    mockWorker.onmessage?.({ data: { type, data } } as MessageEvent);
  });
}

function makeReady() {
  postWorkerMessage("ready", { version: "2.1.0" });
}

function mockPerformanceNow(values: number[]) {
  let idx = 0;
  return jest.spyOn(performance, "now").mockImplementation(() => {
    const v = values[Math.min(idx, values.length - 1)];
    idx += 1;
    return v;
  });
}

describe("useChoreoWorker", () => {
  it("EXECUTION_TIMEOUT_MS constant value is 30000", () => {
    expect(EXECUTION_TIMEOUT_MS).toBe(30000);
  });

  describe("worker message state machine", () => {
    it("starts in loading state until ready message", () => {
      const { result } = renderHook(() => useChoreoWorker());
      expect(result.current.status).toBe("loading");

      makeReady();
      expect(result.current.status).toBe("ready");
      expect(result.current.compilerVersion).toBe("2.1.0");
    });

    it("handles ready without version field", () => {
      const { result } = renderHook(() => useChoreoWorker());
      postWorkerMessage("ready", {});
      expect(result.current.status).toBe("ready");
      expect(result.current.compilerVersion).toBeNull();
    });

    it("handles ready with undefined data", () => {
      const { result } = renderHook(() => useChoreoWorker());
      act(() => {
        mockWorker.onmessage?.({ data: { type: "ready" } } as MessageEvent);
      });
      expect(result.current.status).toBe("ready");
      expect(result.current.compilerVersion).toBeNull();
    });

    it("handles compile-result for run/compile commands", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => {
        result.current.run("source code");
      });
      expect(result.current.status).toBe("running");

      postWorkerMessage("compile-result", { output: "hello", errors: "" });
      expect(result.current.status).toBe("ready");
      expect(result.current.output).toBe("hello");
      expect(result.current.errors).toBe("");
    });

    it("handles compile-result with null output/errors fields", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();
      act(() => { result.current.run("code"); });
      postWorkerMessage("compile-result", {});
      expect(result.current.output).toBe("");
      expect(result.current.errors).toBe("");
    });

    it("handles error message with missing message field", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();
      postWorkerMessage("error", {});
      expect(result.current.errors).toBe("Unknown error");
    });

    it("routes compile-result to ast when last command was dumpAST", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => {
        result.current.dumpAST("fn main() {}");
      });
      postWorkerMessage("compile-result", { output: "(ast)", errors: "" });

      expect(result.current.ast).toBe("(ast)");
      expect(result.current.output).toBe("");
    });

    it("handles error message by transitioning to error state", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      postWorkerMessage("error", { message: "compile failed" });
      expect(result.current.status).toBe("error");
      expect(result.current.errors).toBe("compile failed");
    });

    it("handles worker onerror by transitioning to error state", () => {
      const { result } = renderHook(() => useChoreoWorker());
      act(() => {
        mockWorker.onerror?.({} as ErrorEvent);
      });
      expect(result.current.status).toBe("error");
      expect(result.current.errors).toBe("Worker failed to initialize. WASM files may not be available.");
    });

    it("handles worker onerror during loading before ready message", () => {
      const { result } = renderHook(() => useChoreoWorker());
      expect(result.current.status).toBe("loading");

      act(() => { mockWorker.onerror?.({} as ErrorEvent); });
      expect(result.current.status).toBe("error");
      expect(result.current.errors).toContain("Worker failed to initialize");

      act(() => { result.current.run("should not post"); });
      expect(mockWorker.postMessage).not.toHaveBeenCalled();
    });

    it("onerror clears execution timeout to prevent stale timeout firing", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();
      act(() => { result.current.run("test"); });
      expect(result.current.status).toBe("running");

      act(() => { mockWorker.onerror?.({} as ErrorEvent); });
      expect(result.current.status).toBe("error");

      act(() => { jest.advanceTimersByTime(EXECUTION_TIMEOUT_MS + 1000); });
      expect(result.current.status).toBe("error");
    });

    it("postIfReady rejects loading and error states", () => {
      const { result } = renderHook(() => useChoreoWorker());

      act(() => {
        result.current.run("should not post");
      });
      expect(mockWorker.postMessage).not.toHaveBeenCalled();

      makeReady();
      postWorkerMessage("error", { message: "broken" });

      act(() => {
        result.current.compile("src", "cc");
      });
      expect(mockWorker.postMessage).toHaveBeenCalledTimes(0);
    });

    it("times out after 30000ms and returns to ready with timeout error", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => {
        result.current.run("slow code");
      });
      expect(result.current.status).toBe("running");

      act(() => {
        jest.advanceTimersByTime(EXECUTION_TIMEOUT_MS - 1);
      });
      expect(result.current.status).toBe("running");

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(result.current.status).toBe("ready");
      expect(result.current.errors).toBe("Execution timed out after 30 seconds.");
      expect(result.current.elapsedMs).toBeGreaterThanOrEqual(0);
    });

    it("clears old timeout when running a second command", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => { result.current.run("first"); });
      act(() => { jest.advanceTimersByTime(10000); });

      act(() => { result.current.run("second"); });

      act(() => { jest.advanceTimersByTime(EXECUTION_TIMEOUT_MS - 10000); });
      expect(result.current.status).toBe("running");

      act(() => { jest.advanceTimersByTime(10000); });
      expect(result.current.status).toBe("ready");
      expect(result.current.errors).toBe("Execution timed out after 30 seconds.");
    });

    it("ignores worker messages with null, missing, or non-object data", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();
      act(() => { result.current.run("code"); });
      expect(result.current.status).toBe("running");

      act(() => {
        mockWorker.onmessage?.({ data: null } as MessageEvent);
      });
      expect(result.current.status).toBe("running");

      act(() => {
        mockWorker.onmessage?.({} as MessageEvent);
      });
      expect(result.current.status).toBe("running");

      act(() => {
        mockWorker.onmessage?.({ data: "not-an-object" } as MessageEvent);
      });
      expect(result.current.status).toBe("running");
    });

    it("ignores unknown message types without changing state", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();
      act(() => { result.current.run("code"); });
      expect(result.current.status).toBe("running");
      expect(result.current.output).toBe("");

      postWorkerMessage("unknown-type", { output: "ignored" });
      expect(result.current.status).toBe("running");
      expect(result.current.output).toBe("");

      postWorkerMessage("progress", { percent: 50 });
      expect(result.current.status).toBe("running");
    });

    it("ignores malformed message payloads missing type field", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => {
        mockWorker.onmessage?.({ data: { data: { output: "no type" } } } as MessageEvent);
      });
      expect(result.current.status).toBe("ready");
      expect(result.current.output).toBe("");
    });

    it("handles multiple rapid calls by posting each and resetting timeout", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => {
        result.current.run("first");
        result.current.run("second");
        result.current.compile("third", "cc");
      });

      expect(mockWorker.postMessage).toHaveBeenCalledTimes(3);
      expect(mockWorker.postMessage).toHaveBeenNthCalledWith(1, { type: "mockRun", source: "first" });
      expect(mockWorker.postMessage).toHaveBeenNthCalledWith(2, { type: "mockRun", source: "second" });
      expect(mockWorker.postMessage).toHaveBeenNthCalledWith(3, {
        type: "compile",
        source: "third",
        target: "cc",
        flags: "",
      });
      expect(result.current.status).toBe("running");

      act(() => { jest.advanceTimersByTime(15000); });
      expect(result.current.status).toBe("running");

      act(() => { jest.advanceTimersByTime(EXECUTION_TIMEOUT_MS); });
      expect(result.current.status).toBe("ready");
      expect(result.current.errors).toBe("Execution timed out after 30 seconds.");
    });

    it("last rapid command determines compile-result routing", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => {
        result.current.run("run-src");
        result.current.dumpAST("ast-src");
      });

      postWorkerMessage("compile-result", { output: "(ast tree)", errors: "" });
      expect(result.current.ast).toBe("(ast tree)");
      expect(result.current.output).toBe("");
    });

    it("clears errors when starting a new command after prior failure output", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => { result.current.run("code"); });
      postWorkerMessage("compile-result", { output: "", errors: "previous warning" });
      expect(result.current.errors).toBe("previous warning");

      act(() => { result.current.run("code again"); });
      expect(result.current.errors).toBe("");
      expect(result.current.status).toBe("running");
    });

    it("sets elapsedMs from compile-result using performance.now delta", () => {
      const nowSpy = mockPerformanceNow([1000, 1542.7]);

      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => { result.current.run("code"); });
      postWorkerMessage("compile-result", { output: "done", errors: "" });

      expect(result.current.elapsedMs).toBe(543);
      nowSpy.mockRestore();
    });

    it("sets elapsedMs on timeout using performance.now delta", () => {
      const nowSpy = mockPerformanceNow([2000, 2875.4]);

      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => { result.current.run("slow"); });
      act(() => { jest.advanceTimersByTime(EXECUTION_TIMEOUT_MS); });

      expect(result.current.elapsedMs).toBe(875);
      nowSpy.mockRestore();
    });

    it("clears pending timeout when compile-result arrives", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => {
        result.current.run("code");
      });
      act(() => {
        jest.advanceTimersByTime(EXECUTION_TIMEOUT_MS - 1000);
      });

      postWorkerMessage("compile-result", { output: "ok", errors: "" });
      expect(result.current.output).toBe("ok");

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(result.current.errors).toBe("");
    });
  });

  describe("cleanup", () => {
    it("terminates worker and clears pending timeout on unmount", () => {
      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
      const { result, unmount } = renderHook(() => useChoreoWorker());
      makeReady();
      act(() => { result.current.run("code"); });
      expect(result.current.status).toBe("running");

      unmount();
      expect(mockWorker.terminate).toHaveBeenCalledTimes(1);
      expect(clearTimeoutSpy).toHaveBeenCalled();

      act(() => { jest.advanceTimersByTime(EXECUTION_TIMEOUT_MS); });
      clearTimeoutSpy.mockRestore();
    });

    it("creates worker with expected script path", () => {
      renderHook(() => useChoreoWorker());
      expect(global.Worker).toHaveBeenCalledWith("/wasm/choreo-worker.js");
    });
  });

  describe("command posting", () => {
    it("compile posts compile message with target and empty flags", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => { result.current.compile("fn main() {}", "cc"); });
      expect(mockWorker.postMessage).toHaveBeenCalledWith({
        type: "compile",
        source: "fn main() {}",
        target: "cc",
        flags: "",
      });
    });

    it("dumpAST posts dumpAST message", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => { result.current.dumpAST("struct S {}"); });
      expect(mockWorker.postMessage).toHaveBeenCalledWith({
        type: "dumpAST",
        source: "struct S {}",
      });
    });
  });

  describe("dumpAST edge cases", () => {
    it("routes compile-result to ast with null output field", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();
      act(() => { result.current.dumpAST("code"); });
      postWorkerMessage("compile-result", {});
      expect(result.current.ast).toBe("");
    });
  });

  describe("timeout when status already changed", () => {
    it("no-ops if status changed from running before timeout fires", () => {
      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout").mockImplementation(() => {});

      const { result } = renderHook(() => useChoreoWorker());
      makeReady();
      act(() => { result.current.run("code"); });
      postWorkerMessage("error", { message: "crash" });
      expect(result.current.status).toBe("error");

      act(() => { jest.advanceTimersByTime(EXECUTION_TIMEOUT_MS); });
      expect(result.current.status).toBe("error");
      expect(result.current.errors).toBe("crash");

      clearTimeoutSpy.mockRestore();
    });
  });

  describe("clearOutput", () => {
    it("resets output, errors, and ast to empty strings", () => {
      const { result } = renderHook(() => useChoreoWorker());
      makeReady();

      act(() => {
        result.current.run("code");
      });
      postWorkerMessage("compile-result", { output: "hello", errors: "warn" });
      expect(result.current.output).toBe("hello");
      expect(result.current.errors).toBe("warn");

      act(() => {
        result.current.clearOutput();
      });
      expect(result.current.output).toBe("");
      expect(result.current.errors).toBe("");
      expect(result.current.ast).toBe("");
    });
  });

  describe("build manifest fetch", () => {
    it("loads build manifest when fetch succeeds", async () => {
      const { result } = renderHook(() => useChoreoWorker());
      await waitFor(() => {
        expect(result.current.buildManifest).toEqual({
          version: "1.0.0",
          commit: null,
          commit_short: null,
          built_at: null,
        });
      });
    });

    it("leaves buildManifest null when fetch fails", async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, statusText: "Not Found" });
      const { result } = renderHook(() => useChoreoWorker());
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
      expect(result.current.buildManifest).toBeNull();
    });
  });
});

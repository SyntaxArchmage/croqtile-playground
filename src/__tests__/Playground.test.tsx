import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockRun = jest.fn();
const mockCompile = jest.fn();
const mockDumpAST = jest.fn();
const mockClearOutput = jest.fn();
const mockLoadLastSource = jest.fn(() => null);
const defaultCompilerFlags = { emitSource: true, dumpAst: false, noPreprocess: false, dropComments: false, noCodegen: false, semanticOnly: false, architecture: "", customFlags: "" };
const mockLoadSettings = jest.fn(() => ({
  fontSize: 14,
  fontFamily: "JetBrains Mono, monospace",
  wordWrap: true,
  minimap: false,
  tabSize: 2,
  lastTarget: "cc",
  theme: "dark" as const,
  outputLineNumbers: false,
  compilerFlags: { ...defaultCompilerFlags },
  hasSeenWelcome: true,
}));
const mockSaveSettings = jest.fn();
let mockStatus: "ready" | "running" | "loading" | "error" = "ready";
let mockOutput = "";
let mockErrors = "";
let mockAst = "";

jest.mock("@/lib/useChoreoWorker", () => ({
  useChoreoWorker: () => ({
    status: mockStatus,
    output: mockOutput,
    errors: mockErrors,
    ast: mockAst,
    compilerVersion: "1.0.0",
    buildManifest: null,
    run: mockRun,
    compile: mockCompile,
    dumpAST: mockDumpAST,
    clearOutput: mockClearOutput,
  }),
}));

jest.mock("@/lib/progress", () => ({
  getTutorialProgress: () => -1,
  markTutorialStep: () => {},
  isChallengePassed: () => false,
  markChallengePassed: jest.fn(),
  getChallengeProgress: () => ({ status: "not_started", attempts: 0 }),
  recordChallengeAttempt: jest.fn(),
  resetProgress: jest.fn(),
  subscribeProgress: () => () => {},
  getProgressRevision: () => 0,
}));

jest.mock("@/lib/sourceStorage", () => ({
  saveSource: jest.fn(),
  loadSavedSource: (...args: unknown[]) => mockLoadLastSource(...args),
}));

jest.mock("@/lib/settings", () => ({
  ...jest.requireActual("@/lib/settings"),
  loadSettings: (...args: unknown[]) => mockLoadSettings(...args),
  saveSettings: (...args: unknown[]) => mockSaveSettings(...args),
}));

const mockDownloadCoSource = jest.fn();
jest.mock("@/lib/fileIO", () => ({
  ...jest.requireActual("@/lib/fileIO"),
  downloadCoSource: (...args: unknown[]) => mockDownloadCoSource(...args),
}));

let mockEditorProvidesRef = true;
let mockOmitToolbarOpenFileRef = false;
const mockEditorUndo = jest.fn();
const mockEditorRedo = jest.fn();
const mockEditorFind = jest.fn();
const mockEditorReplace = jest.fn();
const mockEditorGoToLine = jest.fn();
jest.mock("@/components/Toolbar", () => {
  const React = require("react") as typeof import("react");
  const actual = jest.requireActual<typeof import("@/components/Toolbar")>("@/components/Toolbar");
  return {
    ...actual,
    Toolbar: (props: React.ComponentProps<typeof actual.Toolbar>) => {
      if (mockOmitToolbarOpenFileRef) {
        const { openFileRef: _openFileRef, ...rest } = props;
        return React.createElement(actual.Toolbar, rest);
      }
      return React.createElement(actual.Toolbar, props);
    },
  };
});
jest.mock("@/components/Editor", () => ({
  Editor: React.forwardRef<
    { getValue: () => string; undo: () => void; redo: () => void; find: () => void; replace: () => void; goToLine: (line: number) => void },
    { value: string; onChange: (value: string) => void; fontSize?: number; wordWrap?: boolean; tabSize?: number; theme?: string }
  >(function MockEditor({ value, onChange, fontSize, wordWrap, tabSize, theme }, ref) {
    React.useImperativeHandle(ref, () => {
      if (!mockEditorProvidesRef) return null as unknown as { getValue: () => string; undo: () => void; redo: () => void; find: () => void; replace: () => void; goToLine: (line: number) => void };
      return {
        getValue: () => value,
        undo: mockEditorUndo,
        redo: mockEditorRedo,
        find: mockEditorFind,
        replace: mockEditorReplace,
        goToLine: mockEditorGoToLine,
      };
    });
    return (
      <textarea
        data-testid="code-editor"
        aria-label="Code editor"
        data-font-size={fontSize}
        data-word-wrap={wordWrap}
        data-tab-size={tabSize}
        data-theme={theme}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }),
}));

import { Playground } from "@/components/Playground";
import { EXAMPLES } from "@/lib/examples";

function mockMatchMedia(matches = false) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

function setUrl(url: string) {
  window.history.pushState(null, "", url);
}

function renderPlayground() {
  return render(<Playground />);
}

const originalConfirm = window.confirm.bind(window);
const originalPrompt = window.prompt.bind(window);
const originalAlert = window.alert.bind(window);
let originalClipboard: Clipboard | undefined;

function withFakeTimers(run: () => void | Promise<void>) {
  jest.useFakeTimers();
  return Promise.resolve(run()).finally(() => {
    jest.useRealTimers();
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockEditorProvidesRef = true;
  mockOmitToolbarOpenFileRef = false;
  mockStatus = "ready";
  mockOutput = "";
  mockErrors = "";
  mockAst = "";
  mockLoadLastSource.mockReturnValue(null);
  mockLoadSettings.mockReturnValue({ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "dark", outputLineNumbers: false, compilerFlags: { ...defaultCompilerFlags } });
  mockMatchMedia(false);
  setUrl("/");
  window.history.replaceState = jest.fn();
  document.title = "Croqtile Playground";
  window.confirm = jest.fn(() => true);
  originalClipboard = navigator.clipboard;
});

afterEach(() => {
  jest.useRealTimers();
  window.confirm = originalConfirm;
  window.prompt = originalPrompt;
  window.alert = originalAlert;
  Object.assign(navigator, { clipboard: originalClipboard });
  document.title = "Croqtile Playground";
});

function openCommandPalette() {
  fireEvent.keyDown(window, { key: "p", ctrlKey: true });
}

function runPaletteCommand(label: string) {
  openCommandPalette();
  fireEvent.change(screen.getByLabelText("Search commands"), {
    target: { value: label },
  });
  fireEvent.keyDown(screen.getByLabelText("Search commands"), { key: "Enter" });
}

async function flushInitialLoadConfirm() {
  await act(async () => {
    jest.runAllTimers();
  });
}

describe("Playground", () => {
  describe("initial rendering", () => {
    it("shows toolbar with branding and actions", () => {
      renderPlayground();
      expect(screen.getByText("Croqtile")).toBeInTheDocument();
      expect(screen.getByText("Playground")).toBeInTheDocument();
      expect(within(screen.getByLabelText("Playground toolbar")).getByLabelText("Run code")).toBeInTheDocument();
      expect(screen.getByLabelText("Playground toolbar")).toBeInTheDocument();
    });

    it("shows the code editor", () => {
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toBeInTheDocument();
      expect(screen.getByLabelText("Code editor")).toBeInTheDocument();
    });

    it("loads default example source when no hash or saved source", () => {
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[0].code);
    });
  });

  describe("hash code sharing", () => {
    it("decodes URL hash as initial source", () => {
      const sharedCode = '__co__ void shared() { println("from hash"); }';
      setUrl(`/#${encodeURIComponent(sharedCode)}`);
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(sharedCode);
    });

    it("prefers hash over saved source", () => {
      const hashCode = "__co__ void fromHash() {}";
      mockLoadLastSource.mockReturnValue("__co__ void fromStorage() {}");
      setUrl(`/#${encodeURIComponent(hashCode)}`);
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(hashCode);
    });

    it("falls back to saved source when hash is empty", () => {
      const savedCode = "__co__ void fromStorage() {}";
      mockLoadLastSource.mockReturnValue(savedCode);
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(savedCode);
    });

    it("loads example from ?example= slug on page load", () => {
      setUrl("/?example=hello-world");
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[0].code);
    });

    it("loads example by id via ?example=", () => {
      setUrl("/?example=parallel");
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[1].code);
    });

    it("prefers hash over ?example=", () => {
      const hashCode = "__co__ void fromHash() {}";
      mockLoadLastSource.mockReturnValue(null);
      setUrl(`/?example=parallel#${encodeURIComponent(hashCode)}`);
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(hashCode);
    });

    it("prefers ?example= over saved source", () => {
      mockLoadLastSource.mockReturnValue("__co__ void fromStorage() {}");
      setUrl("/?example=parallel");
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[1].code);
    });
  });

  describe("keyboard shortcuts", () => {
    it("dispatches run on Ctrl+Enter", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "Enter", ctrlKey: true });
      expect(mockRun).toHaveBeenCalledTimes(1);
    });

    it("dispatches compile on Ctrl+Shift+Enter", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "Enter", ctrlKey: true, shiftKey: true });
      expect(mockCompile).toHaveBeenCalledTimes(1);
    });

    it("dispatches dumpAST on Ctrl+Alt+D", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "D", ctrlKey: true, altKey: true });
      expect(mockDumpAST).toHaveBeenCalledTimes(1);
    });

    it("dispatches clearOutput on Ctrl+L", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "l", ctrlKey: true });
      expect(mockClearOutput).toHaveBeenCalledTimes(1);
    });

    it("dispatches run on Meta+Enter (macOS)", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "Enter", metaKey: true });
      expect(mockRun).toHaveBeenCalledTimes(1);
    });

    it("dispatches compile on Meta+Shift+Enter (macOS)", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "Enter", metaKey: true, shiftKey: true });
      expect(mockCompile).toHaveBeenCalledTimes(1);
    });

    it("dispatches dumpAST on Meta+Alt+D (macOS)", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "D", metaKey: true, altKey: true });
      expect(mockDumpAST).toHaveBeenCalledTimes(1);
    });

    it("toggles shortcuts overlay on ?", () => {
      renderPlayground();
      expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();

      fireEvent.keyDown(window, { key: "?" });
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
      expect(screen.getByText("Toggle this help")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "?" });
      expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();
    });

    it("closes shortcuts overlay on Escape", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();
    });

    it("ignores non-Tab keys in shortcuts dialog trap", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      const dialog = screen.getByRole("dialog");
      fireEvent.keyDown(dialog, { key: "ArrowDown" });
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
    });

    it("does not toggle shortcuts when ? is typed in an input", () => {
      renderPlayground();
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.focus();

      fireEvent.keyDown(input, { key: "?" });
      expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();

      document.body.removeChild(input);
    });

    it("does not toggle shortcuts when ? is typed in a contenteditable element", () => {
      renderPlayground();
      const editable = document.createElement("div");
      editable.contentEditable = "true";
      document.body.appendChild(editable);
      editable.focus();

      fireEvent.keyDown(editable, { key: "?" });
      expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();

      document.body.removeChild(editable);
    });

    it("does not toggle shortcuts when ? is typed inside monaco editor", () => {
      renderPlayground();
      const monacoHost = document.createElement("div");
      monacoHost.className = "monaco-editor";
      const inner = document.createElement("div");
      inner.className = "view-lines";
      monacoHost.appendChild(inner);
      document.body.appendChild(monacoHost);
      inner.focus();

      fireEvent.keyDown(inner, { key: "?" });
      expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();

      document.body.removeChild(monacoHost);
    });

    it("opens go to line prompt on Ctrl+G", () => {
      window.prompt = jest.fn(() => "10");
      renderPlayground();
      fireEvent.keyDown(window, { key: "g", ctrlKey: true });
      expect(window.prompt).toHaveBeenCalledWith("Go to line:");
      expect(mockEditorGoToLine).toHaveBeenCalledWith(10);
    });

    it("opens go to line prompt on Meta+G (macOS)", () => {
      window.prompt = jest.fn(() => "7");
      renderPlayground();
      fireEvent.keyDown(window, { key: "G", metaKey: true });
      expect(window.prompt).toHaveBeenCalledWith("Go to line:");
      expect(mockEditorGoToLine).toHaveBeenCalledWith(7);
    });

    it("does nothing when prompt is cancelled (null)", () => {
      window.prompt = jest.fn(() => null);
      renderPlayground();
      fireEvent.keyDown(window, { key: "g", ctrlKey: true });
      expect(window.prompt).toHaveBeenCalled();
      expect(mockEditorGoToLine).not.toHaveBeenCalled();
    });

    it("does nothing when prompt input is not a valid number", () => {
      window.prompt = jest.fn(() => "abc");
      renderPlayground();
      fireEvent.keyDown(window, { key: "g", ctrlKey: true });
      expect(window.prompt).toHaveBeenCalled();
      expect(mockEditorGoToLine).not.toHaveBeenCalled();
    });

    it("does nothing when prompt input is zero or negative", () => {
      window.prompt = jest.fn(() => "0");
      renderPlayground();
      fireEvent.keyDown(window, { key: "g", ctrlKey: true });
      expect(mockEditorGoToLine).not.toHaveBeenCalled();

      window.prompt = jest.fn(() => "-5");
      fireEvent.keyDown(window, { key: "g", ctrlKey: true });
      expect(mockEditorGoToLine).not.toHaveBeenCalled();
    });
  });

  describe("command palette", () => {
    it("opens command palette on Ctrl+P", () => {
      renderPlayground();
      expect(screen.queryByLabelText("Search commands")).not.toBeInTheDocument();

      fireEvent.keyDown(window, { key: "p", ctrlKey: true });
      expect(screen.getByLabelText("Search commands")).toBeInTheDocument();
      expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
    });

    it("executes Run from command palette", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });

      fireEvent.click(screen.getByText("Run Code"));
      expect(mockRun).toHaveBeenCalledTimes(1);
      expect(screen.queryByLabelText("Search commands")).not.toBeInTheDocument();
    });

    it("closes command palette on Escape", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });
      expect(screen.getByLabelText("Search commands")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByLabelText("Search commands")).not.toBeInTheDocument();
    });

    it("executes Download Code from command palette", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });

      fireEvent.click(screen.getByText("Download Code"));
      expect(mockDownloadCoSource).toHaveBeenCalledTimes(1);
      expect(mockDownloadCoSource).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("panel toggle", () => {
    it("opens tutorial panel when tutorial button is clicked", () => {
      renderPlayground();
      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      expect(screen.getByText("Tutorials")).toBeInTheDocument();
    });

    it("opens challenge panel when challenge button is clicked", () => {
      renderPlayground();
      fireEvent.click(screen.getByLabelText("Toggle challenge panel"));
      expect(screen.getByText("Challenges")).toBeInTheDocument();
    });

    it("closes tutorial panel when tutorial button is clicked again", () => {
      renderPlayground();
      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      expect(screen.getByText("Tutorials")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      expect(screen.queryByText("Tutorials")).not.toBeInTheDocument();
    });

    it("closes challenge panel when challenge button is clicked again", () => {
      renderPlayground();
      fireEvent.click(screen.getByLabelText("Toggle challenge panel"));
      expect(screen.getByText("Challenges")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Toggle challenge panel"));
      expect(screen.queryByText("Challenges")).not.toBeInTheDocument();
    });

    it("switches from tutorial to challenge panel", () => {
      renderPlayground();
      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      expect(screen.getByText("Tutorials")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Toggle challenge panel"));
      expect(screen.getByText("Challenges")).toBeInTheDocument();
      expect(screen.queryByText("Tutorials")).not.toBeInTheDocument();
    });

    it("closes tutorial panel when Open Tutorial palette command is toggled", () => {
      renderPlayground();
      runPaletteCommand("Open Tutorial");
      expect(screen.getByText("Tutorials")).toBeInTheDocument();

      runPaletteCommand("Open Tutorial");
      expect(screen.queryByText("Tutorials")).not.toBeInTheDocument();
    });

    it("clears panel query params when closing a panel", () => {
      setUrl("/?tutorial=ch01");
      renderPlayground();
      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("← Back")).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  describe("URL query params", () => {
    it("opens tutorial panel when ?tutorial= is present", () => {
      setUrl("/?tutorial=ch01");
      expect(window.location.search).toBe("?tutorial=ch01");
      renderPlayground();
      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("← Back")).toBeInTheDocument();
      expect(screen.getByText("The __co__ keyword")).toBeInTheDocument();
    });

    it("opens challenge panel when ?challenge= is present", () => {
      setUrl("/?challenge=c01");
      renderPlayground();
      expect(screen.getByLabelText("Toggle challenge panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("← Back")).toBeInTheDocument();
      expect(screen.getByText("Hello Threads")).toBeInTheDocument();
    });

    it("prefers tutorial over challenge when both params are present", () => {
      setUrl("/?tutorial=ch01&challenge=c01");
      renderPlayground();
      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("The __co__ keyword")).toBeInTheDocument();
      expect(screen.queryByText("Hello Threads")).not.toBeInTheDocument();
    });

    it("opens tutorial list when ?tutorial param has no id", () => {
      setUrl("/?tutorial");
      renderPlayground();
      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("Tutorials")).toBeInTheDocument();
    });
  });

  describe("run from toolbar", () => {
    it("calls run when Run button is clicked", () => {
      renderPlayground();
      const toolbar = screen.getByLabelText("Playground toolbar");
      fireEvent.click(within(toolbar).getByLabelText("Run code"));
      expect(mockRun).toHaveBeenCalledTimes(1);
    });
  });

  describe("floating run button", () => {
    it("shows floating run button when ready", () => {
      mockStatus = "ready";
      renderPlayground();
      expect(screen.getByTitle("Run (Ctrl+Enter)")).toBeInTheDocument();
    });

    it("hides floating run button when running", () => {
      mockStatus = "running";
      renderPlayground();
      expect(screen.queryByTitle("Run (Ctrl+Enter)")).not.toBeInTheDocument();
    });
  });

  describe("tutorial autorun", () => {
    it("auto-runs code loaded from tutorial panel", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await act(async () => {
          jest.runAllTimers();
        });

        fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
        mockRun.mockClear();

        fireEvent.click(screen.getByText("Hello Croqtile"));
        expect(mockRun).not.toHaveBeenCalled();

        act(() => {
          jest.advanceTimersByTime(500);
        });
        expect(mockRun).toHaveBeenCalledTimes(1);
        expect(mockRun).toHaveBeenCalledWith(
          expect.stringContaining('println("Hello from Croqtile!")'),
        );
      });
    });

    it("auto-runs code loaded from Try it button after 500ms", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await act(async () => { jest.runAllTimers(); });

        fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
        fireEvent.click(screen.getByText("Hello Croqtile"));
        fireEvent.click(screen.getByText("Next →"));
        mockRun.mockClear();

        fireEvent.click(screen.getByLabelText("Try this code example"));
        expect(mockRun).not.toHaveBeenCalled();

        act(() => { jest.advanceTimersByTime(499); });
        expect(mockRun).not.toHaveBeenCalled();

        act(() => { jest.advanceTimersByTime(1); });
        expect(mockRun).toHaveBeenCalledTimes(1);
        expect(mockRun).toHaveBeenCalledWith(
          expect.stringContaining('println("Hello,", "world!")'),
        );
      });
    });

    it("debounces load-and-run so only last timer fires", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await act(async () => { jest.runAllTimers(); });

        fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
        mockRun.mockClear();

        fireEvent.click(screen.getByText("Hello Croqtile"));
        act(() => { jest.advanceTimersByTime(250); });
        expect(mockRun).not.toHaveBeenCalled();

        act(() => { jest.advanceTimersByTime(250); });
        expect(mockRun).toHaveBeenCalledTimes(1);
      });
    });

    it("cancels pending load-and-run timer when a new tutorial step is loaded", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await act(async () => { jest.runAllTimers(); });

        fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
        mockRun.mockClear();

        fireEvent.click(screen.getByText("Hello Croqtile"));
        act(() => { jest.advanceTimersByTime(250); });

        fireEvent.click(screen.getByText("The __co__ keyword"));
        act(() => { jest.advanceTimersByTime(500); });

        expect(mockRun).toHaveBeenCalledTimes(1);
        expect(mockRun).toHaveBeenCalledWith(
          expect.stringContaining("__co__"),
        );
      });
    });
  });

  describe("tutorial autorun timer cleanup", () => {
    it("clears a pending timer before scheduling the next tutorial run", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await flushInitialLoadConfirm();

        fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
        fireEvent.click(screen.getByText("Hello Croqtile"));
        fireEvent.click(screen.getByText("Next →"));

        mockRun.mockClear();
        act(() => { jest.advanceTimersByTime(500); });
        expect(mockRun).toHaveBeenCalledTimes(1);
        expect(mockRun).toHaveBeenCalledWith(
          expect.stringContaining("printing()"),
        );
      });
    });
  });

  describe("share functionality", () => {
    it("dispatches share on Ctrl+S", () => {
      Object.assign(navigator, {
        clipboard: { writeText: jest.fn(() => Promise.resolve()) },
      });
      renderPlayground();
      fireEvent.keyDown(window, { key: "s", ctrlKey: true });
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(window.history.replaceState).toHaveBeenCalled();
    });

    it("still updates URL when clipboard API is unavailable", () => {
      Object.assign(navigator, { clipboard: undefined });
      renderPlayground();
      fireEvent.keyDown(window, { key: "s", ctrlKey: true });
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  describe("settings", () => {
    it("passes settings to editor", () => {
      mockLoadSettings.mockReturnValue({ fontSize: 18, wordWrap: false });
      renderPlayground();
      const editor = screen.getByTestId("code-editor");
      expect(editor).toHaveAttribute("data-font-size", "18");
      expect(editor).toHaveAttribute("data-word-wrap", "false");
    });
  });

  describe("mobile layout", () => {
    it("renders stacked layout on mobile without resizable split", () => {
      mockMatchMedia(true);
      setUrl("/?tutorial=ch01");
      renderPlayground();
      expect(screen.queryByLabelText("Resize panels")).not.toBeInTheDocument();
      expect(screen.getByText("The __co__ keyword")).toBeInTheDocument();
    });

    it("uses false SSR snapshot for mobile detection (useIsMobile)", () => {
      const serverSnapshots: Array<() => unknown> = [];
      const spy = jest.spyOn(React, "useSyncExternalStore").mockImplementation(
        (subscribe, getSnapshot, getServerSnapshot) => {
          if (getServerSnapshot) serverSnapshots.push(getServerSnapshot);
          return getSnapshot();
        },
      );

      renderPlayground();
      expect(serverSnapshots.some((fn) => fn() === false)).toBe(true);

      spy.mockRestore();
    });

    it("opens command palette from mobile toolbar button", () => {
      renderPlayground();
      fireEvent.click(screen.getByLabelText("Open command palette"));
      expect(screen.getByLabelText("Search commands")).toBeInTheDocument();
    });
  });

  describe("close panel from context panel", () => {
    it("closes panel and clears URL params when close button clicked", () => {
      setUrl("/?tutorial=ch01");
      renderPlayground();
      expect(screen.getByText("← Back")).toBeInTheDocument();
      const closeBtn = screen.getAllByLabelText("Close tutorials panel");
      fireEvent.click(closeBtn[0]);
      expect(screen.queryByText("← Back")).not.toBeInTheDocument();
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  describe("source persistence", () => {
    it("schedules saveSource after source changes", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        fireEvent.change(screen.getByTestId("code-editor"), {
          target: { value: "__co__ void edited() {}" },
        });
        act(() => {
          jest.advanceTimersByTime(5000);
        });
        const { saveSource } = jest.requireMock("@/lib/sourceStorage");
        expect(saveSource).toHaveBeenCalledWith("__co__ void edited() {}");
      });
    });

    it("flushes save on beforeunload", () => {
      renderPlayground();
      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: "__co__ void unsaved() {}" },
      });
      const { saveSource } = jest.requireMock("@/lib/sourceStorage");
      saveSource.mockClear();
      window.dispatchEvent(new Event("beforeunload"));
      expect(saveSource).toHaveBeenCalledWith("__co__ void unsaved() {}");
    });
  });

  describe("unsaved changes warning", () => {
    it("does not confirm when loading tutorial code on initial deep link", async () => {
      await withFakeTimers(async () => {
        const hashCode = '__co__ void fromHash() { println("hash"); }';
        setUrl(`/?tutorial=ch01#${encodeURIComponent(hashCode)}`);
        renderPlayground();
        await flushInitialLoadConfirm();
        expect(window.confirm).not.toHaveBeenCalled();
      });
    });

    it("confirms before loading example when source was modified", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await flushInitialLoadConfirm();
      });

      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: "__co__ void edited() {}" },
      });

      (window.confirm as jest.Mock).mockReturnValue(false);
      fireEvent.change(screen.getByLabelText("Load example code"), {
        target: { value: "parallel" },
      });

      expect(window.confirm).toHaveBeenCalledWith("You have unsaved changes. Load new code?");
      expect(screen.getByTestId("code-editor")).toHaveValue("__co__ void edited() {}");
    });

    it("loads example when user confirms overwrite", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await flushInitialLoadConfirm();
      });

      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: "__co__ void edited() {}" },
      });

      (window.confirm as jest.Mock).mockReturnValue(true);
      fireEvent.change(screen.getByLabelText("Load example code"), {
        target: { value: "parallel" },
      });

      expect(window.confirm).toHaveBeenCalled();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[1].code);
    });

    it("does not confirm when source is still the default example", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await flushInitialLoadConfirm();
      });

      fireEvent.change(screen.getByLabelText("Load example code"), {
        target: { value: "parallel" },
      });

      expect(window.confirm).not.toHaveBeenCalled();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[1].code);
    });

    it("does not confirm when loading code that matches current editor content", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await flushInitialLoadConfirm();
      });

      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: EXAMPLES[1].code },
      });

      fireEvent.change(screen.getByLabelText("Load example code"), {
        target: { value: "parallel" },
      });

      expect(window.confirm).not.toHaveBeenCalled();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[1].code);
    });

    it("does not run tutorial step when user rejects load confirmation", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        await flushInitialLoadConfirm();
      });

      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: "__co__ void edited() {}" },
      });

      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      (window.confirm as jest.Mock).mockReturnValue(false);
      mockRun.mockClear();

      fireEvent.click(screen.getByText("Hello Croqtile"));

      expect(window.confirm).toHaveBeenCalledWith("You have unsaved changes. Load new code?");
      expect(mockRun).not.toHaveBeenCalled();
      expect(screen.getByTestId("code-editor")).toHaveValue("__co__ void edited() {}");
    });
  });

  describe("target and settings callbacks", () => {
    it("saves settings when compilation target changes", () => {
      renderPlayground();
      const targetSelect = screen.getByLabelText("Compilation target");
      fireEvent.change(targetSelect, { target: { value: "cute" } });
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ lastTarget: "cute" })
      );
    });

    it("saves settings when font size is changed", () => {
      renderPlayground();
      fireEvent.click(screen.getByLabelText("Settings menu"));
      const increase = screen.getByLabelText("Increase font size");
      fireEvent.click(increase);
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ fontSize: 15 })
      );
    });
  });

  it("shows alert when clipboard write fails on share", async () => {
    const writeText = jest.fn().mockRejectedValue(new Error("denied"));
    Object.assign(navigator, { clipboard: { writeText } });
    window.alert = jest.fn();
    renderPlayground();

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "s", ctrlKey: true })
      );
    });
    await act(async () => { await Promise.resolve(); });

    expect(window.alert).toHaveBeenCalledWith(
      "Could not copy link. Try copying the URL manually."
    );
  });

  it("renders shortcuts overlay with keyboard shortcut descriptions", () => {
    renderPlayground();
    fireEvent.keyDown(window, { key: "?" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Run code")).toBeInTheDocument();
    expect(screen.getByText("Share link")).toBeInTheDocument();
    expect(screen.getByText("Undo")).toBeInTheDocument();
    expect(screen.getByText("Redo")).toBeInTheDocument();
    expect(screen.getByText("Find in editor")).toBeInTheDocument();
    expect(screen.getByText("Find and replace")).toBeInTheDocument();
  });

  it("traps focus within shortcuts dialog on Tab", () => {
    renderPlayground();
    fireEvent.keyDown(window, { key: "?" });
    const dialog = screen.getByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    expect(focusable.length).toBeGreaterThan(0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    (last as HTMLElement).focus();
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    (first as HTMLElement).focus();
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  describe("command palette", () => {
    it("runs a command from the palette", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });
      fireEvent.change(screen.getByLabelText("Search commands"), {
        target: { value: "Run" },
      });
      fireEvent.keyDown(screen.getByLabelText("Search commands"), { key: "Enter" });
      expect(mockRun).toHaveBeenCalled();
    });

    it("opens tutorial panel via palette command", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });
      fireEvent.change(screen.getByLabelText("Search commands"), {
        target: { value: "Open Tutorial" },
      });
      fireEvent.keyDown(screen.getByLabelText("Search commands"), { key: "Enter" });
      expect(screen.getByText("Tutorials")).toBeInTheDocument();
      expect(screen.getByText("Hello Croqtile")).toBeInTheDocument();
    });

    it("opens keyboard shortcuts via palette command", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });
      fireEvent.change(screen.getByLabelText("Search commands"), {
        target: { value: "Keyboard Shortcuts" },
      });
      fireEvent.keyDown(screen.getByLabelText("Search commands"), { key: "Enter" });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
    });

    it("wraps focus from last to first on Tab in shortcuts dialog", () => {
      renderPlayground();
      runPaletteCommand("Keyboard Shortcuts");
      const dialog = screen.getByRole("dialog");
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const last = focusable[focusable.length - 1];
      last.focus();
      fireEvent.keyDown(dialog, { key: "Tab" });
      expect(document.activeElement).toBe(focusable[0]);
    });

    it("wraps focus from first to last on Shift+Tab in shortcuts dialog", () => {
      renderPlayground();
      runPaletteCommand("Keyboard Shortcuts");
      const dialog = screen.getByRole("dialog");
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      first.focus();
      fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(focusable[focusable.length - 1]);
    });

    it("formats code via palette command", () => {
      renderPlayground();
      const editor = screen.getByTestId("code-editor");
      fireEvent.change(editor, { target: { value: "__co__ void f() {\nprintln(\"ok\");\n}" } });
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });
      fireEvent.change(screen.getByLabelText("Search commands"), {
        target: { value: "Format Code" },
      });
      fireEvent.keyDown(screen.getByLabelText("Search commands"), { key: "Enter" });
      expect(screen.getByTestId("code-editor")).toHaveValue(
        '__co__ void f() {\n  println("ok");\n}'
      );
    });

    it("undoes via palette command", () => {
      renderPlayground();
      runPaletteCommand("Undo");
      expect(mockEditorUndo).toHaveBeenCalledTimes(1);
    });

    it("redoes via palette command", () => {
      renderPlayground();
      runPaletteCommand("Redo");
      expect(mockEditorRedo).toHaveBeenCalledTimes(1);
    });

    it("finds via palette command", () => {
      renderPlayground();
      runPaletteCommand("Find");
      expect(mockEditorFind).toHaveBeenCalledTimes(1);
    });

    it("replaces via palette command", () => {
      renderPlayground();
      runPaletteCommand("Replace");
      expect(mockEditorReplace).toHaveBeenCalledTimes(1);
    });

    it("goes to line via palette command with valid input", () => {
      window.prompt = jest.fn(() => "5");
      renderPlayground();
      runPaletteCommand("Go to Line");
      expect(window.prompt).toHaveBeenCalledWith("Go to line:");
      expect(mockEditorGoToLine).toHaveBeenCalledWith(5);
    });

    it("does nothing when go to line prompt is cancelled", () => {
      window.prompt = jest.fn(() => null);
      renderPlayground();
      runPaletteCommand("Go to Line");
      expect(window.prompt).toHaveBeenCalledWith("Go to line:");
      expect(mockEditorGoToLine).not.toHaveBeenCalled();
    });

    it("does nothing when go to line prompt has invalid input", () => {
      window.prompt = jest.fn(() => "abc");
      renderPlayground();
      runPaletteCommand("Go to Line");
      expect(mockEditorGoToLine).not.toHaveBeenCalled();

      (window.prompt as jest.Mock).mockReturnValue("0");
      runPaletteCommand("Go to Line");
      expect(mockEditorGoToLine).not.toHaveBeenCalled();
    });

    it("go to line palette command tolerates missing editor ref", () => {
      window.prompt = jest.fn(() => "3");
      mockEditorProvidesRef = false;
      renderPlayground();
      expect(() => runPaletteCommand("Go to Line")).not.toThrow();
      expect(mockEditorGoToLine).not.toHaveBeenCalled();
    });

    it("undo and redo palette commands tolerate missing editor ref", () => {
      mockEditorProvidesRef = false;
      renderPlayground();
      expect(() => {
        runPaletteCommand("Undo");
        runPaletteCommand("Redo");
      }).not.toThrow();
    });

    it("find and replace palette commands tolerate missing editor ref", () => {
      mockEditorProvidesRef = false;
      renderPlayground();
      expect(() => {
        runPaletteCommand("Find");
        runPaletteCommand("Replace");
      }).not.toThrow();
    });

    it("opens challenges via palette command", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });
      fireEvent.change(screen.getByLabelText("Search commands"), {
        target: { value: "Open Challenges" },
      });
      fireEvent.keyDown(screen.getByLabelText("Search commands"), { key: "Enter" });
      expect(screen.getByText("Challenges")).toBeInTheDocument();
    });

    it("clears output via palette command", () => {
      renderPlayground();
      runPaletteCommand("Clear Output");
      expect(mockClearOutput).toHaveBeenCalledTimes(1);
    });

    it("compiles code via palette command", () => {
      renderPlayground();
      runPaletteCommand("Compile Code");
      expect(mockCompile).toHaveBeenCalledTimes(1);
    });

    it("dumps AST via palette command", () => {
      renderPlayground();
      runPaletteCommand("Dump AST");
      expect(mockDumpAST).toHaveBeenCalledTimes(1);
    });

    it("shares link via palette command", () => {
      Object.assign(navigator, {
        clipboard: { writeText: jest.fn(() => Promise.resolve()) },
      });
      renderPlayground();
      runPaletteCommand("Share Link");
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(window.history.replaceState).toHaveBeenCalled();
    });

    it("toggles theme via palette command", () => {
      renderPlayground();
      runPaletteCommand("Toggle Theme");
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ theme: "light" }),
      );
    });

    it("executes Open File from command palette when open handler is registered", () => {
      renderPlayground();
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = jest.spyOn(input, "click");
      runPaletteCommand("Open File");
      expect(clickSpy).toHaveBeenCalledTimes(1);
      clickSpy.mockRestore();
    });

    it("handles Open File from command palette when no open handler is registered", () => {
      mockOmitToolbarOpenFileRef = true;
      renderPlayground();
      expect(() => runPaletteCommand("Open File")).not.toThrow();
      expect(screen.queryByLabelText("Search commands")).not.toBeInTheDocument();
    });
  });

  describe("WASM status overlays", () => {
    it("shows loading overlay when status is loading", () => {
      mockStatus = "loading";
      renderPlayground();
      expect(screen.getByText("Loading WASM compiler...")).toBeInTheDocument();
    });

    it("shows error banner when status is error", () => {
      mockStatus = "error";
      renderPlayground();
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/WASM compiler unavailable/)).toBeInTheDocument();
    });
  });

  describe("status announcements", () => {
    it("announces running status in sr-only live region", () => {
      mockStatus = "ready";
      const { rerender } = renderPlayground();

      const liveRegion = document.querySelector('.sr-only[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute("aria-atomic", "true");

      mockStatus = "running";
      rerender(<Playground />);

      expect(liveRegion).toHaveTextContent("Running code");
    });

    it("announces run finished with errors", () => {
      mockStatus = "running";
      const { rerender } = renderPlayground();
      const liveRegion = document.querySelector('.sr-only[aria-live="polite"]');

      mockStatus = "ready";
      mockOutput = "some output";
      mockErrors = "some error";
      rerender(<Playground />);

      expect(liveRegion).toHaveTextContent("Run finished with errors");
    });

    it("announces run finished with output available (no errors)", () => {
      mockStatus = "running";
      const { rerender } = renderPlayground();
      const liveRegion = document.querySelector('.sr-only[aria-live="polite"]');

      mockStatus = "ready";
      mockOutput = "Hello from thread 0";
      mockErrors = "";
      rerender(<Playground />);

      expect(liveRegion).toHaveTextContent("Run finished. Output is available");
    });

    it("announces errors found when only errors change", () => {
      mockStatus = "ready";
      const { rerender } = renderPlayground();
      const liveRegion = document.querySelector('.sr-only[aria-live="polite"]');

      mockErrors = "compilation error";
      rerender(<Playground />);

      expect(liveRegion).toHaveTextContent("Errors found");
    });

    it("announces AST dump ready", () => {
      mockStatus = "ready";
      const { rerender } = renderPlayground();
      const liveRegion = document.querySelector('.sr-only[aria-live="polite"]');

      mockAst = "AST output here";
      rerender(<Playground />);

      expect(liveRegion).toHaveTextContent("AST dump ready");
    });
  });

  describe("shortcuts dialog", () => {
    it("closes shortcuts dialog on backdrop click", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();

      const backdrop = screen.getByRole("dialog").parentElement!;
      fireEvent.click(backdrop);
      expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();
    });

    it("does not close when clicking inside the dialog", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("dialog"));
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
    });

    it("closes via the close button", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Close keyboard shortcuts"));
      expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();
    });

    it("restores focus to the previously focused element on close", () => {
      const trigger = document.createElement("button");
      trigger.textContent = "Before dialog";
      document.body.appendChild(trigger);
      trigger.focus();

      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(document.activeElement).toBe(trigger);

      document.body.removeChild(trigger);
    });

    it("focuses the first focusable element when shortcuts dialog opens", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      const dialog = screen.getByRole("dialog");
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      expect(focusable.length).toBeGreaterThan(0);
      expect(document.activeElement).toBe(focusable[0]);
    });

    it("ignores Tab wrap when focus is not on the last focusable element", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      const dialog = screen.getByRole("dialog");
      const middle = document.createElement("button");
      middle.textContent = "Middle";
      dialog.appendChild(middle);

      middle.focus();
      expect(document.activeElement).toBe(middle);
      fireEvent.keyDown(dialog, { key: "Tab" });
      expect(document.activeElement).not.toBe(screen.getByLabelText("Close keyboard shortcuts"));
    });

    it("ignores Shift+Tab wrap when focus is not on the first focusable element", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      const dialog = screen.getByRole("dialog");
      const middle = document.createElement("button");
      middle.textContent = "Middle";
      dialog.insertBefore(middle, dialog.firstChild);

      middle.focus();
      fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(middle);
    });

    it("ignores non-Tab keys in shortcuts dialog focus trap", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      const dialog = screen.getByRole("dialog");
      fireEvent.keyDown(dialog, { key: "ArrowDown" });
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
    });

    it("ignores Tab when shortcuts dialog has no focusable elements", () => {
      const originalQuerySelectorAll = Element.prototype.querySelectorAll;
      Element.prototype.querySelectorAll = function (this: Element, selector: string) {
        if (this.getAttribute?.("role") === "dialog" && selector.includes("tabindex")) {
          return [] as unknown as NodeListOf<Element>;
        }
        return originalQuerySelectorAll.call(this, selector);
      };

      try {
        renderPlayground();
        fireEvent.keyDown(window, { key: "?" });
        const dialog = screen.getByRole("dialog");
        fireEvent.keyDown(dialog, { key: "Tab" });
        expect(document.activeElement).not.toBeNull();
      } finally {
        Element.prototype.querySelectorAll = originalQuerySelectorAll;
      }
    });

    it("cleans up shortcuts listeners when playground unmounts with dialog open", () => {
      const removeListenerSpy = jest.spyOn(HTMLDivElement.prototype, "removeEventListener");
      const { unmount } = renderPlayground();
      fireEvent.keyDown(window, { key: "?" });
      unmount();
      expect(removeListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
      removeListenerSpy.mockRestore();
    });

    it("closes shortcuts without restoring focus when activeElement was null", () => {
      const activeElementDescriptor = Object.getOwnPropertyDescriptor(document, "activeElement");
      Object.defineProperty(document, "activeElement", {
        configurable: true,
        get: () => null,
      });

      try {
        renderPlayground();
        fireEvent.keyDown(window, { key: "?" });
        fireEvent.keyDown(window, { key: "Escape" });
        expect(screen.queryByText("Keyboard Shortcuts")).not.toBeInTheDocument();
      } finally {
        if (activeElementDescriptor) {
          Object.defineProperty(document, "activeElement", activeElementDescriptor);
        }
      }
    });
  });

  describe("theme toggle", () => {
    it("toggles theme from dark to light via Ctrl+Shift+T", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "T", ctrlKey: true, shiftKey: true });
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ theme: "light" }),
      );
    });

    it("toggles theme from light to dark via Ctrl+Shift+T", () => {
      mockLoadSettings.mockReturnValue({ fontSize: 14, fontFamily: "JetBrains Mono, monospace", wordWrap: true, minimap: false, tabSize: 2, lastTarget: "cc", theme: "light" as const, outputLineNumbers: false, compilerFlags: { ...defaultCompilerFlags } });
      renderPlayground();
      fireEvent.keyDown(window, { key: "T", ctrlKey: true, shiftKey: true });
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ theme: "dark" }),
      );
    });
  });

  describe("document title", () => {
    it("shows running indicator in title when status is running", () => {
      mockStatus = "running";
      renderPlayground();
      expect(document.title).toBe("⏳ Running... | Croqtile Playground");
    });

    it("shows default title when not running", () => {
      mockStatus = "ready";
      renderPlayground();
      expect(document.title).toBe("Croqtile Playground");
    });
  });

  describe("external store sync during render", () => {
    it("syncs editor source when URL hash changes between renders", () => {
      const { rerender } = renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[0].code);

      const newCode = '__co__ void updated() { println("synced"); }';
      setUrl(`/#${encodeURIComponent(newCode)}`);
      rerender(<Playground />);

      expect(screen.getByTestId("code-editor")).toHaveValue(newCode);
    });

    it("syncs panel mode when URL search params change between renders", () => {
      const { rerender } = renderPlayground();
      expect(screen.queryByText("Tutorials")).not.toBeInTheDocument();

      setUrl("/?tutorial=ch01");
      rerender(<Playground />);

      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("The __co__ keyword")).toBeInTheDocument();
    });

    it("syncs panel mode to challenge when URL changes between renders", () => {
      const { rerender } = renderPlayground();
      expect(screen.queryByText("Challenges")).not.toBeInTheDocument();

      setUrl("/?challenge=c01");
      rerender(<Playground />);

      expect(screen.getByLabelText("Toggle challenge panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("Hello Threads")).toBeInTheDocument();
    });
  });

  describe("integration", () => {
    it("persists theme across rerenders after toggle", () => {
      const { rerender } = renderPlayground();
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");

      fireEvent.keyDown(window, { key: "T", ctrlKey: true, shiftKey: true });
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ theme: "light" }),
      );

      rerender(<Playground />);
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
      expect(screen.getByTestId("code-editor")).toHaveAttribute("data-theme", "light");
    });

    it("updates editor tab size when changed in settings menu", () => {
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveAttribute("data-tab-size", "2");

      fireEvent.click(screen.getByLabelText("Settings menu"));
      fireEvent.click(screen.getByLabelText("Increase tab size"));

      expect(screen.getByTestId("code-editor")).toHaveAttribute("data-tab-size", "3");
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ tabSize: 3 }),
      );
    });

    it("loads tutorial content then switches to challenge panel with challenge code", async () => {
      jest.useFakeTimers();
      renderPlayground();
      await flushInitialLoadConfirm();
      jest.useRealTimers();

      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      expect(screen.getByText("Tutorials")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Hello Croqtile"));
      expect(screen.getByText("The __co__ keyword")).toBeInTheDocument();
      expect((screen.getByTestId("code-editor") as HTMLTextAreaElement).value).toContain(
        'println("Hello from Croqtile!")',
      );

      await act(async () => {
        fireEvent.click(screen.getByLabelText("Toggle challenge panel"));
      });
      expect(screen.getByText("Challenges")).toBeInTheDocument();
      expect(screen.queryByText("Tutorials")).not.toBeInTheDocument();
      expect(screen.queryByText("The __co__ keyword")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Hello Threads"));
      expect(screen.getByText("Hello Threads")).toBeInTheDocument();
      expect((screen.getByTestId("code-editor") as HTMLTextAreaElement).value).toContain(
        "hello_threads",
      );
    });

    it("opens tutorial panel and step from ?tutorial= deep link", () => {
      setUrl("/?tutorial=ch01");
      renderPlayground();
      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("The __co__ keyword")).toBeInTheDocument();
      expect((screen.getByTestId("code-editor") as HTMLTextAreaElement).value).toContain(
        'println("Hello from Croqtile!")',
      );
    });

    it("opens challenge panel and detail from ?challenge= deep link", () => {
      setUrl("/?challenge=c01");
      renderPlayground();
      expect(screen.getByLabelText("Toggle challenge panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("Hello Threads")).toBeInTheDocument();
      expect((screen.getByTestId("code-editor") as HTMLTextAreaElement).value).toContain(
        "hello_threads",
      );
    });

    it("loads example source from ?example= deep link", () => {
      setUrl("/?example=parallel");
      renderPlayground();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[1].code);
      expect(screen.queryByText("Tutorials")).not.toBeInTheDocument();
      expect(screen.queryByText("Challenges")).not.toBeInTheDocument();
    });

    it("auto-saves source after debounced edit with fake timers", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        const { saveSource } = jest.requireMock("@/lib/sourceStorage");
        saveSource.mockClear();

        fireEvent.change(screen.getByTestId("code-editor"), {
          target: { value: "__co__ void integrationSave() {}" },
        });
        expect(saveSource).not.toHaveBeenCalled();

        act(() => {
          jest.advanceTimersByTime(4999);
        });
        expect(saveSource).not.toHaveBeenCalled();

        act(() => {
          jest.advanceTimersByTime(1);
        });
        expect(saveSource).toHaveBeenCalledTimes(1);
        expect(saveSource).toHaveBeenCalledWith("__co__ void integrationSave() {}");
      });
    });

    it("shows unsaved indicator while editing then clears after auto-save", async () => {
      await withFakeTimers(async () => {
        renderPlayground();
        const { saveSource } = jest.requireMock("@/lib/sourceStorage");
        saveSource.mockClear();

        expect(screen.queryByLabelText("Unsaved changes")).not.toBeInTheDocument();

        fireEvent.change(screen.getByTestId("code-editor"), {
          target: { value: "__co__ void pendingSave() {}" },
        });
        expect(screen.getByLabelText("Unsaved changes")).toBeInTheDocument();
        expect(screen.getByText("Unsaved")).toBeInTheDocument();
        expect(saveSource).not.toHaveBeenCalled();

        act(() => {
          jest.advanceTimersByTime(5000);
        });

        expect(saveSource).toHaveBeenCalledWith("__co__ void pendingSave() {}");
        expect(screen.queryByLabelText("Unsaved changes")).not.toBeInTheDocument();
      });
    });

    it("toggles theme and updates data-theme on document and editor", () => {
      renderPlayground();
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
      expect(screen.getByTestId("code-editor")).toHaveAttribute("data-theme", "dark");

      fireEvent.keyDown(window, { key: "T", ctrlKey: true, shiftKey: true });

      expect(document.documentElement).toHaveAttribute("data-theme", "light");
      expect(screen.getByTestId("code-editor")).toHaveAttribute("data-theme", "light");
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ theme: "light" }),
      );

      fireEvent.keyDown(window, { key: "T", ctrlKey: true, shiftKey: true });

      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
      expect(screen.getByTestId("code-editor")).toHaveAttribute("data-theme", "dark");
    });

    it("filters command palette when typing a partial command", () => {
      renderPlayground();
      openCommandPalette();

      expect(screen.getByText("Run Code")).toBeInTheDocument();
      expect(screen.getByText("Compile Code")).toBeInTheDocument();
      expect(screen.getByText("Format Code")).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText("Search commands"), {
        target: { value: "comp" },
      });

      expect(screen.queryByText("Run Code")).not.toBeInTheDocument();
      expect(screen.getByText("Compile Code")).toBeInTheDocument();
      expect(screen.queryByText("Format Code")).not.toBeInTheDocument();
    });

    it("switches panel mode from tutorial to challenge", () => {
      renderPlayground();

      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      expect(screen.getByText("Tutorials")).toBeInTheDocument();
      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.queryByText("Challenges")).not.toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Toggle challenge panel"));
      expect(screen.getByText("Challenges")).toBeInTheDocument();
      expect(screen.queryByText("Tutorials")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Toggle challenge panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "false");
    });

    it("opens tutorial panel from ?tutorial=ch01 URL param on load", () => {
      setUrl("/?tutorial=ch01");
      renderPlayground();

      expect(screen.getByLabelText("Toggle tutorial panel")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("← Back")).toBeInTheDocument();
      expect(screen.getByText("The __co__ keyword")).toBeInTheDocument();
      expect(screen.queryByText("Challenges")).not.toBeInTheDocument();
    });
  });

  describe("editor ref fallback", () => {
    it("reads source from sourceRef when editor ref is unavailable", () => {
      mockEditorProvidesRef = false;
      renderPlayground();
      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: "__co__ void fromSourceRef() {}" },
      });
      fireEvent.keyDown(window, { key: "Enter", ctrlKey: true });
      expect(mockRun).toHaveBeenCalledWith("__co__ void fromSourceRef() {}");
    });

    it("uses sourceRef in confirmAndLoad when editor ref is unavailable", async () => {
      await withFakeTimers(async () => {
        mockEditorProvidesRef = false;
        renderPlayground();
        await flushInitialLoadConfirm();
      });

      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: "__co__ void edited() {}" },
      });

      (window.confirm as jest.Mock).mockReturnValue(false);
      fireEvent.change(screen.getByLabelText("Load example code"), {
        target: { value: "parallel" },
      });

      expect(window.confirm).toHaveBeenCalled();
      expect(screen.getByTestId("code-editor")).toHaveValue("__co__ void edited() {}");
    });
  });
});

import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockRun = jest.fn();
const mockCompile = jest.fn();
const mockDumpAST = jest.fn();
const mockClearOutput = jest.fn();
const mockLoadLastSource = jest.fn(() => null);
const mockLoadSettings = jest.fn(() => ({ fontSize: 14, wordWrap: true, tabSize: 2, lastTarget: "cc", theme: "dark" as const }));
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
}));

jest.mock("@/lib/sourceStorage", () => ({
  saveSource: jest.fn(),
  loadSavedSource: (...args: unknown[]) => mockLoadLastSource(...args),
}));

jest.mock("@/lib/settings", () => ({
  loadSettings: (...args: unknown[]) => mockLoadSettings(...args),
  saveSettings: (...args: unknown[]) => mockSaveSettings(...args),
}));

const mockDownloadCoSource = jest.fn();
jest.mock("@/lib/fileIO", () => ({
  downloadCoSource: (...args: unknown[]) => mockDownloadCoSource(...args),
}));

let mockEditorProvidesRef = true;
let mockOmitToolbarOpenFileRef = false;
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
    { getValue: () => string },
    { value: string; onChange: (value: string) => void; fontSize?: number; wordWrap?: boolean }
  >(function MockEditor({ value, onChange, fontSize, wordWrap }, ref) {
    React.useImperativeHandle(ref, () => {
      if (!mockEditorProvidesRef) return null as unknown as { getValue: () => string };
      return { getValue: () => value };
    });
    return (
      <textarea
        data-testid="code-editor"
        aria-label="Code editor"
        data-font-size={fontSize}
        data-word-wrap={wordWrap}
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

beforeEach(() => {
  jest.clearAllMocks();
  mockEditorProvidesRef = true;
  mockOmitToolbarOpenFileRef = false;
  mockStatus = "ready";
  mockOutput = "";
  mockErrors = "";
  mockAst = "";
  mockLoadLastSource.mockReturnValue(null);
  mockLoadSettings.mockReturnValue({ fontSize: 14, wordWrap: true, tabSize: 2, lastTarget: "cc", theme: "dark" });
  mockMatchMedia(false);
  setUrl("/");
  window.history.replaceState = jest.fn();
  document.title = "Croqtile Playground";
  window.confirm = jest.fn(() => true);
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
    it("renders without crashing", () => {
      expect(() => renderPlayground()).not.toThrow();
    });

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
      jest.useFakeTimers();
      renderPlayground();
      await act(async () => {
        jest.runAllTimers();
      });

      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      mockRun.mockClear();

      fireEvent.click(screen.getByText("Hello Croqtile"));
      expect(mockRun).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(mockRun).toHaveBeenCalledTimes(1);
      expect(mockRun).toHaveBeenCalledWith(
        expect.stringContaining('println("Hello from Croqtile!")'),
      );

      jest.useRealTimers();
    });

    it("debounces load-and-run so only last timer fires", async () => {
      jest.useFakeTimers();
      renderPlayground();
      await act(async () => { jest.runAllTimers(); });

      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      mockRun.mockClear();

      fireEvent.click(screen.getByText("Hello Croqtile"));
      act(() => { jest.advanceTimersByTime(50); });
      expect(mockRun).not.toHaveBeenCalled();

      act(() => { jest.advanceTimersByTime(50); });
      expect(mockRun).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    it("cancels pending load-and-run timer when a new tutorial step is loaded", async () => {
      jest.useFakeTimers();
      renderPlayground();
      await act(async () => { jest.runAllTimers(); });

      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      mockRun.mockClear();

      fireEvent.click(screen.getByText("Hello Croqtile"));
      act(() => { jest.advanceTimersByTime(50); });

      fireEvent.click(screen.getByText("The __co__ keyword"));
      act(() => { jest.advanceTimersByTime(100); });

      expect(mockRun).toHaveBeenCalledTimes(1);
      expect(mockRun).toHaveBeenCalledWith(
        expect.stringContaining("__co__"),
      );

      jest.useRealTimers();
    });
  });

  describe("tutorial autorun timer cleanup", () => {
    it("clears a pending timer before scheduling the next tutorial run", async () => {
      jest.useFakeTimers();
      renderPlayground();
      await flushInitialLoadConfirm();

      fireEvent.click(screen.getByLabelText("Toggle tutorial panel"));
      fireEvent.click(screen.getByText("Hello Croqtile"));
      fireEvent.click(screen.getByText("Next →"));

      mockRun.mockClear();
      act(() => { jest.advanceTimersByTime(100); });
      expect(mockRun).toHaveBeenCalledTimes(1);
      expect(mockRun).toHaveBeenCalledWith(
        expect.stringContaining("printing()"),
      );

      jest.useRealTimers();
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
    it("renders stacked layout on mobile", () => {
      mockMatchMedia(true);
      setUrl("/?tutorial=ch01");
      const { container } = renderPlayground();
      expect(container.querySelector(".flex-col")).toBeTruthy();
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
    it("schedules saveSource after source changes", () => {
      jest.useFakeTimers();
      renderPlayground();
      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: "__co__ void edited() {}" },
      });
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      const { saveSource } = jest.requireMock("@/lib/sourceStorage");
      expect(saveSource).toHaveBeenCalledWith("__co__ void edited() {}");
      jest.useRealTimers();
    });
  });

  describe("unsaved changes warning", () => {
    it("does not confirm when loading tutorial code on initial deep link", async () => {
      jest.useFakeTimers();
      const hashCode = '__co__ void fromHash() { println("hash"); }';
      setUrl(`/?tutorial=ch01#${encodeURIComponent(hashCode)}`);
      renderPlayground();
      await flushInitialLoadConfirm();
      expect(window.confirm).not.toHaveBeenCalled();
      jest.useRealTimers();
    });

    it("confirms before loading example when source was modified", async () => {
      jest.useFakeTimers();
      renderPlayground();
      await flushInitialLoadConfirm();
      jest.useRealTimers();

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
      jest.useFakeTimers();
      renderPlayground();
      await flushInitialLoadConfirm();
      jest.useRealTimers();

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
      jest.useFakeTimers();
      renderPlayground();
      await flushInitialLoadConfirm();
      jest.useRealTimers();

      fireEvent.change(screen.getByLabelText("Load example code"), {
        target: { value: "parallel" },
      });

      expect(window.confirm).not.toHaveBeenCalled();
      expect(screen.getByTestId("code-editor")).toHaveValue(EXAMPLES[1].code);
    });

    it("does not confirm when loading code that matches current editor content", async () => {
      jest.useFakeTimers();
      renderPlayground();
      await flushInitialLoadConfirm();
      jest.useRealTimers();

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
      jest.useFakeTimers();
      renderPlayground();
      await flushInitialLoadConfirm();
      jest.useRealTimers();

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
    it("opens command palette on Ctrl+P", () => {
      renderPlayground();
      fireEvent.keyDown(window, { key: "p", ctrlKey: true });
      expect(screen.getByLabelText("Search commands")).toBeInTheDocument();
    });

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

    it("shows error overlay when status is error and no errors text", () => {
      mockStatus = "error";
      renderPlayground();
      expect(screen.getByText("WASM Load Failed")).toBeInTheDocument();
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
      mockLoadSettings.mockReturnValue({ fontSize: 14, wordWrap: true, tabSize: 2, lastTarget: "cc", theme: "light" as const });
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
      jest.useFakeTimers();
      mockEditorProvidesRef = false;
      renderPlayground();
      await flushInitialLoadConfirm();
      jest.useRealTimers();

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

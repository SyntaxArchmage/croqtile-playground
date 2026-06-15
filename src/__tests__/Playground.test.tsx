import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockRun = jest.fn();
const mockCompile = jest.fn();
const mockDumpAST = jest.fn();
const mockClearOutput = jest.fn();
const mockLoadLastSource = jest.fn(() => null);

jest.mock("@/lib/useChoreoWorker", () => ({
  useChoreoWorker: () => ({
    status: "ready" as const,
    output: "",
    errors: "",
    compilerVersion: "1.0.0",
    buildManifest: null,
    run: mockRun,
    compile: mockCompile,
    dumpAST: mockDumpAST,
    clearOutput: mockClearOutput,
  }),
}));

jest.mock("@/lib/progress", () => ({
  loadLastSource: (...args: unknown[]) => mockLoadLastSource(...args),
  saveLastSource: jest.fn(),
  getTutorialProgress: () => -1,
  markTutorialStep: () => {},
  isChallengePassed: () => false,
  markChallengePassed: jest.fn(),
}));

jest.mock("@/components/Editor", () => ({
  Editor: React.forwardRef<
    { getValue: () => string },
    { value: string; onChange: (value: string) => void }
  >(function MockEditor({ value, onChange }, ref) {
    React.useImperativeHandle(ref, () => ({
      getValue: () => value,
    }));
    return (
      <textarea
        data-testid="code-editor"
        aria-label="Code editor"
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
  mockLoadLastSource.mockReturnValue(null);
  mockMatchMedia(false);
  setUrl("/");
  window.history.replaceState = jest.fn();
});

describe("Playground", () => {
  describe("initial rendering", () => {
    it("renders without crashing", () => {
      expect(() => renderPlayground()).not.toThrow();
    });

    it("shows toolbar with branding and actions", () => {
      renderPlayground();
      expect(screen.getByText("Croqtile")).toBeInTheDocument();
      expect(screen.getByText("Playground")).toBeInTheDocument();
      expect(screen.getByLabelText("Run code")).toBeInTheDocument();
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
      fireEvent.click(screen.getByLabelText("Run code"));
      expect(mockRun).toHaveBeenCalledTimes(1);
    });
  });

  describe("source persistence", () => {
    it("schedules saveLastSource after source changes", () => {
      jest.useFakeTimers();
      renderPlayground();
      fireEvent.change(screen.getByTestId("code-editor"), {
        target: { value: "__co__ void edited() {}" },
      });
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      const { saveLastSource } = jest.requireMock("@/lib/progress");
      expect(saveLastSource).toHaveBeenCalledWith("__co__ void edited() {}");
      jest.useRealTimers();
    });
  });
});

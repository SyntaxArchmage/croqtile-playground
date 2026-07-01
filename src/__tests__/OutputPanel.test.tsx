import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OutputPanel } from "@/components/OutputPanel";

describe("OutputPanel", () => {
  const writeText = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    localStorage.clear();
    Object.assign(navigator, {
      clipboard: { writeText },
    });
  });
  it("shows placeholder when no output", () => {
    const { container } = render(<OutputPanel output="" errors="" />);
    const panel = container.querySelector("[role='tabpanel']")!;
    expect(panel.textContent).toMatch(/Run/);
  });

  it("displays output text", () => {
    render(<OutputPanel output="Hello from Croqtile!" errors="" />);
    expect(screen.getByText("Hello from Croqtile!")).toBeInTheDocument();
  });

  it("switches to errors tab when clicking Errors", () => {
    render(<OutputPanel output="good" errors="bad" />);
    fireEvent.click(screen.getByText("Errors"));
    expect(screen.getByText("bad")).toBeInTheDocument();
  });

  it("has Output and Errors tab buttons", () => {
    render(<OutputPanel output="" errors="" />);
    expect(screen.getByText("Output")).toBeInTheDocument();
    expect(screen.getByText("Errors")).toBeInTheDocument();
  });

  it("shows error count badge when errors with line info present", () => {
    render(<OutputPanel output="" errors="file.co:3: some error" />);
    const errorsTab = screen.getByRole("tab", { name: /Errors/ });
    expect(errorsTab.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("labels errors tab without count when no line-matched errors", () => {
    render(<OutputPanel output="" errors="some error" />);
    expect(screen.getByRole("tab", { name: "Errors" })).toBeInTheDocument();
  });

  it("auto-switches to errors tab when errors appear", () => {
    const { rerender } = render(<OutputPanel output="" errors="" />);
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");

    rerender(<OutputPanel output="" errors="syntax error" />);
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("syntax error")).toBeInTheDocument();
  });

  it("auto-switches to output tab when output arrives without errors", () => {
    const { rerender } = render(<OutputPanel output="" errors="old error" />);
    rerender(<OutputPanel output="result" errors="" />);
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("result")).toBeInTheDocument();
  });

  it("switches back to output tab on click", () => {
    render(<OutputPanel output="good" errors="bad" />);
    fireEvent.click(screen.getByText("Errors"));
    expect(screen.getByText("bad")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Output"));
    expect(screen.getByText("good")).toBeInTheDocument();
  });

  it("shows and invokes clear button when content present", () => {
    const onClear = jest.fn();
    render(<OutputPanel output="data" errors="" onClear={onClear} />);
    fireEvent.click(screen.getByText("Clear"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("hides clear button when no content", () => {
    const onClear = jest.fn();
    render(<OutputPanel output="" errors="" onClear={onClear} />);
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("has AST tab button", () => {
    render(<OutputPanel output="" errors="" />);
    expect(screen.getByText("AST")).toBeInTheDocument();
  });

  it("switches to AST tab and displays AST content", () => {
    render(<OutputPanel output="" errors="" ast="(program (func hello))" />);
    fireEvent.click(screen.getByText("AST"));
    expect(screen.getByText("(program (func hello))")).toBeInTheDocument();
  });

  it("auto-switches to AST tab when ast appears", () => {
    const { rerender } = render(<OutputPanel output="" errors="" ast="" />);
    rerender(<OutputPanel output="" errors="" ast="(ast dump)" />);
    expect(screen.getByRole("tab", { name: /AST/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("(ast dump)")).toBeInTheDocument();
  });

  it("shows indicator dot on AST tab when ast present", () => {
    render(<OutputPanel output="" errors="" ast="tree" />);
    const astTab = screen.getByRole("tab", { name: /AST/ });
    expect(astTab.querySelector("[aria-hidden]")).toBeInTheDocument();
  });

  it("shows Copy button when active tab has content", () => {
    render(<OutputPanel output="Hello from Croqtile!" errors="" />);
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("hides Copy button when active tab has no content", () => {
    render(<OutputPanel output="" errors="" />);
    expect(screen.queryByText("Copy")).not.toBeInTheDocument();
  });

  it("copies active tab content and shows Copied feedback", () => {
    jest.useFakeTimers();
    render(<OutputPanel output="Hello from Croqtile!" errors="some error" />);
    fireEvent.click(screen.getByText("Copy"));
    expect(writeText).toHaveBeenCalledWith("Hello from Croqtile!");
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Copy")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("copies errors tab content when Errors tab is active", () => {
    render(<OutputPanel output="good" errors="bad" />);
    fireEvent.click(screen.getByText("Errors"));
    fireEvent.click(screen.getByText("Copy"));
    expect(writeText).toHaveBeenCalledWith("bad");
  });

  it("adjusts height via keyboard on separator", () => {
    render(<OutputPanel output="data" errors="" />);
    const sep = screen.getByRole("separator");
    const initialValue = Number(sep.getAttribute("aria-valuenow"));
    fireEvent.keyDown(sep, { key: "ArrowUp" });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(initialValue + 2);
    fireEvent.keyDown(sep, { key: "ArrowDown" });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(initialValue);
  });

  it("highlights error lines with line numbers", () => {
    const errorText = "line 1: some error\nok line\nError at line 3: bad";
    const { container, rerender } = render(<OutputPanel output="" errors="" />);
    rerender(<OutputPanel output="" errors={errorText} />);
    const highlighted = container.querySelectorAll(".error-line-highlight");
    expect(highlighted).toHaveLength(2);
    expect(highlighted[0]).toHaveTextContent("line 1: some error");
    expect(highlighted[1]).toHaveTextContent("Error at line 3: bad");
    expect(screen.getByText("ok line").closest(".error-line-highlight")).toBeNull();
  });

  it("navigates tabs with arrow keys", () => {
    render(<OutputPanel output="out" errors="err" ast="tree" />);
    const outputTab = screen.getByRole("tab", { name: /Output/ });
    fireEvent.keyDown(outputTab, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(screen.getByRole("tab", { name: /Errors/ }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /AST/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(screen.getByRole("tab", { name: /AST/ }), { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
  });

  it("updates aria-valuenow during mouse resize when parent has bounds", () => {
    const { container } = render(
      <div data-testid="resize-parent" style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>
    );

    const parent = container.querySelector('[data-testid="resize-parent"]')!;
    parent.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 600,
      height: 600,
      left: 0,
      right: 800,
      width: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));

    const sep = screen.getByRole("separator");
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(30);

    fireEvent.mouseDown(sep);
    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientY: 300 }));
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(50);

    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
  });

  it("resizes via mouse drag on separator", () => {
    const { container } = render(
      <div style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>
    );
    const sep = screen.getByRole("separator");
    fireEvent.mouseDown(sep);
    expect(document.body.style.cursor).toBe("row-resize");
    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientY: 300 }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
    expect(document.body.style.cursor).toBe("");
  });

  it("resizes via touch drag on separator", () => {
    render(<OutputPanel output="data" errors="" />);
    const sep = screen.getByRole("separator");
    fireEvent.touchStart(sep);
    act(() => {
      document.dispatchEvent(
        new TouchEvent("touchmove", {
          touches: [{ clientY: 300 } as Touch],
        })
      );
    });
    act(() => {
      document.dispatchEvent(new TouchEvent("touchend"));
    });
  });

  it("does not copy when content is empty", () => {
    render(<OutputPanel output="" errors="" />);
    expect(screen.queryByText("Copy")).not.toBeInTheDocument();
  });

  it("toggles word wrap in output", () => {
    const { container } = render(<OutputPanel output="long line of compiler output" errors="" />);
    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("whitespace-pre-wrap");

    fireEvent.click(screen.getByLabelText("Toggle word wrap"));
    expect(pre).toHaveClass("whitespace-pre");
    expect(pre).not.toHaveClass("whitespace-pre-wrap");

    fireEvent.click(screen.getByLabelText("Toggle word wrap"));
    expect(pre).toHaveClass("whitespace-pre-wrap");
  });

  it("toggles line numbers in output", () => {
    render(<OutputPanel output={"Hello\nWorld"} errors="" />);
    const pre = screen.getByRole("tabpanel").querySelector("pre");
    expect(pre?.textContent).toBe("Hello\nWorld");

    fireEvent.click(screen.getByLabelText("Toggle line numbers"));
    expect(pre?.textContent).toBe("1: Hello\n2: World");
    expect(screen.getByLabelText("Toggle line numbers")).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByLabelText("Toggle line numbers"));
    expect(pre?.textContent).toBe("Hello\nWorld");
    expect(screen.getByLabelText("Toggle line numbers")).toHaveAttribute("aria-pressed", "false");
  });

  it("persists line numbers setting in localStorage", () => {
    render(<OutputPanel output="data" errors="" />);
    fireEvent.click(screen.getByLabelText("Toggle line numbers"));
    expect(JSON.parse(localStorage.getItem("croqtile-playground-settings")!).outputLineNumbers).toBe(true);
  });

  it("loads line numbers setting from localStorage", () => {
    localStorage.setItem(
      "croqtile-playground-settings",
      JSON.stringify({ fontSize: 14, wordWrap: false, outputLineNumbers: true }),
    );
    render(<OutputPanel output={"A\nB"} errors="" />);
    const pre = screen.getByRole("tabpanel").querySelector("pre");
    expect(pre?.textContent).toBe("1: A\n2: B");
    expect(screen.getByLabelText("Toggle line numbers")).toHaveAttribute("aria-pressed", "true");
  });

  it("shows line numbers on errors tab when enabled", () => {
    localStorage.setItem(
      "croqtile-playground-settings",
      JSON.stringify({ outputLineNumbers: true }),
    );
    render(<OutputPanel output="" errors={"Error at line 1\nsecond line"} />);
    fireEvent.click(screen.getByRole("tab", { name: /Errors/ }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("1: Error at line 1");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("2: second line");
  });

  it("navigates tabs with ArrowRight keyboard", () => {
    render(<OutputPanel output="data" errors="err" ast="tree" />);
    const tablist = screen.getByRole("tablist");
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /AST/ })).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");
  });

  it("navigates tabs with ArrowLeft keyboard", () => {
    render(<OutputPanel output="data" errors="err" ast="tree" />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: /AST/ })).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
  });

  it("renders non-breaking space for empty lines in error output", () => {
    const errorText = "Error at line 1\n\nmore text";
    const { container, rerender } = render(<OutputPanel output="" errors="" />);
    rerender(<OutputPanel output="" errors={errorText} />);
    const divs = container.querySelectorAll("[class*='error-line'],.text-xs.font-mono > div");
    const emptyDiv = Array.from(divs).find((d) => d.textContent === "\u00A0");
    expect(emptyDiv).toBeTruthy();
  });

  it("does not auto-switch to ast tab when ast changes to empty", () => {
    const { rerender } = render(<OutputPanel output="" errors="" ast="" />);
    rerender(<OutputPanel output="" errors="" ast="tree" />);
    expect(screen.getByRole("tab", { name: /AST/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: /Output/ }));
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");
    rerender(<OutputPanel output="" errors="" ast="" />);
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");
  });

  it("does not auto-switch to output when new output arrives alongside errors", () => {
    const { rerender } = render(<OutputPanel output="" errors="" />);
    rerender(<OutputPanel output="" errors="err" />);
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
    rerender(<OutputPanel output="new out" errors="err" />);
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
  });

  it("handleCopy is a no-op when content is empty (errors tab with no errors)", () => {
    render(<OutputPanel output="data" errors="" />);
    fireEvent.click(screen.getByRole("tab", { name: /Errors/ }));
    expect(screen.queryByText("Copy")).not.toBeInTheDocument();
  });

  it("handleCopy returns early when active tab content is empty", () => {
    let latestHandleCopy: (() => void) | undefined;
    const realUseCallback = React.useCallback;
    const useCallbackSpy = jest.spyOn(React, "useCallback").mockImplementation((fn, deps) => {
      const cb = realUseCallback(fn, deps);
      if (Array.isArray(deps) && deps.length === 1 && typeof deps[0] === "string") {
        latestHandleCopy = cb as () => void;
      }
      return cb;
    });

    try {
      render(<OutputPanel output="" errors="" ast="" />);
      latestHandleCopy?.();
      expect(writeText).not.toHaveBeenCalled();
    } finally {
      useCallbackSpy.mockRestore();
    }
  });

  it("ignores mouse move after mouse up on separator", () => {
    const { container } = render(
      <div style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>
    );
    const sep = screen.getByRole("separator");
    const initialVal = Number(sep.getAttribute("aria-valuenow"));

    fireEvent.mouseDown(sep);
    act(() => { document.dispatchEvent(new MouseEvent("mouseup")); });

    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientY: 100 }));
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(initialVal);
  });

  it("ignores touch move after touch end on separator", () => {
    render(<OutputPanel output="data" errors="" />);
    const sep = screen.getByRole("separator");
    const initialVal = Number(sep.getAttribute("aria-valuenow"));

    fireEvent.touchStart(sep);
    act(() => { document.dispatchEvent(new TouchEvent("touchend")); });

    act(() => {
      document.dispatchEvent(
        new TouchEvent("touchmove", {
          touches: [{ clientY: 100 } as Touch],
        })
      );
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(initialVal);
  });

  it("clears existing copy timeout on rapid re-copy", () => {
    jest.useFakeTimers();
    render(<OutputPanel output="data" errors="" />);
    fireEvent.click(screen.getByText("Copy"));
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Copied!"));
    expect(writeText).toHaveBeenCalledTimes(2);
    act(() => { jest.advanceTimersByTime(2000); });
    expect(screen.getByText("Copy")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("handles copy gracefully when clipboard API is unavailable", () => {
    jest.useFakeTimers();
    Object.assign(navigator, { clipboard: undefined });
    render(<OutputPanel output="data" errors="" />);
    fireEvent.click(screen.getByText("Copy"));
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(2000); });
    expect(screen.getByText("Copy")).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("auto-scrolls tabpanel when content changes", () => {
    const { rerender } = render(<OutputPanel output="" errors="" />);
    const tabpanel = screen.getByRole("tabpanel");
    Object.defineProperty(tabpanel, "scrollHeight", { value: 500, configurable: true });
    let scrollTop = 0;
    Object.defineProperty(tabpanel, "scrollTop", {
      get: () => scrollTop,
      set: (v: number) => { scrollTop = v; },
      configurable: true,
    });

    rerender(<OutputPanel output="line one\nline two\nline three" errors="" />);
    expect(scrollTop).toBe(500);
  });

  it("auto-scrolls AST tab when ast content changes", () => {
    const { rerender } = render(<OutputPanel output="" errors="" ast="" />);
    fireEvent.click(screen.getByRole("tab", { name: /AST/ }));
    const tabpanel = screen.getByRole("tabpanel");
    Object.defineProperty(tabpanel, "scrollHeight", { value: 400, configurable: true });
    let scrollTop = 0;
    Object.defineProperty(tabpanel, "scrollTop", {
      get: () => scrollTop,
      set: (v: number) => { scrollTop = v; },
      configurable: true,
    });

    rerender(<OutputPanel output="" errors="" ast="(program\n  (func main))" />);
    expect(scrollTop).toBe(400);
  });

  it("clamps resize height to min and max bounds", () => {
    const { container } = render(
      <div style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>
    );
    const parent = container.firstElementChild as HTMLElement;
    parent.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 600,
      height: 600,
      left: 0,
      right: 800,
      width: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));

    const sep = screen.getByRole("separator");
    fireEvent.mouseDown(sep);

    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientY: 600 }));
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(15);

    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientY: 0 }));
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(65);

    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
  });

  it("skips resize when panel has no parent element", () => {
    const { container } = render(
      <div style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>
    );
    const panelRoot = container.querySelector(".min-h-\\[120px\\]") as HTMLElement;
    Object.defineProperty(panelRoot, "parentElement", { get: () => null });

    const sep = screen.getByRole("separator");
    const initialVal = Number(sep.getAttribute("aria-valuenow"));
    fireEvent.mouseDown(sep);
    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientY: 100 }));
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(initialVal);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
  });

  it("ignores mousemove handler when drag flag is cleared", () => {
    const addListenerSpy = jest.spyOn(document, "addEventListener");
    let moveHandler: ((e: MouseEvent) => void) | undefined;

    addListenerSpy.mockImplementation(function (type, listener, options) {
      if (type === "mousemove") {
        moveHandler = listener as (e: MouseEvent) => void;
      }
      return EventTarget.prototype.addEventListener.call(this, type, listener, options);
    });

    const { container } = render(
      <div style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>
    );
    const parent = container.firstElementChild as HTMLElement;
    parent.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 600,
      height: 600,
      left: 0,
      right: 800,
      width: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));

    const sep = screen.getByRole("separator");
    fireEvent.mouseDown(sep);
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });

    const valAfterUp = Number(sep.getAttribute("aria-valuenow"));
    act(() => {
      moveHandler?.(new MouseEvent("mousemove", { clientY: 100 }));
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(valAfterUp);

    addListenerSpy.mockRestore();
  });

  it("focuses next tab on ArrowRight and previous tab on ArrowLeft", () => {
    const focusSpy = jest.spyOn(HTMLElement.prototype, "focus");
    render(<OutputPanel output="data" errors="err" ast="tree" />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockClear();
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("handles touchcancel during touch resize", () => {
    const { container } = render(
      <div style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>
    );
    const parent = container.firstElementChild as HTMLElement;
    parent.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 600,
      height: 600,
      left: 0,
      right: 800,
      width: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));

    const sep = screen.getByRole("separator");
    fireEvent.touchStart(sep);
    act(() => {
      document.dispatchEvent(new TouchEvent("touchcancel"));
    });
    const valAfterCancel = Number(sep.getAttribute("aria-valuenow"));
    act(() => {
      document.dispatchEvent(
        new TouchEvent("touchmove", {
          touches: [{ clientY: 100 } as Touch],
        })
      );
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(valAfterCancel);
  });

  it("clears copy timeout on unmount", () => {
    jest.useFakeTimers();
    const { unmount } = render(<OutputPanel output="data" errors="" />);
    fireEvent.click(screen.getByText("Copy"));
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    unmount();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    jest.useRealTimers();
  });

  it("handles clipboard write rejection without throwing", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    render(<OutputPanel output="data" errors="" />);
    fireEvent.click(screen.getByText("Copy"));
    expect(writeText).toHaveBeenCalledWith("data");
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    await act(async () => {
      await Promise.resolve();
    });
  });

  it("ignores touchmove handler when touch drag flag is cleared", () => {
    const addListenerSpy = jest.spyOn(document, "addEventListener");
    let touchMoveHandler: ((ev: TouchEvent) => void) | undefined;

    addListenerSpy.mockImplementation(function (type, listener, options) {
      if (type === "touchmove") {
        touchMoveHandler = listener as (ev: TouchEvent) => void;
      }
      return EventTarget.prototype.addEventListener.call(this, type, listener, options);
    });

    const { container } = render(
      <div style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>
    );
    const parent = container.firstElementChild as HTMLElement;
    parent.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 600,
      height: 600,
      left: 0,
      right: 800,
      width: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));

    const sep = screen.getByRole("separator");
    fireEvent.touchStart(sep);
    act(() => {
      document.dispatchEvent(new TouchEvent("touchend"));
    });

    const valAfterEnd = Number(sep.getAttribute("aria-valuenow"));
    act(() => {
      touchMoveHandler?.(
        new TouchEvent("touchmove", {
          touches: [{ clientY: 100 } as Touch],
        })
      );
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(valAfterEnd);

    addListenerSpy.mockRestore();
  });

  it("ignores non-arrow keys on tablist", () => {
    render(<OutputPanel output="data" errors="err" ast="tree" />);
    const tablist = screen.getByRole("tablist");
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tablist, { key: "Enter" });
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");
  });

  it("navigates tabs when focus target is missing from document", () => {
    const getElementByIdSpy = jest.spyOn(document, "getElementById").mockReturnValue(null);
    render(<OutputPanel output="data" errors="err" ast="tree" />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: /Output/ })).toHaveAttribute("aria-selected", "true");

    getElementByIdSpy.mockRestore();
  });

  it("copies AST tab content when AST tab is active", () => {
    render(<OutputPanel output="out" errors="err" ast="(program (func main))" />);
    fireEvent.click(screen.getByRole("tab", { name: /AST/ }));
    fireEvent.click(screen.getByText("Copy"));
    expect(writeText).toHaveBeenCalledWith("(program (func main))");
  });

  it("shows line numbers on AST tab when enabled", () => {
    localStorage.setItem(
      "croqtile-playground-settings",
      JSON.stringify({ outputLineNumbers: true }),
    );
    render(<OutputPanel output="" errors="" ast={"node one\nnode two"} />);
    fireEvent.click(screen.getByRole("tab", { name: /AST/ }));
    const pre = screen.getByRole("tabpanel").querySelector("pre");
    expect(pre?.textContent).toBe("1: node one\n2: node two");
  });

  it("preserves line numbers when switching tabs", () => {
    localStorage.setItem(
      "croqtile-playground-settings",
      JSON.stringify({ outputLineNumbers: true }),
    );
    render(
      <OutputPanel
        output={"out line\nsecond"}
        errors={"err line\nsecond err"}
        ast={"ast line\nsecond ast"}
      />,
    );

    const tabpanel = screen.getByRole("tabpanel");
    expect(tabpanel).toHaveTextContent("1: out line");
    expect(tabpanel).toHaveTextContent("2: second");

    fireEvent.click(screen.getByRole("tab", { name: /Errors/ }));
    expect(tabpanel).toHaveTextContent("1: err line");
    expect(tabpanel).toHaveTextContent("2: second err");

    fireEvent.click(screen.getByRole("tab", { name: /AST/ }));
    expect(tabpanel).toHaveTextContent("1: ast line");
    expect(tabpanel).toHaveTextContent("2: second ast");

    fireEvent.click(screen.getByRole("tab", { name: /Output/ }));
    expect(tabpanel).toHaveTextContent("1: out line");
  });

  it("toggles word wrap on AST tab content", () => {
    render(<OutputPanel output="" errors="" ast="long ast line content" />);
    fireEvent.click(screen.getByRole("tab", { name: /AST/ }));
    const pre = screen.getByRole("tabpanel").querySelector("pre");
    expect(pre).toHaveClass("whitespace-pre-wrap");

    fireEvent.click(screen.getByLabelText("Toggle word wrap"));
    expect(pre).toHaveClass("whitespace-pre");
    expect(pre).not.toHaveClass("whitespace-pre-wrap");
  });

  it("does not apply word-wrap classes to errors tab rendering", () => {
    render(<OutputPanel output="" errors="long error line content" />);
    fireEvent.click(screen.getByRole("tab", { name: /Errors/ }));
    expect(screen.getByRole("tabpanel").querySelector("pre")).toBeNull();
    expect(screen.getByRole("tabpanel").querySelector(".font-mono")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Toggle word wrap"));
    expect(screen.getByRole("tabpanel").querySelector("pre")).toBeNull();
  });

  it("highlights error lines with path:line:col pattern", () => {
    const errorText = "main.cqt:42: undefined symbol\nall good";
    const { container, rerender } = render(<OutputPanel output="" errors="" />);
    rerender(<OutputPanel output="" errors={errorText} />);
    const highlighted = container.querySelectorAll(".error-line-highlight");
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]).toHaveTextContent("main.cqt:42: undefined symbol");
  });

  it("shows line numbers on highlighted error lines when enabled", () => {
    localStorage.setItem(
      "croqtile-playground-settings",
      JSON.stringify({ outputLineNumbers: true }),
    );
    const errorText = "line 5: bad\nok";
    const { container, rerender } = render(<OutputPanel output="" errors="" />);
    rerender(<OutputPanel output="" errors={errorText} />);
    const highlighted = container.querySelectorAll(".error-line-highlight");
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]).toHaveTextContent("1: line 5: bad");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("2: ok");
  });

  it("clamps keyboard resize to min and max bounds", () => {
    render(<OutputPanel output="data" errors="" />);
    const sep = screen.getByRole("separator");

    for (let i = 0; i < 20; i++) {
      fireEvent.keyDown(sep, { key: "ArrowDown" });
    }
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(15);

    for (let i = 0; i < 30; i++) {
      fireEvent.keyDown(sep, { key: "ArrowUp" });
    }
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(65);
  });

  it("ignores touchmove with empty touches during touch resize", () => {
    render(<OutputPanel output="data" errors="" />);
    const sep = screen.getByRole("separator");
    const initialVal = Number(sep.getAttribute("aria-valuenow"));

    fireEvent.touchStart(sep);
    act(() => {
      document.dispatchEvent(new TouchEvent("touchmove", { touches: [] }));
    });
    expect(Number(sep.getAttribute("aria-valuenow"))).toBe(initialVal);

    act(() => {
      document.dispatchEvent(new TouchEvent("touchend"));
    });
  });

  it("auto-scroll no-ops when tabpanel node is detached before content update", () => {
    const { rerender } = render(<OutputPanel output="" errors="" />);
    screen.getByRole("tabpanel").remove();
    expect(() => {
      rerender(<OutputPanel output="line one\nline two" errors="" />);
    }).not.toThrow();
  });

  it("updates copy button aria-label after successful copy", () => {
    render(<OutputPanel output="data" errors="" />);
    const copyBtn = screen.getByLabelText("Copy output to clipboard");
    fireEvent.click(copyBtn);
    expect(screen.getByLabelText("Copied to clipboard")).toBeInTheDocument();
    expect(copyBtn).toHaveAttribute("title", "Copied!");
  });

  it("persists line numbers off when toggled from loaded true setting", () => {
    localStorage.setItem(
      "croqtile-playground-settings",
      JSON.stringify({ outputLineNumbers: true }),
    );
    render(<OutputPanel output={"A\nB"} errors="" />);
    fireEvent.click(screen.getByLabelText("Toggle line numbers"));
    expect(JSON.parse(localStorage.getItem("croqtile-playground-settings")!).outputLineNumbers).toBe(false);
  });

  it("shows clear button on empty active tab when other tabs have content", () => {
    const onClear = jest.fn();
    render(<OutputPanel output="data" errors="err" ast="tree" onClear={onClear} />);
    fireEvent.click(screen.getByRole("tab", { name: /Errors/ }));
    fireEvent.click(screen.getByText("Clear"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("copy button is not rendered when output is empty", () => {
    render(<OutputPanel output="" errors="" />);
    expect(screen.queryByLabelText("Copy output to clipboard")).not.toBeInTheDocument();
  });

  it("auto-scrolls to bottom when output updates", () => {
    const { rerender } = render(<OutputPanel output="" errors="" />);
    const tabpanel = screen.getByRole("tabpanel");
    let scrollTop = 0;
    Object.defineProperty(tabpanel, "scrollTop", {
      get: () => scrollTop,
      set: (v: number) => { scrollTop = v; },
      configurable: true,
    });
    Object.defineProperty(tabpanel, "scrollHeight", {
      get: () => 999,
      configurable: true,
    });
    rerender(<OutputPanel output="new output" errors="" />);
    expect(scrollTop).toBe(999);
  });

  it("does not auto-switch to ast tab when ast arrives alongside errors", () => {
    const { rerender } = render(<OutputPanel output="" errors="" />);
    rerender(<OutputPanel output="" errors="compile error" />);
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
    rerender(<OutputPanel output="" errors="compile error" ast="(program)" />);
    expect(screen.getByRole("tab", { name: /Errors/ })).toHaveAttribute("aria-selected", "true");
  });

  it("skips auto-scroll when scroll ref is null", () => {
    const refInstances: Array<{ current: unknown }> = [];
    const realUseRef = React.useRef;
    jest.spyOn(React, "useRef").mockImplementation((initial) => {
      const ref = realUseRef(initial);
      refInstances.push(ref);
      return ref;
    });

    try {
      const { rerender } = render(<OutputPanel output="" errors="" />);
      refInstances[0].current = null;
      expect(() => {
        rerender(<OutputPanel output="line one\nline two" errors="" />);
      }).not.toThrow();
    } finally {
      jest.restoreAllMocks();
    }
  });

  it("ignores resize updates after panel unmounts during drag", () => {
    const { unmount } = render(
      <div style={{ height: 600 }}>
        <OutputPanel output="data" errors="" />
      </div>,
    );
    const sep = screen.getByRole("separator");
    fireEvent.mouseDown(sep);
    unmount();
    expect(() => {
      act(() => {
        document.dispatchEvent(new MouseEvent("mousemove", { clientY: 100 }));
      });
    }).not.toThrow();
    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });
  });

  it("ignores resize when panel ref is null during drag", () => {
    const refInstances: Array<{ current: unknown }> = [];
    const realUseRef = React.useRef;
    jest.spyOn(React, "useRef").mockImplementation((initial) => {
      const ref = realUseRef(initial);
      refInstances.push(ref);
      return ref;
    });

    try {
      render(
        <div style={{ height: 600 }}>
          <OutputPanel output="data" errors="" />
        </div>,
      );
      const sep = screen.getByRole("separator");
      const initialVal = Number(sep.getAttribute("aria-valuenow"));
      fireEvent.mouseDown(sep);
      refInstances[1].current = null;
      act(() => {
        document.dispatchEvent(new MouseEvent("mousemove", { clientY: 100 }));
      });
      expect(Number(sep.getAttribute("aria-valuenow"))).toBe(initialVal);
      act(() => {
        document.dispatchEvent(new MouseEvent("mouseup"));
      });
    } finally {
      jest.restoreAllMocks();
    }
  });
});

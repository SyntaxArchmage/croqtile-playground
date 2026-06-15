import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OutputPanel } from "@/components/OutputPanel";

describe("OutputPanel", () => {
  const writeText = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeText.mockClear();
    Object.assign(navigator, {
      clipboard: { writeText },
    });
  });
  it("shows placeholder when no output", () => {
    render(<OutputPanel output="" errors="" />);
    expect(screen.getByText(/Click .Run. or .Compile/)).toBeInTheDocument();
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

  it("shows error indicator dot when errors present", () => {
    const { container } = render(<OutputPanel output="" errors="some error" />);
    const dot = container.querySelector(".bg-red-500");
    expect(dot).toBeInTheDocument();
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

  it("shows blue indicator dot on AST tab when ast present", () => {
    const { container } = render(<OutputPanel output="" errors="" ast="tree" />);
    const dot = container.querySelector(".bg-blue-500");
    expect(dot).toBeInTheDocument();
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
      jest.advanceTimersByTime(1500);
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

  it("clears existing copy timeout on rapid re-copy", () => {
    jest.useFakeTimers();
    render(<OutputPanel output="data" errors="" />);
    fireEvent.click(screen.getByText("Copy"));
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Copied!"));
    expect(writeText).toHaveBeenCalledTimes(2);
    act(() => { jest.advanceTimersByTime(1500); });
    expect(screen.getByText("Copy")).toBeInTheDocument();
    jest.useRealTimers();
  });
});

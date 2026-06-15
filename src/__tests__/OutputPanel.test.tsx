import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OutputPanel } from "@/components/OutputPanel";

describe("OutputPanel", () => {
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
});

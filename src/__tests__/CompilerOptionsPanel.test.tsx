import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CompilerOptionsPanel } from "@/components/CompilerOptionsPanel";
import { DEFAULT_COMPILER_FLAGS, type CompilerFlags } from "@/lib/settings";

function renderPanel(overrides: Partial<{ flags: CompilerFlags; onChange: jest.Mock; onClose: jest.Mock }> = {}) {
  const onChange = overrides.onChange ?? jest.fn();
  const onClose = overrides.onClose ?? jest.fn();
  const flags = overrides.flags ?? { ...DEFAULT_COMPILER_FLAGS };
  const result = render(<CompilerOptionsPanel flags={flags} onChange={onChange} onClose={onClose} />);
  return { ...result, onChange, onClose };
}

describe("CompilerOptionsPanel", () => {
  it("renders all flag checkboxes", () => {
    renderPanel();
    expect(screen.getByText(/Emit Source/)).toBeInTheDocument();
    expect(screen.getByText(/Dump AST/)).toBeInTheDocument();
    expect(screen.getByText(/No Preprocess/)).toBeInTheDocument();
    expect(screen.getByText(/Drop Comments/)).toBeInTheDocument();
    expect(screen.getByText(/No Codegen/)).toBeInTheDocument();
    expect(screen.getByText(/Semantic Only/)).toBeInTheDocument();
  });

  it("renders custom flags input", () => {
    renderPanel();
    expect(screen.getByPlaceholderText(/-O2/)).toBeInTheDocument();
  });

  it("renders reset button", () => {
    renderPanel();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("reflects initial flag values", () => {
    const flags: CompilerFlags = {
      ...DEFAULT_COMPILER_FLAGS,
      dumpAst: true,
      noPreprocess: true,
    };
    renderPanel({ flags });
    const checkboxes = screen.getAllByRole("checkbox");
    const dumpAstCb = checkboxes.find(cb => cb.closest("label")?.textContent?.includes("Dump AST"));
    const noPpCb = checkboxes.find(cb => cb.closest("label")?.textContent?.includes("No Preprocess"));
    const noCgCb = checkboxes.find(cb => cb.closest("label")?.textContent?.includes("No Codegen"));
    expect(dumpAstCb).toBeChecked();
    expect(noPpCb).toBeChecked();
    expect(noCgCb).not.toBeChecked();
  });

  it("calls onChange when toggling a flag", () => {
    const { onChange } = renderPanel();
    const checkboxes = screen.getAllByRole("checkbox");
    const dumpAstCb = checkboxes.find(cb => cb.closest("label")?.textContent?.includes("Dump AST"))!;
    fireEvent.click(dumpAstCb);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ dumpAst: true }),
    );
  });

  it("calls onChange when changing custom flags", () => {
    const { onChange } = renderPanel();
    const input = screen.getByPlaceholderText(/-O2/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "-O2" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ customFlags: "-O2" }),
    );
  });

  it("calls onChange with defaults when reset is clicked", () => {
    const flags: CompilerFlags = { ...DEFAULT_COMPILER_FLAGS, dumpAst: true, customFlags: "-v" };
    const { onChange } = renderPanel({ flags });
    fireEvent.click(screen.getByText("Reset"));
    expect(onChange).toHaveBeenCalledWith(DEFAULT_COMPILER_FLAGS);
  });

  it("calls onClose when Escape is pressed", () => {
    const { onClose } = renderPanel();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking outside the panel", () => {
    const { onClose } = renderPanel();
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onClose when clicking inside the panel", () => {
    const { onClose } = renderPanel();
    const panel = screen.getByRole("dialog");
    fireEvent.mouseDown(panel);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("has accessible dialog role", () => {
    renderPanel();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Compiler options");
  });
});

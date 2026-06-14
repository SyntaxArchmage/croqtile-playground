import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Toolbar } from "@/components/Toolbar";

const defaultProps = {
  target: "cc",
  onTargetChange: jest.fn(),
  onRun: jest.fn(),
  onCompile: jest.fn(),
  onDumpAST: jest.fn(),
  onLoadCode: jest.fn(),
  onShare: jest.fn(),
  onTogglePanel: jest.fn(),
  panelMode: "closed" as const,
  status: "ready" as const,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Toolbar", () => {
  it("renders Run button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText(/Run/)).toBeInTheDocument();
  });

  it("renders Compile button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("Compile")).toBeInTheDocument();
  });

  it("renders AST button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("AST")).toBeInTheDocument();
  });

  it("renders Share button", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("calls onRun when Run clicked", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByText(/Run/));
    expect(defaultProps.onRun).toHaveBeenCalledTimes(1);
  });

  it("calls onCompile when Compile clicked", () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByText("Compile"));
    expect(defaultProps.onCompile).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when running", () => {
    render(<Toolbar {...defaultProps} status="running" />);
    const runBtn = screen.getByText(/Run/).closest("button");
    expect(runBtn).toBeDisabled();
  });

  it("renders target selector with cc", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByDisplayValue("cc (C++ CPU)")).toBeInTheDocument();
  });

  it("renders branding text", () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText("Croqtile")).toBeInTheDocument();
    expect(screen.getByText("Playground")).toBeInTheDocument();
  });
});

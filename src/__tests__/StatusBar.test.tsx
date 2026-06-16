import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatusBar } from "@/components/StatusBar";

describe("StatusBar", () => {
  it("shows loading state", () => {
    render(<StatusBar status="loading" />);
    expect(screen.getByText("Loading WASM...")).toBeInTheDocument();
  });

  it("shows ready state", () => {
    render(<StatusBar status="ready" />);
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("shows running state", () => {
    render(<StatusBar status="running" />);
    expect(screen.getByText("Running...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    render(<StatusBar status="error" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("displays compiler version", () => {
    render(<StatusBar status="ready" compilerVersion="1.2.3" />);
    expect(screen.getByText(/1\.2\.3/)).toBeInTheDocument();
  });

  it("displays build manifest commit", () => {
    render(
      <StatusBar
        status="ready"
        buildManifest={{ version: "1.0", commit: "abc123", commit_short: "abc", built_at: null }}
      />
    );
    expect(screen.getByText(/abc/)).toBeInTheDocument();
  });

  it("shows dash when no version available", () => {
    render(<StatusBar status="ready" />);
    expect(screen.getByText(/—/)).toBeInTheDocument();
  });

  it("displays line count after cursor position", () => {
    render(
      <StatusBar
        status="ready"
        cursorPosition={{ line: 5, column: 10 }}
        lineCount={42}
      />
    );
    expect(screen.getByText("Ln 5, Col 10")).toBeInTheDocument();
    expect(screen.getByText("42 lines")).toBeInTheDocument();
  });

  it("displays compilation target", () => {
    render(<StatusBar status="ready" target="cute" />);
    expect(screen.getByText("Target: cute")).toBeInTheDocument();
  });

  it("displays execution time inline with ready status", () => {
    render(<StatusBar status="ready" elapsedMs={456} />);
    expect(screen.getByText("Ready • 456ms")).toBeInTheDocument();
  });

  it("displays execution time in seconds when >= 1000ms", () => {
    render(<StatusBar status="ready" elapsedMs={2500} />);
    expect(screen.getByText("Ready • 2.5s")).toBeInTheDocument();
  });

  it("displays 0ms for zero elapsed time", () => {
    render(<StatusBar status="ready" elapsedMs={0} />);
    expect(screen.getByText("Ready • 0ms")).toBeInTheDocument();
  });

  it("prefers compilerVersion over buildManifest version", () => {
    render(
      <StatusBar
        status="ready"
        compilerVersion="2.0.0"
        buildManifest={{ version: "1.0", commit: "abc123", commit_short: "abc", built_at: null }}
      />
    );
    expect(screen.getByText(/2\.0\.0/)).toBeInTheDocument();
  });

  it("does not display elapsed time when null", () => {
    const { container } = render(<StatusBar status="ready" elapsedMs={null} />);
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Ready •/);
  });
});

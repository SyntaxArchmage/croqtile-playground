import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatusBar } from "@/components/StatusBar";
import { markChallengePassed, markTutorialStep, resetProgress } from "@/lib/progress";
import { CHALLENGES } from "@/lib/challenges";
import { TUTORIALS } from "@/lib/tutorials";

describe("StatusBar", () => {
  beforeEach(() => {
    resetProgress();
  });
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
    expect(screen.getAllByText(/1\.2\.3/).length).toBeGreaterThanOrEqual(1);
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
    expect(screen.getAllByText(/—/).length).toBeGreaterThanOrEqual(1);
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

  it("displays single-line selection count", () => {
    render(
      <StatusBar
        status="ready"
        selection={{ characters: 12, lines: 1 }}
      />
    );
    expect(screen.getByText("12 chars selected")).toBeInTheDocument();
  });

  it("displays multi-line selection count", () => {
    render(
      <StatusBar
        status="ready"
        selection={{ characters: 42, lines: 3 }}
      />
    );
    expect(screen.getByText("3 lines, 42 chars selected")).toBeInTheDocument();
  });

  it("hides selection when empty", () => {
    render(<StatusBar status="ready" selection={{ characters: 0, lines: 1 }} />);
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
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
    expect(screen.getAllByText(/2\.0\.0/).length).toBeGreaterThanOrEqual(1);
  });

  it("does not display elapsed time when null", () => {
    const { container } = render(<StatusBar status="ready" elapsedMs={null} />);
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Ready •/);
  });

  it("shows unsaved indicator when hasUnsavedChanges is true", () => {
    render(<StatusBar status="ready" hasUnsavedChanges />);
    expect(screen.getByLabelText("Unsaved changes")).toBeInTheDocument();
    expect(screen.getByText("Unsaved")).toBeInTheDocument();
  });

  it("hides unsaved indicator when hasUnsavedChanges is false", () => {
    render(<StatusBar status="ready" hasUnsavedChanges={false} />);
    expect(screen.queryByLabelText("Unsaved changes")).not.toBeInTheDocument();
  });

  it("shows challenge progress when panelMode is challenge", () => {
    markChallengePassed(CHALLENGES[0].id);
    markChallengePassed(CHALLENGES[1].id);
    render(<StatusBar status="ready" panelMode="challenge" />);
    expect(screen.getByLabelText(`2/${CHALLENGES.length} challenges passed`)).toHaveTextContent(
      `2/${CHALLENGES.length} challenges passed`,
    );
  });

  it("shows tutorial progress when panelMode is tutorial", () => {
    const tut = TUTORIALS[0];
    markTutorialStep(tut.id, tut.steps.length - 1);
    render(<StatusBar status="ready" panelMode="tutorial" />);
    expect(screen.getByLabelText(`1/${TUTORIALS.length} tutorials completed`)).toHaveTextContent(
      `1/${TUTORIALS.length} tutorials completed`,
    );
  });

  it("hides progress summary when panelMode is closed", () => {
    markChallengePassed(CHALLENGES[0].id);
    render(<StatusBar status="ready" panelMode="closed" />);
    expect(screen.queryByText(/challenges passed/)).not.toBeInTheDocument();
    expect(screen.queryByText(/tutorials completed/)).not.toBeInTheDocument();
  });

  it("uses zero server snapshot for progress subscription", () => {
    const serverSnapshots: Array<() => unknown> = [];
    const spy = jest.spyOn(React, "useSyncExternalStore").mockImplementation(
      (subscribe, getSnapshot, getServerSnapshot) => {
        if (getServerSnapshot) serverSnapshots.push(getServerSnapshot);
        return getSnapshot();
      },
    );

    render(<StatusBar status="ready" />);
    expect(serverSnapshots.some((fn) => fn() === 0)).toBe(true);

    spy.mockRestore();
  });
});

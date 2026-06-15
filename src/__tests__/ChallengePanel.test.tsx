import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockMarkChallengePassed = jest.fn();
const mockRecordChallengeAttempt = jest.fn();
let mockIsChallengePassed = false;
let mockChallengeProgress: { status: string; attempts: number; bestCode?: string } = {
  status: "not_started",
  attempts: 0,
};

jest.mock("@/lib/progress", () => ({
  isChallengePassed: () => mockIsChallengePassed,
  markChallengePassed: (...args: unknown[]) => mockMarkChallengePassed(...args),
  getChallengeProgress: () => mockChallengeProgress,
  recordChallengeAttempt: (...args: unknown[]) => mockRecordChallengeAttempt(...args),
}));

import { ChallengePanel } from "@/components/ChallengePanel";

describe("ChallengePanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsChallengePassed = false;
    mockChallengeProgress = { status: "not_started", attempts: 0 };
  });

  it("renders challenges header", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    expect(screen.getByText("Challenges")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={onClose} lastOutput="" />
    );
    fireEvent.click(screen.getByLabelText("Close challenges panel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders challenge titles from the list", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    expect(screen.getByText("Hello Threads")).toBeInTheDocument();
  });

  it("shows difficulty badges", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    expect(screen.getAllByText("easy").length).toBeGreaterThan(0);
    expect(screen.getAllByText("medium").length).toBeGreaterThan(0);
  });

  it("shows passed badge when challenge is passed", () => {
    mockIsChallengePassed = true;
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    expect(screen.getAllByText("passed").length).toBeGreaterThan(0);
  });

  it("shows attempt count when challenge has attempts", () => {
    mockChallengeProgress = { status: "attempted", attempts: 3 };
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    expect(screen.getAllByText(/3 attempts/).length).toBeGreaterThan(0);
  });

  it("loads starter code when challenge selected", () => {
    const onLoadCode = jest.fn();
    render(
      <ChallengePanel onLoadCode={onLoadCode} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    expect(onLoadCode).toHaveBeenCalled();
  });

  it("shows challenge detail view with Back button", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });

  it("shows Reset Code button in detail view", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    expect(screen.getByText("Reset Code")).toBeInTheDocument();
  });

  it("returns to list on Back click", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    fireEvent.click(screen.getByText("← Back"));
    expect(screen.getByText("Challenges")).toBeInTheDocument();
  });

  it("shows test results as not-ran when no output", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    expect(screen.getByText("Tests")).toBeInTheDocument();
  });

  it("shows expected/actual diff when test fails with output", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="wrong output" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    expect(screen.getByText("Expected:")).toBeInTheDocument();
    expect(screen.getByText("Got:")).toBeInTheDocument();
  });

  it("shows hint button when challenge has hint", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    expect(screen.getByText("Show hint")).toBeInTheDocument();
  });

  it("reveals hint on click", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    fireEvent.click(screen.getByText("Show hint"));
    expect(screen.queryByText("Show hint")).not.toBeInTheDocument();
  });

  it("resets code on Reset Code click", () => {
    const onLoadCode = jest.fn();
    render(
      <ChallengePanel onLoadCode={onLoadCode} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    onLoadCode.mockClear();
    fireEvent.click(screen.getByText("Reset Code"));
    expect(onLoadCode).toHaveBeenCalledTimes(1);
  });

  it("renders with initialId", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" initialId="c01" />
    );
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });

  it("shows challenge list when initialId is invalid", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" initialId="nonexistent" />
    );
    expect(screen.getByText("Hello Threads")).toBeInTheDocument();
    expect(screen.queryByText("← Back")).not.toBeInTheDocument();
  });

  it("shows close button in detail view", () => {
    const onClose = jest.fn();
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={onClose} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    const closeBtns = screen.getAllByLabelText("Close challenges panel");
    fireEvent.click(closeBtns[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows Next Challenge button when all tests pass", () => {
    const passingOutput = "Hello from thread 0\nHello from thread 1\nHello from thread 2\nHello from thread 3";
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput={passingOutput} initialId="c01" />
    );
    expect(screen.getByText("All tests passed!")).toBeInTheDocument();
    const nextBtn = screen.getByRole("button", { name: /Next/ });
    expect(nextBtn).toBeInTheDocument();
  });

  it("navigates to next challenge on Next click", () => {
    const passingOutput = "Hello from thread 0\nHello from thread 1\nHello from thread 2\nHello from thread 3";
    const onLoadCode = jest.fn();
    render(
      <ChallengePanel onLoadCode={onLoadCode} onClose={() => {}} lastOutput={passingOutput} initialId="c01" />
    );
    onLoadCode.mockClear();
    const nextBtn = screen.getByRole("button", { name: /Next/ });
    fireEvent.click(nextBtn);
    expect(onLoadCode).toHaveBeenCalled();
  });

  it("filters challenges by search query", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    const search = screen.getByLabelText("Search challenges");
    fireEvent.change(search, { target: { value: "DMA" } });
    expect(screen.getByText("DMA Reverse")).toBeInTheDocument();
    expect(screen.queryByText("Hello Threads")).not.toBeInTheDocument();
  });

  it("shows no-results message for unmatched search", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    const search = screen.getByLabelText("Search challenges");
    fireEvent.change(search, { target: { value: "zzzznotfound" } });
    expect(screen.getByText("No challenges match")).toBeInTheDocument();
  });

  it("filters challenges by difficulty", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByRole("button", { name: "Easy" }));
    expect(screen.getByText("Hello Threads")).toBeInTheDocument();
    expect(screen.queryByText("DMA Reverse")).not.toBeInTheDocument();
    expect(screen.queryByText("Matrix Trace")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("Hello Threads")).toBeInTheDocument();
    expect(screen.getByText("DMA Reverse")).toBeInTheDocument();
    expect(screen.getByText("Matrix Trace")).toBeInTheDocument();
  });

  it("records attempt and marks passed when output changes with all tests passing", () => {
    const passingOutput = "Hello from thread 0\nHello from thread 1\nHello from thread 2\nHello from thread 3";
    const getCode = jest.fn(() => "my code");
    const { rerender } = render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" getCode={getCode} initialId="c01" />
    );
    rerender(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput={passingOutput} getCode={getCode} initialId="c01" />
    );
    expect(mockRecordChallengeAttempt).toHaveBeenCalledWith("c01");
    expect(mockMarkChallengePassed).toHaveBeenCalledWith("c01", "my code");
  });

  it("marks passed without getCode prop (no bestCode)", () => {
    const passingOutput = "Hello from thread 0\nHello from thread 1\nHello from thread 2\nHello from thread 3";
    const { rerender } = render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" initialId="c01" />
    );
    rerender(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput={passingOutput} initialId="c01" />
    );
    expect(mockMarkChallengePassed).toHaveBeenCalledWith("c01", undefined);
  });

  it("records attempt but does not mark passed when tests fail", () => {
    const { rerender } = render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" initialId="c01" />
    );
    rerender(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="wrong output" initialId="c01" />
    );
    expect(mockRecordChallengeAttempt).toHaveBeenCalledWith("c01");
    expect(mockMarkChallengePassed).not.toHaveBeenCalled();
  });

  it("shows attempt count on success (plural)", () => {
    const passingOutput = "Hello from thread 0\nHello from thread 1\nHello from thread 2\nHello from thread 3";
    mockChallengeProgress = { status: "passed", attempts: 3 };
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput={passingOutput} initialId="c01" />
    );
    expect(screen.getByText("Solved in 3 attempts")).toBeInTheDocument();
  });

  it("shows singular attempt on success when solved in 1 attempt", () => {
    const passingOutput = "Hello from thread 0\nHello from thread 1\nHello from thread 2\nHello from thread 3";
    mockChallengeProgress = { status: "passed", attempts: 1 };
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput={passingOutput} initialId="c01" />
    );
    expect(screen.getByText("Solved in 1 attempt")).toBeInTheDocument();
  });

  it("truncates long expected/actual output in test failure diff", () => {
    const longOutput = "x".repeat(100);
    const { rerender } = render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" initialId="c01" />
    );
    rerender(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput={longOutput} initialId="c01" />
    );
    const gotText = screen.getByText(/^x{80}\.\.\.$/);
    expect(gotText).toBeInTheDocument();
  });

  it("does not show Next button on last challenge", () => {
    const lastOutput = "scaled[0] = 3\nscaled[3] = 12\nscaled[7] = 24";
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput={lastOutput} initialId="c15" />
    );
    expect(screen.getByText("All tests passed!")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Next/ })).not.toBeInTheDocument();
  });

  it("scrolls to first failing test when scrollIntoView is available", () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const { rerender } = render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" initialId="c01" />
    );
    rerender(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="wrong output" initialId="c01" />
    );
    expect(scrollIntoView).toHaveBeenCalled();
    delete (Element.prototype as Record<string, unknown>).scrollIntoView;
  });

  it("shows Load Best button when challenge has best code saved", () => {
    const passingOutput = "Hello from thread 0\nHello from thread 1\nHello from thread 2\nHello from thread 3";
    mockChallengeProgress = { status: "passed", attempts: 3, bestCode: "saved solution" };
    const onLoadCode = jest.fn();
    render(
      <ChallengePanel onLoadCode={onLoadCode} onClose={() => {}} lastOutput={passingOutput} initialId="c01" />
    );
    const loadBest = screen.getByText("Load Best");
    fireEvent.click(loadBest);
    expect(onLoadCode).toHaveBeenCalledWith("saved solution");
  });

  it("shows '(no output)' when test output is whitespace-only", () => {
    const { rerender } = render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" initialId="c01" />
    );
    rerender(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="   " initialId="c01" />
    );
    expect(screen.getByText("(no output)")).toBeInTheDocument();
  });

  it("updates URL param when selecting a challenge", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />
    );
    fireEvent.click(screen.getByText("Hello Threads"));
    const params = new URLSearchParams(window.location.search);
    expect(params.get("challenge")).toBe("c01");
    window.history.pushState({}, "", "/");
  });

  it("removes challenge URL param on back", () => {
    window.history.pushState({}, "", "/?challenge=c01");
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" initialId="c01" />
    );
    fireEvent.click(screen.getByText("← Back"));
    const params = new URLSearchParams(window.location.search);
    expect(params.get("challenge")).toBeNull();
    window.history.pushState({}, "", "/");
  });
});

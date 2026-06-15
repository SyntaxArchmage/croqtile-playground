import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/lib/progress", () => ({
  isChallengePassed: () => false,
  markChallengePassed: jest.fn(),
}));

import { ChallengePanel } from "@/components/ChallengePanel";

describe("ChallengePanel", () => {
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
});

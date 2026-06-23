import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/lib/progress", () => ({
  isChallengePassed: () => false,
  markChallengePassed: jest.fn(),
  getChallengeProgress: () => ({ status: "not_started", attempts: 0 }),
  recordChallengeAttempt: jest.fn(),
}));

jest.mock("@/lib/challenges", () => ({
  CHALLENGES: [],
  getChallengeHints: () => [],
  ALL_TAGS: ["parallel", "foreach", "dma", "pipeline", "matrix", "array", "reduction", "math", "string", "pattern"],
  getChallengeTags: () => ["parallel"],
}));

import { ChallengePanel } from "@/components/ChallengePanel";

describe("ChallengePanel empty catalog", () => {
  it("renders progress summary without NaN when CHALLENGES is empty", () => {
    render(<ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />);
    expect(screen.getByTestId("challenge-progress-summary")).toHaveTextContent("0/0 passed");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows difficulty filters with zero totals when CHALLENGES is empty", () => {
    render(<ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="" />);
    expect(screen.getByRole("button", { name: /^All, 0 of 0 passed$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Easy, 0 of 0 passed$/ })).toBeInTheDocument();
  });
});

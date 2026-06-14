import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/lib/challenges", () => ({
  CHALLENGES: [],
}));
jest.mock("@/lib/checkTests", () => ({
  checkTests: () => [],
}));
jest.mock("@/lib/progress", () => ({
  isChallengePassed: () => false,
  markChallengePassed: () => {},
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
    const closeBtn = screen.getByText("×");
    closeBtn.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

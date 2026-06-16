import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Challenge } from "@/lib/challenges";
import type { Tutorial } from "@/lib/tutorials";

jest.mock("@/lib/progress", () => ({
  isChallengePassed: () => false,
  markChallengePassed: jest.fn(),
  getChallengeProgress: () => ({ status: "not_started", attempts: 0 }),
  recordChallengeAttempt: jest.fn(),
  getTutorialProgress: () => -1,
  markTutorialStep: jest.fn(),
}));

const emptyTestsChallenge: Challenge = {
  id: "empty-tests",
  title: "No Tests Challenge",
  difficulty: "easy",
  description: "Challenge with zero tests",
  starterCode: "starter",
  tests: [],
};

const emptyStepsTutorial: Tutorial = {
  id: "empty-steps",
  title: "Empty Tutorial",
  description: "Tutorial with no steps",
  steps: [],
};

const sparseTutorial: Tutorial = {
  id: "sparse",
  title: "Sparse Tutorial",
  description: "Step missing content",
  steps: [
    { title: "Blank step", content: "   ", code: "code-a" },
    { title: "Normal step", content: "Hello", code: "code-b" },
  ],
};

jest.mock("@/lib/challenges", () => {
  const actual = jest.requireActual("@/lib/challenges");
  return {
    ...actual,
    CHALLENGES: [...actual.CHALLENGES, emptyTestsChallenge],
  };
});

jest.mock("@/lib/tutorials", () => {
  const actual = jest.requireActual("@/lib/tutorials");
  return {
    ...actual,
    TUTORIALS: [...actual.TUTORIALS, emptyStepsTutorial, sparseTutorial],
  };
});

import { ChallengePanel } from "@/components/ChallengePanel";
import { TutorialPanel } from "@/components/TutorialPanel";
import { checkTests } from "@/lib/checkTests";
import { decodeCode, encodeCode } from "@/lib/urlCodec";

describe("ChallengePanel edge cases", () => {
  it("shows message when challenge has zero tests", () => {
    render(
      <ChallengePanel onLoadCode={() => {}} onClose={() => {}} lastOutput="anything" initialId="empty-tests" />,
    );
    expect(screen.getByTestId("no-tests-message")).toHaveTextContent("No tests configured");
    expect(screen.queryByText("All tests passed!")).not.toBeInTheDocument();
  });

  it("uses fallback label for empty test descriptions", () => {
    const c: Challenge = {
      id: "no-desc",
      title: "No Desc",
      difficulty: "easy",
      description: "x",
      starterCode: "",
      tests: [{ expectedOutput: "hello", description: "" }],
    };
    const results = checkTests(c, "hello\n");
    expect(results[0].description).toBe("Test 1");
    expect(results[0].passed).toBe(true);
  });
});

describe("TutorialPanel edge cases", () => {
  it("handles tutorial with empty steps array without crashing", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Empty Tutorial"));
    expect(screen.getByTestId("no-steps-message")).toBeInTheDocument();
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });

  it("shows placeholder when step content is missing or whitespace-only", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="sparse" />);
    expect(screen.getByTestId("empty-step-content")).toHaveTextContent("No content for this step.");
  });
});

describe("checkTests additional edge cases", () => {
  function makeChallenge(tests: { expectedOutput: string; description: string }[]): Challenge {
    return {
      id: "edge",
      title: "Edge",
      difficulty: "easy",
      description: "",
      starterCode: "",
      tests,
    };
  }

  it("returns empty array for challenge with zero tests", () => {
    expect(checkTests(makeChallenge([]), "hello\n")).toEqual([]);
  });

  it("normalizes CRLF in multi-line expected output", () => {
    const c = makeChallenge([{ expectedOutput: "line1\r\nline2", description: "crlf" }]);
    const results = checkTests(c, "line1\nline2\n");
    expect(results[0].passed).toBe(true);
  });

  it("matches multi-line expected with trailing whitespace on lines", () => {
    const c = makeChallenge([{ expectedOutput: "a  \n  b", description: "ws lines" }]);
    const results = checkTests(c, "a\nb\n");
    expect(results[0].passed).toBe(true);
  });
});

describe("urlCodec additional edge cases", () => {
  it("round-trips large source (500k chars)", () => {
    const code = "x".repeat(500_000);
    expect(decodeCode(encodeCode(code))).toBe(code);
  });

  it("round-trips emoji and CJK unicode", () => {
    const code = `// 🎉 你好\n__co__ void x() { println("π"); }`;
    expect(decodeCode(encodeCode(code))).toBe(code);
  });

  it("round-trips astral-plane characters", () => {
    const code = "😀\u{1D400}";
    expect(decodeCode(encodeCode(code))).toBe(code);
  });
});

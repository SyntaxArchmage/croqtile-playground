import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TUTORIALS, type Tutorial, type TutorialStep } from "@/lib/tutorials";

let mockTutorialProgress = -1;

jest.mock("@/lib/progress", () => ({
  getTutorialProgress: () => mockTutorialProgress,
  markTutorialStep: () => {},
}));

import { TutorialPanel } from "@/components/TutorialPanel";

describe("TutorialPanel", () => {
  beforeEach(() => {
    mockTutorialProgress = -1;
  });

  it("renders tutorials header", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    expect(screen.getByText("Tutorials")).toBeInTheDocument();
  });

  it("renders all tutorial titles", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    expect(screen.getByText("Hello Croqtile")).toBeInTheDocument();
    expect(screen.getByText("Parallel Execution")).toBeInTheDocument();
    expect(screen.getByText("Memory Hierarchy")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = jest.fn();
    render(<TutorialPanel onLoadCode={() => {}} onClose={onClose} />);
    fireEvent.click(screen.getByText("×"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("loads code when tutorial is selected", () => {
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    expect(onLoadCode).toHaveBeenCalled();
  });

  it("shows step navigation after selecting tutorial", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    expect(screen.getByText("← Back")).toBeInTheDocument();
    expect(screen.getByText("Load Code")).toBeInTheDocument();
    expect(screen.getByText("Next →")).toBeInTheDocument();
  });

  it("renders breadcrumb on tutorial step view", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="ch01" />);
    fireEvent.click(screen.getByText("Next →"));
    const breadcrumb = screen.getByTestId("tutorial-breadcrumb");
    expect(breadcrumb).toHaveTextContent("Tutorials");
    expect(breadcrumb).toHaveTextContent("Hello Croqtile");
    expect(breadcrumb).toHaveTextContent("Step 2: Printing output");
  });

  it("breadcrumb Tutorials link returns to list", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="ch01" />);
    fireEvent.click(screen.getByTestId("tutorial-breadcrumb").querySelector("button")!);
    expect(screen.getByRole("region", { name: "Tutorials" })).toBeInTheDocument();
  });

  it("breadcrumb tutorial title navigates to step 1", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="ch01" />);
    fireEvent.click(screen.getByText("Next →"));
    const breadcrumbButtons = screen.getByTestId("tutorial-breadcrumb").querySelectorAll("button");
    fireEvent.click(breadcrumbButtons[1]);
    expect(screen.getByTestId("tutorial-breadcrumb")).toHaveTextContent(
      "Step 1: The __co__ keyword",
    );
  });

  it("navigates forward through steps", () => {
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    const nextBtn = screen.getByText("Next →");
    fireEvent.click(nextBtn);
    expect(onLoadCode).toHaveBeenCalledTimes(2);
  });

  it("disables Prev on first step", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    const prevBtn = screen.getByText("← Prev");
    expect(prevBtn).toBeDisabled();
  });

  it("returns to tutorial list on Back", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    fireEvent.click(screen.getByText("← Back"));
    expect(screen.getByText("Tutorials")).toBeInTheDocument();
  });

  it("shows step counter", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    expect(screen.getByText(/\/ 3/)).toBeInTheDocument();
  });

  it("loads code on Load Code click", () => {
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    onLoadCode.mockClear();
    fireEvent.click(screen.getByText("Load Code"));
    expect(onLoadCode).toHaveBeenCalledTimes(1);
  });

  it("renders close button in step view", () => {
    const onClose = jest.fn();
    render(<TutorialPanel onLoadCode={() => {}} onClose={onClose} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    const closeBtns = screen.getAllByLabelText("Close tutorials panel");
    fireEvent.click(closeBtns[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders with initialId", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="ch01" />);
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });

  it("navigates backward through steps", () => {
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    fireEvent.click(screen.getByText("Next →"));
    onLoadCode.mockClear();
    fireEvent.click(screen.getByText("← Prev"));
    expect(onLoadCode).toHaveBeenCalledTimes(1);
    expect(screen.getByText("← Prev")).toBeDisabled();
  });

  it("shows completion message on last step", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    fireEvent.click(screen.getByText("Next →"));
    fireEvent.click(screen.getByText("Next →"));
    expect(screen.queryByText("Next →")).not.toBeInTheDocument();
    expect(screen.getByTestId("tutorial-completion-message")).toHaveTextContent(
      "Tutorial complete! You've learned about Hello Croqtile.",
    );
    expect(screen.getByTestId("next-tutorial-button")).toHaveTextContent("Next Tutorial →");
  });

  it("loads next tutorial when Next Tutorial is clicked", () => {
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    fireEvent.click(screen.getByText("Next →"));
    fireEvent.click(screen.getByText("Next →"));
    onLoadCode.mockClear();
    fireEvent.click(screen.getByTestId("next-tutorial-button"));
    expect(screen.getByRole("region", { name: "Tutorial: Parallel Execution" })).toBeInTheDocument();
    expect(onLoadCode).toHaveBeenCalled();
  });

  it("beginTutorial omits step param when next tutorial has no steps", () => {
    const emptyNext: Tutorial = {
      id: "empty-next-after-ch01",
      title: "Empty Next Tutorial",
      description: "Inserted after ch01 with no steps",
      steps: [],
    };
    const ch01Index = TUTORIALS.findIndex((t) => t.id === "ch01");
    TUTORIALS.splice(ch01Index + 1, 0, emptyNext);
    try {
      render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
      fireEvent.click(screen.getByText("Hello Croqtile"));
      fireEvent.click(screen.getByText("Next →"));
      fireEvent.click(screen.getByText("Next →"));
      fireEvent.click(screen.getByTestId("next-tutorial-button"));
      expect(screen.getByTestId("no-steps-message")).toBeInTheDocument();
      const params = new URLSearchParams(window.location.search);
      expect(params.get("tutorial")).toBe("empty-next-after-ch01");
      expect(params.has("step")).toBe(false);
      window.history.pushState({}, "", "/");
    } finally {
      TUTORIALS.splice(ch01Index + 1, 1);
    }
  });

  it("respects step parameter from URL", () => {
    window.history.pushState({}, "", "?tutorial=ch01&step=2");
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="ch01" />);
    expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
    window.history.pushState({}, "", "/");
  });

  it("loads code for initialId on mount", () => {
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} initialId="ch01" />);
    expect(onLoadCode).toHaveBeenCalledTimes(1);
    expect(onLoadCode).toHaveBeenCalledWith(
      expect.stringContaining('println("Hello from Croqtile!")'),
    );
  });

  it("loads code for deep-linked step on mount", () => {
    window.history.pushState({}, "", "/?tutorial=ch01&step=2");
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} initialId="ch01" />);
    expect(onLoadCode).toHaveBeenCalledTimes(1);
    expect(onLoadCode).toHaveBeenCalledWith(
      expect.stringContaining('println("The answer is", 42)'),
    );
    window.history.pushState({}, "", "/");
  });

  it("shows tutorial list when initialId is invalid", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="nonexistent" />);
    expect(screen.getByText("Hello Croqtile")).toBeInTheDocument();
    expect(screen.queryByText("← Back")).not.toBeInTheDocument();
  });

  it("defaults to step 0 when URL step is NaN", () => {
    window.history.pushState({}, "", "?tutorial=ch01&step=abc");
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="ch01" />);
    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
    window.history.pushState({}, "", "/");
  });

  it("filters tutorials by search query", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    const search = screen.getByLabelText("Search tutorials");
    fireEvent.change(search, { target: { value: "Parallel" } });
    expect(screen.getByText("Parallel Execution")).toBeInTheDocument();
    expect(screen.queryByText("Hello Croqtile")).not.toBeInTheDocument();
  });

  it("filters tutorials case-insensitively by title", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    const search = screen.getByLabelText("Search tutorials");
    fireEvent.change(search, { target: { value: "hello croqtile" } });
    expect(screen.getByText("Hello Croqtile")).toBeInTheDocument();
    expect(screen.queryByText("Parallel Execution")).not.toBeInTheDocument();
  });

  it("does not filter tutorials by description text", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    const search = screen.getByLabelText("Search tutorials");
    fireEvent.change(search, { target: { value: "maps work to" } });
    expect(screen.getByText("No tutorials match")).toBeInTheDocument();
  });

  it("clears tutorial search and restores full list", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    const search = screen.getByLabelText("Search tutorials");
    fireEvent.change(search, { target: { value: "Parallel" } });
    expect(screen.queryByText("Hello Croqtile")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(screen.getByText("Hello Croqtile")).toBeInTheDocument();
    expect(screen.getByText("Parallel Execution")).toBeInTheDocument();
  });

  it("shows no-results message for unmatched search", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    const search = screen.getByLabelText("Search tutorials");
    fireEvent.change(search, { target: { value: "zzzznotfound" } });
    expect(screen.getByText("No tutorials match")).toBeInTheDocument();
  });

  it("shows step indicator dots", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    expect(screen.getAllByTestId("tutorial-step-dot")).toHaveLength(3);
  });

  it("marks visited dots with accent class", () => {
    mockTutorialProgress = 1;
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    const dots = screen.getAllByTestId("tutorial-step-dot");
    expect(dots[0].className).toContain("bg-[var(--accent)]");
    expect(dots[1].className).toContain("bg-[var(--accent)]");
    expect(dots[2].className).toContain("bg-[var(--border)]");
  });

  it("persists step number in URL when navigating", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    fireEvent.click(screen.getByText("Next →"));
    const params = new URLSearchParams(window.location.search);
    expect(params.get("step")).toBe("2");
    window.history.pushState({}, "", "/");
  });

  it("initializes to step from URL param when deep-linked", () => {
    window.history.pushState({}, "", "/?tutorial=ch01&step=2");
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} initialId="ch01" />);
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    window.history.pushState({}, "", "/");
  });

  it("clamps out-of-range step param to valid range", () => {
    window.history.pushState({}, "", "/?tutorial=ch01&step=99");
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} initialId="ch01" />);
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    window.history.pushState({}, "", "/");
  });

  it("ignores invalid step param and defaults to step 0", () => {
    window.history.pushState({}, "", "/?tutorial=ch01&step=abc");
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} initialId="ch01" />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    window.history.pushState({}, "", "/");
  });

  it("shows done badge when tutorial progress reaches last step", () => {
    mockTutorialProgress = 99;
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    const doneBadges = screen.getAllByText("done");
    expect(doneBadges.length).toBeGreaterThan(0);
  });

  it("does not show done badge when tutorial not completed", () => {
    mockTutorialProgress = 0;
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    expect(screen.queryByText("done")).not.toBeInTheDocument();
  });

  it("shows in progress badge for started but not completed tutorials", () => {
    mockTutorialProgress = 0;
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    expect(screen.getAllByText("in progress").length).toBeGreaterThan(0);
  });

  it("calls onLoadCode when Try it button is clicked", () => {
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    fireEvent.click(screen.getByText("Next →"));
    const tryButtons = screen.queryAllByText("Try it →");
    expect(tryButtons.length).toBeGreaterThan(0);
    fireEvent.click(tryButtons[0]);
    expect(onLoadCode).toHaveBeenCalled();
  });

  it("shows progress summary with done count", () => {
    mockTutorialProgress = -1;
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    expect(screen.getByTestId("tutorial-progress-summary")).toHaveTextContent(/0\/\d+ done/);
  });

  it("navigates to a step when clicking a step dot", () => {
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    const dots = screen.getAllByTestId("tutorial-step-dot");
    fireEvent.click(dots[2]);
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    expect(onLoadCode).toHaveBeenCalled();
  });

  it("shows nonzero progress in summary when tutorials completed", () => {
    mockTutorialProgress = 99;
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    const summary = screen.getByTestId("tutorial-progress-summary");
    expect(summary.textContent).toMatch(/^\d+\/\d+ done$/);
    expect(summary.textContent).not.toMatch(/^0\//);
  });

  it("shows no progress badge when tutorial not started", () => {
    mockTutorialProgress = -1;
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    expect(screen.queryByText("done")).not.toBeInTheDocument();
    expect(screen.queryByText("in progress")).not.toBeInTheDocument();
  });

  it("loads first step code when deep-linked step has no code", () => {
    const ch01 = TUTORIALS.find((t) => t.id === "ch01")!;
    const step1Code = ch01.steps[1].code;
    const fallbackCode = ch01.steps[0].code;
    // @ts-expect-error simulate missing code on deep-linked step
    delete ch01.steps[1].code;

    window.history.pushState({}, "", "/?tutorial=ch01&step=2");
    const onLoadCode = jest.fn();
    render(<TutorialPanel onLoadCode={onLoadCode} onClose={() => {}} initialId="ch01" />);
    expect(onLoadCode).toHaveBeenCalledWith(fallbackCode);

    ch01.steps[1].code = step1Code;
    window.history.pushState({}, "", "/");
  });

  const emptyStepsTutorial: Tutorial = {
    id: "test-empty-steps",
    title: "Test Empty Tutorial",
    description: "Tutorial with no steps",
    steps: [],
  };

  const sparseStepsTutorial: Tutorial = {
    id: "test-sparse-steps",
    title: "Test Sparse Steps Tutorial",
    description: "Has undefined step entry",
    steps: [
      { title: "First step", content: "ok", code: "x" },
      undefined as unknown as TutorialStep,
    ],
  };

  function withExtraTutorials(run: () => void) {
    TUTORIALS.push(emptyStepsTutorial, sparseStepsTutorial);
    try {
      run();
    } finally {
      TUTORIALS.splice(TUTORIALS.length - 2, 2);
    }
  }

  it("shows no-steps message when tutorial has empty steps array", () => {
    withExtraTutorials(() => {
      render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
      fireEvent.click(screen.getByText("Test Empty Tutorial"));
      expect(screen.getByTestId("no-steps-message")).toHaveTextContent(
        "This tutorial has no steps yet.",
      );
    });
  });

  it("clears tutorial URL param when selecting zero-step tutorial", () => {
    withExtraTutorials(() => {
      window.history.pushState({}, "", "/?step=2&challenge=foo");
      render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
      fireEvent.click(screen.getByText("Test Empty Tutorial"));
      const params = new URLSearchParams(window.location.search);
      expect(params.get("tutorial")).toBe("test-empty-steps");
      expect(params.has("step")).toBe(false);
      expect(params.has("challenge")).toBe(false);
      window.history.pushState({}, "", "/");
    });
  });

  it("returns to tutorial list from no-steps view via Back", () => {
    withExtraTutorials(() => {
      render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
      fireEvent.click(screen.getByText("Test Empty Tutorial"));
      fireEvent.click(screen.getByText("← Back"));
      expect(screen.getByText("Tutorials")).toBeInTheDocument();
      expect(screen.queryByTestId("no-steps-message")).not.toBeInTheDocument();
    });
  });

  it("shows missing-step message when step index points to invalid data", () => {
    withExtraTutorials(() => {
      window.history.pushState({}, "", "/?tutorial=test-sparse-steps&step=2");
      render(
        <TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="test-sparse-steps" />,
      );
      expect(screen.getByTestId("missing-step-message")).toHaveTextContent(
        "Step 2 is missing or invalid.",
      );
      window.history.pushState({}, "", "/");
    });
  });

  it("returns to tutorial list from missing-step view via Back", () => {
    withExtraTutorials(() => {
      window.history.pushState({}, "", "/?tutorial=test-sparse-steps&step=2");
      render(
        <TutorialPanel onLoadCode={() => {}} onClose={() => {}} initialId="test-sparse-steps" />,
      );
      fireEvent.click(screen.getByText("← Back"));
      expect(screen.getByText("Tutorials")).toBeInTheDocument();
      expect(screen.queryByTestId("missing-step-message")).not.toBeInTheDocument();
      window.history.pushState({}, "", "/");
    });
  });

  it("shows empty content placeholder when step has no content", async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock("@/lib/tutorials", () => ({
        TUTORIALS: [
          {
            id: "empty-content",
            title: "Empty Content Step",
            description: "A tutorial with a step that has no content",
            steps: [
              { title: "Step One", content: "", code: "some-code" },
            ],
          },
        ],
      }));
      jest.doMock("@/lib/progress", () => ({
        getTutorialProgress: () => -1,
        markTutorialStep: () => {},
      }));

      const React = require("react");
      const { act } = require("react");
      const { createRoot } = require("react-dom/client");
      const { TutorialPanel: IsolatedPanel } = require("@/components/TutorialPanel");
      window.history.pushState({}, "", "/?tutorial=empty-content");
      const container = document.createElement("div");
      const root = createRoot(container);
      await act(async () => {
        root.render(
          React.createElement(IsolatedPanel, {
            onLoadCode: () => {},
            onClose: () => {},
            initialId: "empty-content",
          }),
        );
      });
      expect(container.querySelector('[data-testid="empty-step-content"]')).toBeTruthy();
      window.history.pushState({}, "", "/");
    });
  });

  it("falls back to first step code when deep-linked step lacks code", async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock("@/lib/tutorials", () => ({
        TUTORIALS: [
          {
            id: "nocode",
            title: "No Code Step",
            description: "Tutorial with a step missing code",
            steps: [
              { title: "First", content: "First step", code: "fallback-code" },
              { title: "Second", content: "Second step without code field" },
            ],
          },
        ],
      }));
      jest.doMock("@/lib/progress", () => ({
        getTutorialProgress: () => -1,
        markTutorialStep: () => {},
      }));

      const React = require("react");
      const { act } = require("react");
      const { createRoot } = require("react-dom/client");
      const { TutorialPanel: IsolatedPanel } = require("@/components/TutorialPanel");
      const onLoadCode = jest.fn();
      window.history.pushState({}, "", "/?tutorial=nocode&step=2");
      const container = document.createElement("div");
      const root = createRoot(container);
      await act(async () => {
        root.render(
          React.createElement(IsolatedPanel, {
            onLoadCode,
            onClose: () => {},
            initialId: "nocode",
          }),
        );
      });
      expect(onLoadCode).toHaveBeenCalledWith("fallback-code");
      window.history.pushState({}, "", "/");
    });
  });

  it("loads empty string when no step defines code", async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock("@/lib/tutorials", () => ({
        TUTORIALS: [
          {
            id: "no-code-anywhere",
            title: "No Code Anywhere",
            description: "Steps without code fields",
            steps: [
              { title: "First", content: "First step" },
              { title: "Second", content: "Second step" },
            ],
          },
        ],
      }));
      jest.doMock("@/lib/progress", () => ({
        getTutorialProgress: () => -1,
        markTutorialStep: () => {},
      }));

      const React = require("react");
      const { act } = require("react");
      const { createRoot } = require("react-dom/client");
      const { TutorialPanel: IsolatedPanel } = require("@/components/TutorialPanel");
      const onLoadCode = jest.fn();
      window.history.pushState({}, "", "/?tutorial=no-code-anywhere");
      const container = document.createElement("div");
      const root = createRoot(container);
      await act(async () => {
        root.render(
          React.createElement(IsolatedPanel, {
            onLoadCode,
            onClose: () => {},
            initialId: "no-code-anywhere",
          }),
        );
      });
      expect(onLoadCode).toHaveBeenCalledWith("");
      window.history.pushState({}, "", "/");
    });
  });

  it("shows empty content placeholder for whitespace-only step content", async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock("@/lib/tutorials", () => ({
        TUTORIALS: [
          {
            id: "whitespace-content",
            title: "Whitespace Content Step",
            description: "A tutorial step with only whitespace content",
            steps: [
              { title: "Step One", content: "   \t  ", code: "some-code" },
            ],
          },
        ],
      }));
      jest.doMock("@/lib/progress", () => ({
        getTutorialProgress: () => -1,
        markTutorialStep: () => {},
      }));

      const React = require("react");
      const { act } = require("react");
      const { createRoot } = require("react-dom/client");
      const { TutorialPanel: IsolatedPanel } = require("@/components/TutorialPanel");
      window.history.pushState({}, "", "/?tutorial=whitespace-content");
      const container = document.createElement("div");
      const root = createRoot(container);
      await act(async () => {
        root.render(
          React.createElement(IsolatedPanel, {
            onLoadCode: () => {},
            onClose: () => {},
            initialId: "whitespace-content",
          }),
        );
      });
      expect(container.querySelector('[data-testid="empty-step-content"]')).toBeTruthy();
      window.history.pushState({}, "", "/");
    });
  });

  it("shows empty content placeholder when step content is undefined", async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock("@/lib/tutorials", () => ({
        TUTORIALS: [
          {
            id: "undefined-content",
            title: "Undefined Content Step",
            description: "A tutorial step without a content field",
            steps: [
              { title: "Step One", code: "some-code" },
            ],
          },
        ],
      }));
      jest.doMock("@/lib/progress", () => ({
        getTutorialProgress: () => -1,
        markTutorialStep: () => {},
      }));

      const React = require("react");
      const { act } = require("react");
      const { createRoot } = require("react-dom/client");
      const { TutorialPanel: IsolatedPanel } = require("@/components/TutorialPanel");
      window.history.pushState({}, "", "/?tutorial=undefined-content");
      const container = document.createElement("div");
      const root = createRoot(container);
      await act(async () => {
        root.render(
          React.createElement(IsolatedPanel, {
            onLoadCode: () => {},
            onClose: () => {},
            initialId: "undefined-content",
          }),
        );
      });
      expect(container.querySelector('[data-testid="empty-step-content"]')).toBeTruthy();
      window.history.pushState({}, "", "/");
    });
  });

  it("loads empty string when the active step entry is invalid", async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock("@/lib/tutorials", () => ({
        TUTORIALS: [
          {
            id: "invalid-step-entry",
            title: "Invalid Step Entry",
            description: "First step slot is invalid",
            steps: [undefined],
          },
        ],
      }));
      jest.doMock("@/lib/progress", () => ({
        getTutorialProgress: () => -1,
        markTutorialStep: () => {},
      }));

      const React = require("react");
      const { act } = require("react");
      const { createRoot } = require("react-dom/client");
      const { TutorialPanel: IsolatedPanel } = require("@/components/TutorialPanel");
      const onLoadCode = jest.fn();
      window.history.pushState({}, "", "/?tutorial=invalid-step-entry");
      const container = document.createElement("div");
      const root = createRoot(container);
      await act(async () => {
        root.render(
          React.createElement(IsolatedPanel, {
            onLoadCode,
            onClose: () => {},
            initialId: "invalid-step-entry",
          }),
        );
      });
      expect(onLoadCode).toHaveBeenCalledWith("");
      expect(container.querySelector('[data-testid="missing-step-message"]')).toBeTruthy();
      window.history.pushState({}, "", "/");
    });
  });
});

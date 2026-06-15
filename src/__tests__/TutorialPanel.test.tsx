import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/lib/progress", () => ({
  getTutorialProgress: () => -1,
  markTutorialStep: () => {},
}));

import { TutorialPanel } from "@/components/TutorialPanel";

describe("TutorialPanel", () => {
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

  it("disables Next on last step", () => {
    render(<TutorialPanel onLoadCode={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Hello Croqtile"));
    fireEvent.click(screen.getByText("Next →"));
    fireEvent.click(screen.getByText("Next →"));
    expect(screen.getByText("Next →")).toBeDisabled();
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
});

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
});

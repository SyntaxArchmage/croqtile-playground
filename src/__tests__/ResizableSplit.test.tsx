import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResizableSplit } from "@/components/ResizableSplit";

describe("ResizableSplit", () => {
  it("renders left and right children", () => {
    render(
      <ResizableSplit
        left={<div>Left Content</div>}
        right={<div>Right Content</div>}
      />
    );
    expect(screen.getByText("Left Content")).toBeInTheDocument();
    expect(screen.getByText("Right Content")).toBeInTheDocument();
  });

  it("renders divider", () => {
    const { container } = render(
      <ResizableSplit
        left={<div>L</div>}
        right={<div>R</div>}
      />
    );
    const divider = container.querySelector(".cursor-col-resize");
    expect(divider).toBeInTheDocument();
  });

  it("applies initial ratio", () => {
    const { container } = render(
      <ResizableSplit
        left={<div>L</div>}
        right={<div>R</div>}
        initialRatio={0.5}
      />
    );
    const panels = container.querySelectorAll("[style]");
    expect(panels[0]).toHaveStyle({ width: "50%" });
  });

  it("uses default ratio of 0.35", () => {
    const { container } = render(
      <ResizableSplit
        left={<div>L</div>}
        right={<div>R</div>}
      />
    );
    const panels = container.querySelectorAll("[style]");
    expect(panels[0]).toHaveStyle({ width: "35%" });
  });
});

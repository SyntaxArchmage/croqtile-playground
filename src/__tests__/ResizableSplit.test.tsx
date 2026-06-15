import { render, screen, fireEvent } from "@testing-library/react";
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

  it("renders divider with separator role", () => {
    render(
      <ResizableSplit left={<div>L</div>} right={<div>R</div>} />
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("divider has aria attributes", () => {
    render(
      <ResizableSplit left={<div>L</div>} right={<div>R</div>} />
    );
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
    expect(sep).toHaveAttribute("aria-label", "Resize panels");
    expect(sep).toHaveAttribute("tabindex", "0");
  });

  it("adjusts ratio on ArrowRight key", () => {
    const { container } = render(
      <ResizableSplit left={<div>L</div>} right={<div>R</div>} initialRatio={0.35} />
    );
    const sep = screen.getByRole("separator");
    fireEvent.keyDown(sep, { key: "ArrowRight" });
    const left = container.querySelectorAll("[style]")[0];
    const width = parseFloat((left as HTMLElement).style.width);
    expect(width).toBeGreaterThan(35);
  });

  it("adjusts ratio on ArrowLeft key", () => {
    const { container } = render(
      <ResizableSplit left={<div>L</div>} right={<div>R</div>} initialRatio={0.35} />
    );
    const sep = screen.getByRole("separator");
    fireEvent.keyDown(sep, { key: "ArrowLeft" });
    const left = container.querySelectorAll("[style]")[0];
    const width = parseFloat((left as HTMLElement).style.width);
    expect(width).toBeLessThan(35);
  });

  it("clamps ratio at minimum on ArrowLeft", () => {
    const { container } = render(
      <ResizableSplit left={<div>L</div>} right={<div>R</div>} initialRatio={0.2} />
    );
    const sep = screen.getByRole("separator");
    fireEvent.keyDown(sep, { key: "ArrowLeft" });
    const left = container.querySelectorAll("[style]")[0];
    const width = parseFloat((left as HTMLElement).style.width);
    expect(width).toBeGreaterThanOrEqual(20);
  });

  it("clamps ratio at maximum on ArrowRight", () => {
    const { container } = render(
      <ResizableSplit left={<div>L</div>} right={<div>R</div>} initialRatio={0.6} />
    );
    const sep = screen.getByRole("separator");
    fireEvent.keyDown(sep, { key: "ArrowRight" });
    const left = container.querySelectorAll("[style]")[0];
    const width = parseFloat((left as HTMLElement).style.width);
    expect(width).toBeLessThanOrEqual(60);
  });
});

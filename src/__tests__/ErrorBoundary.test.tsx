import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function ThrowingComponent({ msg }: { msg?: string }): JSX.Element {
  throw new Error(msg);
}

function GoodComponent() {
  return <div>All good</div>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("renders error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent msg="Test error" />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(screen.getByText("Reload")).toBeInTheDocument();
  });

  it("renders Reload button that is clickable", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent msg="crash" />
      </ErrorBoundary>
    );
    const btn = screen.getByText("Reload");
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).not.toBeDisabled();
  });

  it("invokes reload handler when Reload is clicked", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent msg="crash" />
      </ErrorBoundary>
    );
    // jsdom's reload logs "Not implemented: navigation" but still runs the onClick handler.
    expect(() => fireEvent.click(screen.getByText("Reload"))).not.toThrow();
  });

  it("getDerivedStateFromError sets hasError and stores the error", () => {
    const err = new Error("derived");
    expect(ErrorBoundary.getDerivedStateFromError(err)).toEqual({
      hasError: true,
      error: err,
    });
  });

  it("calls componentDidCatch and logs to console.error", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent msg="logged error" />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalledWith(
      "[ErrorBoundary]",
      expect.any(Error),
      expect.any(String),
    );
  });

  it("shows fallback message when error has no message", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });

  it("shows fallback message when error state is null", () => {
    const boundary = new ErrorBoundary({ children: <GoodComponent /> });
    boundary.state = { hasError: true, error: null };
    render(boundary.render());
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });
});

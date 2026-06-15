import { render, screen } from "@testing-library/react";
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

  it("shows fallback message when error has no message", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });
});

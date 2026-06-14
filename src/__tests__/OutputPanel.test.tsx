import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OutputPanel } from "@/components/OutputPanel";

describe("OutputPanel", () => {
  it("shows placeholder when no output", () => {
    render(<OutputPanel output="" errors="" />);
    expect(screen.getByText(/Click "Run" or "Compile"/)).toBeInTheDocument();
  });

  it("displays output text", () => {
    render(<OutputPanel output="Hello from Croqtile!" errors="" />);
    expect(screen.getByText("Hello from Croqtile!")).toBeInTheDocument();
  });

  it("switches to errors tab when clicking Errors", () => {
    render(<OutputPanel output="good" errors="bad" />);
    fireEvent.click(screen.getByText("Errors"));
    expect(screen.getByText("bad")).toBeInTheDocument();
  });

  it("has Output and Errors tab buttons", () => {
    render(<OutputPanel output="" errors="" />);
    expect(screen.getByText("Output")).toBeInTheDocument();
    expect(screen.getByText("Errors")).toBeInTheDocument();
  });

  it("shows error indicator dot when errors present", () => {
    const { container } = render(<OutputPanel output="" errors="some error" />);
    const dot = container.querySelector(".bg-red-500");
    expect(dot).toBeInTheDocument();
  });
});

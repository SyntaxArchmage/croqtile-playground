import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ShortcutsDialog, SHORTCUT_GROUPS } from "../components/ShortcutsDialog";

describe("ShortcutsDialog", () => {
  it("renders grouped section headers", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    for (const group of SHORTCUT_GROUPS) {
      expect(screen.getByText(group.title)).toBeInTheDocument();
    }
  });

  it("renders shortcut descriptions", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    expect(screen.getByText("Run code")).toBeInTheDocument();
    expect(screen.getByText("Command palette")).toBeInTheDocument();
  });

  it("calls onClose from the Close button", () => {
    const onClose = jest.fn();
    render(<ShortcutsDialog onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has accessible dialog semantics", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "shortcuts-dialog-title");
  });
});

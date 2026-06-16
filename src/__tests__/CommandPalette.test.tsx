var syncEmptyEffects = false;

jest.mock("react", () => {
  const actual = jest.requireActual<typeof import("react")>("react");
  return {
    ...actual,
    useEffect: (fn: () => void | (() => void), deps?: readonly unknown[]) => {
      if (syncEmptyEffects && Array.isArray(deps) && deps.length === 0) {
        fn();
        return () => undefined;
      }
      return actual.useEffect(fn, deps);
    },
  };
});

import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CommandPalette, type CommandItem } from "@/components/CommandPalette";

function makeCommands(): CommandItem[] {
  return [
    { label: "Run Code", action: jest.fn(), shortcut: "Ctrl+Enter" },
    { label: "Compile Code", action: jest.fn(), shortcut: "Ctrl+Shift+Enter" },
    { label: "Format Code", action: jest.fn() },
  ];
}

describe("CommandPalette", () => {
  it("renders all commands", () => {
    const cmds = makeCommands();
    render(<CommandPalette commands={cmds} onClose={jest.fn()} />);
    expect(screen.getByText("Run Code")).toBeInTheDocument();
    expect(screen.getByText("Compile Code")).toBeInTheDocument();
    expect(screen.getByText("Format Code")).toBeInTheDocument();
  });

  it("renders keyboard shortcuts when present", () => {
    const cmds = makeCommands();
    render(<CommandPalette commands={cmds} onClose={jest.fn()} />);
    expect(screen.getByText("Ctrl+Enter")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+Shift+Enter")).toBeInTheDocument();
  });

  it("filters commands by search input", () => {
    const cmds = makeCommands();
    render(<CommandPalette commands={cmds} onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("Search commands"), {
      target: { value: "run" },
    });
    expect(screen.getByText("Run Code")).toBeInTheDocument();
    expect(screen.queryByText("Compile Code")).not.toBeInTheDocument();
    expect(screen.queryByText("Format Code")).not.toBeInTheDocument();
  });

  it("shows no-results message for unmatched query", () => {
    const cmds = makeCommands();
    render(<CommandPalette commands={cmds} onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("Search commands"), {
      target: { value: "zzzznotfound" },
    });
    expect(screen.getByText("No matching commands")).toBeInTheDocument();
  });

  it("Enter is a no-op when no commands match", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Search commands"), {
      target: { value: "zzzznotfound" },
    });
    fireEvent.keyDown(screen.getByLabelText("Search commands"), { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
    cmds.forEach((cmd) => expect(cmd.action).not.toHaveBeenCalled());
  });

  it("executes command and closes on click", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    fireEvent.click(screen.getByText("Run Code"));
    expect(cmds[0].action).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("navigates with ArrowDown/ArrowUp and executes on Enter", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    const input = screen.getByLabelText("Search commands");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(cmds[1].action).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ArrowUp does not go below zero", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    const input = screen.getByLabelText("Search commands");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(cmds[0].action).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", () => {
    const onClose = jest.fn();
    render(<CommandPalette commands={makeCommands()} onClose={onClose} />);
    fireEvent.keyDown(screen.getByLabelText("Search commands"), {
      key: "Escape",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when clicking overlay background", () => {
    const onClose = jest.fn();
    const { container } = render(
      <CommandPalette commands={makeCommands()} onClose={onClose} />
    );
    fireEvent.click(container.firstElementChild!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking inside dialog", () => {
    const onClose = jest.fn();
    render(<CommandPalette commands={makeCommands()} onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("highlights item on mouse enter", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    const options = screen.getAllByRole("option");
    fireEvent.mouseEnter(options[2].querySelector("button")!);
    fireEvent.keyDown(screen.getByLabelText("Search commands"), {
      key: "Enter",
    });
    expect(cmds[2].action).toHaveBeenCalledTimes(1);
  });

  it("closes on mousedown outside dialog", () => {
    const onClose = jest.fn();
    render(<CommandPalette commands={makeCommands()} onClose={onClose} />);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets highlight when search changes", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    const input = screen.getByLabelText("Search commands");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.change(input, { target: { value: "compile" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(cmds[1].action).toHaveBeenCalledTimes(1);
  });

  it("does not close on mousedown inside dialog", () => {
    const onClose = jest.fn();
    render(<CommandPalette commands={makeCommands()} onClose={onClose} />);
    const dialog = screen.getByRole("dialog");
    fireEvent.mouseDown(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ArrowDown does not exceed filtered length", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    const input = screen.getByLabelText("Search commands");
    for (let i = 0; i < 10; i++) fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(cmds[2].action).toHaveBeenCalledTimes(1);
  });

  it("ignores unhandled keys without closing or executing", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    const input = screen.getByLabelText("Search commands");
    fireEvent.keyDown(input, { key: "Tab" });
    fireEvent.keyDown(input, { key: "Home" });
    fireEvent.keyDown(input, { key: "End" });
    expect(onClose).not.toHaveBeenCalled();
    cmds.forEach((cmd) => expect(cmd.action).not.toHaveBeenCalled());
  });

  it("shows all commands when search is whitespace only", () => {
    const cmds = makeCommands();
    render(<CommandPalette commands={cmds} onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("Search commands"), {
      target: { value: "   " },
    });
    expect(screen.getByText("Run Code")).toBeInTheDocument();
    expect(screen.getByText("Compile Code")).toBeInTheDocument();
    expect(screen.getByText("Format Code")).toBeInTheDocument();
  });

  it("ArrowDown is a no-op when filtered list is empty", () => {
    const cmds = makeCommands();
    const onClose = jest.fn();
    render(<CommandPalette commands={cmds} onClose={onClose} />);
    const input = screen.getByLabelText("Search commands");
    fireEvent.change(input, { target: { value: "zzzznotfound" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
    cmds.forEach((cmd) => expect(cmd.action).not.toHaveBeenCalled());
  });

  it("handles missing input ref on mount without throwing", () => {
    syncEmptyEffects = true;
    expect(() =>
      render(<CommandPalette commands={makeCommands()} onClose={jest.fn()} />),
    ).not.toThrow();
    syncEmptyEffects = false;
  });

  it("focus-trap wraps Shift+Tab from first to last focusable element", async () => {
    render(<CommandPalette commands={makeCommands()} onClose={jest.fn()} />);
    await act(async () => {});
    const dialog = screen.getByRole("dialog");
    const input = screen.getByLabelText("Search commands");
    const buttons = dialog.querySelectorAll("button");
    const lastButton = buttons[buttons.length - 1] as HTMLElement;
    const focusSpy = jest.spyOn(lastButton, "focus");
    input.focus();
    expect(document.activeElement).toBe(input);
    fireEvent.keyDown(input, { key: "Tab", shiftKey: true, bubbles: true });
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("focus-trap wraps Tab from last to first focusable element", async () => {
    render(<CommandPalette commands={makeCommands()} onClose={jest.fn()} />);
    await act(async () => {});
    const dialog = screen.getByRole("dialog");
    const input = screen.getByLabelText("Search commands");
    const buttons = dialog.querySelectorAll("button");
    const lastButton = buttons[buttons.length - 1] as HTMLElement;
    const focusSpy = jest.spyOn(input, "focus");
    lastButton.focus();
    expect(document.activeElement).toBe(lastButton);
    focusSpy.mockClear();
    fireEvent.keyDown(lastButton, { key: "Tab", shiftKey: false, bubbles: true });
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("focus-trap does not wrap Tab when not at boundary", async () => {
    render(<CommandPalette commands={makeCommands()} onClose={jest.fn()} />);
    await act(async () => {});
    const dialog = screen.getByRole("dialog");
    const buttons = dialog.querySelectorAll("button");
    const firstBtn = buttons[0] as HTMLElement;
    const lastBtn = buttons[buttons.length - 1] as HTMLElement;
    const input = screen.getByLabelText("Search commands");
    const inputSpy = jest.spyOn(input, "focus");
    const lastSpy = jest.spyOn(lastBtn, "focus");
    firstBtn.focus();
    inputSpy.mockClear();
    lastSpy.mockClear();
    act(() => {
      dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: false, bubbles: true }));
    });
    expect(inputSpy).not.toHaveBeenCalled();
    expect(lastSpy).not.toHaveBeenCalled();
    inputSpy.mockRestore();
    lastSpy.mockRestore();
  });
});

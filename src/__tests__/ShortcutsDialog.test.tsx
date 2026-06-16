import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ShortcutsDialog, SHORTCUT_GROUPS } from "../components/ShortcutsDialog";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

  it("focuses the first focusable element on mount", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
    expect(focusable.length).toBeGreaterThan(0);
    expect(document.activeElement).toBe(focusable[0]);
  });

  it("wraps Tab focus from last to first focusable element", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    act(() => {
      last.focus();
    });
    expect(document.activeElement).toBe(last);
    act(() => {
      dialog.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }),
      );
    });
    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab focus from first to last focusable element", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    act(() => {
      first.focus();
    });
    expect(document.activeElement).toBe(first);
    act(() => {
      dialog.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Tab",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });
    expect(document.activeElement).toBe(last);
  });

  it("ignores non-Tab keys in the focus trap", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable[0];
    first.focus();

    fireEvent.keyDown(dialog, { key: "ArrowDown" });
    expect(document.activeElement).toBe(first);
    expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
  });

  it("ignores Tab when the dialog has no focusable elements", () => {
    const originalQuerySelectorAll = Element.prototype.querySelectorAll;
    Element.prototype.querySelectorAll = function (this: Element, selector: string) {
      if (this.getAttribute?.("role") === "dialog" && selector.includes("tabindex")) {
        return [] as unknown as NodeListOf<Element>;
      }
      return originalQuerySelectorAll.call(this, selector);
    };

    try {
      render(<ShortcutsDialog onClose={jest.fn()} />);
      const dialog = screen.getByRole("dialog");
      fireEvent.keyDown(dialog, { key: "Tab" });
      expect(document.activeElement).not.toBeNull();
    } finally {
      Element.prototype.querySelectorAll = originalQuerySelectorAll;
    }
  });

  it("does not wrap Tab when focus is on a middle focusable element", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    const middle = document.createElement("button");
    middle.textContent = "Middle";
    dialog.appendChild(middle);
    middle.focus();

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(middle);
  });

  it("does not wrap Shift+Tab when focus is on a middle focusable element", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    const middle = document.createElement("button");
    middle.textContent = "Middle";
    dialog.insertBefore(middle, dialog.firstChild);
    middle.focus();

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(middle);
  });

  it("restores focus to the previously focused element on unmount", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Before dialog";
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(<ShortcutsDialog onClose={jest.fn()} />);
    unmount();

    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });

  it("cleans up keydown listener on unmount", () => {
    const removeListenerSpy = jest.spyOn(HTMLDivElement.prototype, "removeEventListener");
    const { unmount } = render(<ShortcutsDialog onClose={jest.fn()} />);
    unmount();
    expect(removeListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    removeListenerSpy.mockRestore();
  });

  it("tolerates a null dialog ref during focus trap setup", () => {
    const realUseRef = React.useRef;
    let refCall = 0;
    jest.spyOn(React, "useRef").mockImplementation((initial) => {
      refCall += 1;
      if (refCall === 1) {
        return { current: null };
      }
      return realUseRef(initial);
    });

    try {
      const { unmount } = render(<ShortcutsDialog onClose={jest.fn()} />);
      expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
      unmount();
    } finally {
      jest.restoreAllMocks();
    }
  });

  it("wraps Tab focus when only one focusable element exists", () => {
    const originalQuerySelectorAll = Element.prototype.querySelectorAll;
    Element.prototype.querySelectorAll = function (this: Element, selector: string) {
      if (this.getAttribute?.("role") === "dialog" && selector.includes("tabindex")) {
        const closeBtn = this.querySelector('button[aria-label="Close keyboard shortcuts"]');
        return (closeBtn ? [closeBtn] : []) as unknown as NodeListOf<Element>;
      }
      return originalQuerySelectorAll.call(this, selector);
    };

    try {
      render(<ShortcutsDialog onClose={jest.fn()} />);
      const dialog = screen.getByRole("dialog");
      const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
      expect(focusable).toHaveLength(1);

      const only = focusable[0];
      act(() => {
        only.focus();
      });
      act(() => {
        dialog.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }),
        );
      });
      expect(document.activeElement).toBe(only);
    } finally {
      Element.prototype.querySelectorAll = originalQuerySelectorAll;
    }
  });

  it("calls preventDefault when wrapping Tab from the last focusable element", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
    const last = focusable[focusable.length - 1];

    act(() => {
      last.focus();
    });
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    act(() => {
      dialog.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
  });

  it("calls preventDefault when wrapping Shift+Tab from the first focusable element", () => {
    render(<ShortcutsDialog onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable[0];

    act(() => {
      first.focus();
    });
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      dialog.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
  });

  it("unmounts without restoring focus when activeElement was null on open", () => {
    const activeElementDescriptor = Object.getOwnPropertyDescriptor(document, "activeElement");
    Object.defineProperty(document, "activeElement", {
      configurable: true,
      get: () => null,
    });

    try {
      const { unmount } = render(<ShortcutsDialog onClose={jest.fn()} />);
      expect(() => unmount()).not.toThrow();
    } finally {
      if (activeElementDescriptor) {
        Object.defineProperty(document, "activeElement", activeElementDescriptor);
      }
    }
  });
});

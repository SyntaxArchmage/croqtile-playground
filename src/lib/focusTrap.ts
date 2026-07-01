import { useRef, useEffect } from "react";

export const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Sets up a focus trap inside `containerRef`, restoring focus on unmount.
 * If `autoFocusFirst` is true, the first focusable element is focused on mount.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  { autoFocusFirst = true }: { autoFocusFirst?: boolean } = {},
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const container = containerRef.current;
    if (!container) return;

    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (autoFocusFirst) first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [containerRef, autoFocusFirst]);
}

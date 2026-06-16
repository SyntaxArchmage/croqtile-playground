"use client";

import { useState, useRef, useCallback } from "react";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  initialRatio?: number;
}

export function ResizableSplit({ left, right, initialRatio = 0.35 }: Props) {
  const [ratio, setRatio] = useState(initialRatio);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateRatio = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setRatio(Math.max(0.2, Math.min(0.6, x / rect.width)));
  }, []);

  const onMouseDown = useCallback(() => {
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      updateRatio(e.clientX);
    };

    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [updateRatio]);

  const onTouchStart = useCallback(() => {
    dragging.current = true;

    const onTouchMove = (ev: TouchEvent) => {
      if (!dragging.current) return;
      updateRatio(ev.touches[0].clientX);
    };

    const onTouchEnd = () => {
      dragging.current = false;
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
  }, [updateRatio]);

  return (
    <div ref={containerRef} className="flex h-full">
      <div style={{ width: `${ratio * 100}%` }} className="min-w-0 overflow-hidden">
        {left}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={20}
        aria-valuemax={60}
        aria-label="Resize panels"
        tabIndex={0}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onKeyDown={(e) => {
          const step = 0.02;
          if (e.key === "ArrowLeft") { e.preventDefault(); setRatio((r) => Math.max(0.2, r - step)); }
          if (e.key === "ArrowRight") { e.preventDefault(); setRatio((r) => Math.min(0.6, r + step)); }
        }}
        className="w-1 cursor-col-resize bg-[var(--border)] hover:bg-[var(--accent)] focus:bg-[var(--accent)] focus:outline-none transition-colors flex-shrink-0 touch-none"
      />
      <div style={{ width: `${(1 - ratio) * 100}%` }} className="min-w-0 overflow-hidden">
        {right}
      </div>
    </div>
  );
}

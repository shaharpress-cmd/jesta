"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal chip/filter rail with edge fades and keep-selected-in-view.
 */
export function ChipRail({
  children,
  className,
  selectedKey,
}: {
  children: ReactNode;
  className?: string;
  /** Change this when selection changes so the active chip scrolls into view */
  selectedKey?: string | null;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canStart, setCanStart] = useState(false);
  const [canEnd, setCanEnd] = useState(false);

  const updateFades = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // RTL: scrollLeft is often 0 at start and negative as you scroll toward end in some engines
    const max = scrollWidth - clientWidth;
    const absLeft = Math.abs(scrollLeft);
    const atStart = absLeft < 4;
    const atEnd = max <= 4 || absLeft >= max - 4;
    setCanStart(!atStart);
    setCanEnd(!atEnd && max > 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateFades);
      ro.disconnect();
    };
  }, [updateFades, children]);

  useEffect(() => {
    if (selectedKey == null) return;
    const el = scrollerRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>('[data-chip-active="true"]');
    if (!active) return;
    active.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedKey]);

  return (
    <div className={cn("chip-rail relative", className)}>
      <div
        ref={scrollerRef}
        className="chip-rail-scroller flex min-h-11 gap-2 overflow-x-auto scrollbar-hide py-0.5 -mx-1 px-1"
      >
        {children}
      </div>
      <span
        className={cn("chip-rail-fade chip-rail-fade-start", canStart && "is-visible")}
        aria-hidden
      />
      <span
        className={cn("chip-rail-fade chip-rail-fade-end", canEnd && "is-visible")}
        aria-hidden
      />
    </div>
  );
}

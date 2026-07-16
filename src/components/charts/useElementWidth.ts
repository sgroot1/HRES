import { RefObject, useEffect, useState } from "react";

/**
 * Tracks the rendered width of a host element via ResizeObserver, so SVG
 * charts (track maps, GG diagrams, histograms) can size themselves to fit
 * their container instead of using a fixed width.
 */
export function useElementWidth(
  ref: RefObject<HTMLElement | null>,
  fallback = 0,
): number {
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setWidth(el.getBoundingClientRect().width || fallback);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, fallback]);

  return width;
}

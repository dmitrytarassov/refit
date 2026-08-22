import { useState } from "react";

/** Drag-to-zoom state for a numeric X axis: press → drag → release zooms into the selection. */
export function useDragZoom(): {
  domain: [number, number] | null;
  refArea: [number, number] | null;
  onDown: (label: number) => void;
  onMove: (label: number) => void;
  onUp: () => void;
  reset: () => void;
} {
  const [domain, setDomain] = useState<[number, number] | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);

  const onUp = (): void => {
    if (start != null && current != null && Math.abs(current - start) > 1) {
      setDomain([Math.min(start, current), Math.max(start, current)]);
    }
    setStart(null);
    setCurrent(null);
  };

  return {
    domain,
    refArea:
      start != null && current != null && start !== current
        ? [Math.min(start, current), Math.max(start, current)]
        : null,
    onDown: setStart,
    onMove: (label) => {
      if (start != null) {
        setCurrent(label);
      }
    },
    onUp,
    reset: () => setDomain(null),
  };
}

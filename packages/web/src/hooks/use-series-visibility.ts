import { useState } from "react";

/** Per-series on/off state behind a clickable chart legend. */
export function useSeriesVisibility(initial: Record<string, boolean>): {
  visible: Record<string, boolean>;
  toggle: (key: string) => void;
} {
  const [visible, setVisible] = useState(initial);
  const toggle = (key: string): void => {
    setVisible((v) => ({ ...v, [key]: !v[key] }));
  };
  return { visible, toggle };
}

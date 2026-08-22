import { deferCall } from "just-defer-call";
import { Maximize2 } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import "./ChartCard.css";

import { ChartCardExpanded } from "./ChartCardExpanded";

import { useT } from "../../../hooks/use-translation";

interface ChartCardProps {
  title: string;
  aside?: ReactNode;
  /** Modal content override — when set, the expanded view renders this instead of children (and drops the aside). */
  expanded?: ReactNode;
  children: ReactNode;
}

export function ChartCard({
  title,
  aside,
  expanded,
  children,
}: ChartCardProps): ReactElement {
  const { t } = useT();
  const [isExpanded, setExpanded] = useState(false);

  return (
    <section className="chart-card">
      <header className="chart-card-header">
        <h2>{title}</h2>
        {aside != null && <div className="chart-card-aside">{aside}</div>}
        <button
          type="button"
          className="chart-card-icon-button"
          onClick={deferCall(setExpanded, true)}
          aria-label={t.charts.expand(title)}
        >
          <Maximize2 size={15} aria-hidden="true" />
        </button>
      </header>
      <div className="chart-card-body">{children}</div>
      {isExpanded && (
        <ChartCardExpanded
          title={title}
          aside={expanded != null ? undefined : aside}
          onClose={deferCall(setExpanded, false)}
        >
          {expanded ?? children}
        </ChartCardExpanded>
      )}
    </section>
  );
}

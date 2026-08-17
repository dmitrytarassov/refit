import { deferCall } from "just-defer-call";
import { Maximize2 } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import "./ChartCard.css";

import { ChartCardExpanded } from "./ChartCardExpanded";

interface ChartCardProps {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function ChartCard({
  title,
  aside,
  children,
}: ChartCardProps): ReactElement {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="chart-card">
      <header className="chart-card-header">
        <h2>{title}</h2>
        {aside != null && <div className="chart-card-aside">{aside}</div>}
        <button
          type="button"
          className="chart-card-icon-button"
          onClick={deferCall(setExpanded, true)}
          aria-label={`Expand ${title}`}
        >
          <Maximize2 size={15} aria-hidden="true" />
        </button>
      </header>
      <div className="chart-card-body">{children}</div>
      {expanded && (
        <ChartCardExpanded
          title={title}
          aside={aside}
          onClose={deferCall(setExpanded, false)}
        >
          {children}
        </ChartCardExpanded>
      )}
    </section>
  );
}

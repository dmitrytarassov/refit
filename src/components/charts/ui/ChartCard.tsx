import type { ReactElement, ReactNode } from "react";
import "./ChartCard.css";

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
  return (
    <section className="chart-card">
      <header className="chart-card-header">
        <h2>{title}</h2>
        {aside != null && <div className="chart-card-aside">{aside}</div>}
      </header>
      <div className="chart-card-body">{children}</div>
    </section>
  );
}

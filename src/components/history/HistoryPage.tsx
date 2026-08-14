import type { ReactElement } from "react";
import { useState } from "react";

import { HistoryCardList } from "./HistoryCardList";
import { HistoryTable } from "./HistoryTable";

import { useIsMobile } from "../../hooks/use-is-mobile";
import { useRideHistory } from "../../hooks/use-ride-history";
import "./HistoryPage.css";

export function HistoryPage(): ReactElement {
  const { rides, loading, remove } = useRideHistory();
  const isMobile = useIsMobile();
  const [armedId, setArmedId] = useState<number | null>(null);

  const handleDelete = (id: number): void => {
    if (armedId === id) {
      setArmedId(null);
      remove(id);
    } else {
      setArmedId(id);
    }
  };

  let body: ReactElement;
  if (loading) {
    body = <p className="history-empty">Loading…</p>;
  } else if (rides.length === 0) {
    body = (
      <p className="history-empty">
        No saved rides yet — process a .fit file on the Dashboard.
      </p>
    );
  } else if (isMobile) {
    body = <HistoryCardList rides={rides} />;
  } else {
    body = (
      <HistoryTable rides={rides} armedId={armedId} onDelete={handleDelete} />
    );
  }

  return (
    <section className="history-page">
      <h2>History</h2>
      {body}
    </section>
  );
}

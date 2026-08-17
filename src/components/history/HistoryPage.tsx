import type { ReactElement } from "react";
import { useState } from "react";

import { HistoryCardList } from "./HistoryCardList";
import { HistoryTable } from "./HistoryTable";

import { useIsMobile } from "../../hooks/use-is-mobile";
import { useRideHistory } from "../../hooks/use-ride-history";
import "./HistoryPage.css";
import { useT } from "../../hooks/use-translation";

export function HistoryPage(): ReactElement {
  const { rides, loading, remove } = useRideHistory();
  const isMobile = useIsMobile();
  const { t } = useT();
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
    body = <p className="history-empty">{t.common.loading}</p>;
  } else if (rides.length === 0) {
    body = <p className="history-empty">{t.history.empty}</p>;
  } else if (isMobile) {
    body = <HistoryCardList rides={rides} />;
  } else {
    body = (
      <HistoryTable rides={rides} armedId={armedId} onDelete={handleDelete} />
    );
  }

  return (
    <section className="history-page">
      <h2>{t.history.title}</h2>
      {body}
    </section>
  );
}

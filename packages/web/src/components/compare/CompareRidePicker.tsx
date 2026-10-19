import type { ReactElement } from "react";

import { CompareRidePickerRow } from "./CompareRidePickerRow";
import "./CompareRidePicker.css";

import { useRideHistory } from "../../hooks/use-ride-history";
import { useT } from "../../hooks/use-translation";

interface CompareRidePickerProps {
  /** rides already in the comparison — left out of the list */
  selected: number[];
}

export function CompareRidePicker({
  selected,
}: CompareRidePickerProps): ReactElement {
  const { t } = useT();
  const { rides, loading } = useRideHistory();
  const candidates = rides.filter(
    (ride) => ride.id != null && !selected.includes(ride.id),
  );

  let body: ReactElement;
  if (loading) {
    body = <p className="compare-status">{t.common.loading}</p>;
  } else if (candidates.length === 0) {
    body = <p className="compare-status">{t.compare.empty}</p>;
  } else {
    body = (
      <ul className="compare-picker-list">
        {candidates.map((ride) => (
          <CompareRidePickerRow key={ride.id} ride={ride} selected={selected} />
        ))}
      </ul>
    );
  }

  return (
    <section className="compare-picker" aria-label={t.compare.pickTitle}>
      <h3 className="compare-picker-title">{t.compare.pickTitle}</h3>
      {body}
    </section>
  );
}

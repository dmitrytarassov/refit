import type { ReactElement } from "react";

import { CompareSlotRow } from "./CompareSlotRow";

import type { RideRow } from "../../db/ride-row";
import { useT } from "../../hooks/use-translation";

interface CompareSlotListProps {
  slot: number;
  ids: number[];
  rides: Array<Omit<RideRow, "file">>;
  onPick: (slot: number, id: number) => void;
}

export function CompareSlotList({
  slot,
  ids,
  rides,
  onPick,
}: CompareSlotListProps): ReactElement {
  const { t } = useT();
  const title = slot === 0 ? t.compare.firstRide : t.compare.secondRide;
  const other = ids[slot === 0 ? 1 : 0];

  return (
    <section className="compare-slot" aria-label={title}>
      <h3 className="compare-slot-title">{title}</h3>
      <ul className="compare-slot-list">
        {rides.map((ride) => (
          <CompareSlotRow
            key={ride.id}
            ride={ride}
            slot={slot}
            selected={ride.id === ids[slot]}
            taken={ride.id === other}
            onPick={onPick}
          />
        ))}
      </ul>
    </section>
  );
}

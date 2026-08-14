import type { ReactElement } from "react";

import { HistoryRideCard } from "./HistoryRideCard";

import type { RideRow } from "../../db/ride-row";

interface HistoryCardListProps {
  rides: RideRow[];
}

export function HistoryCardList({ rides }: HistoryCardListProps): ReactElement {
  return (
    <div className="history-cards">
      {rides.map((ride) => (
        <HistoryRideCard key={ride.id} ride={ride} />
      ))}
    </div>
  );
}

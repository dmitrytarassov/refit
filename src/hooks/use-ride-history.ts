import { useEffect, useState } from "react";

import { listRides } from "../db/list-rides";
import type { RideRow } from "../db/ride-row";

export function useRideHistory(): {
  rides: Array<Omit<RideRow, "file">>;
  loading: boolean;
} {
  const [rides, setRides] = useState<Array<Omit<RideRow, "file">>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRides()
      .then(setRides)
      .finally(() => setLoading(false));
  }, []);

  return { rides, loading };
}

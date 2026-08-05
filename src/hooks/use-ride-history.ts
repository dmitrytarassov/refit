import { useEffect, useState } from "react";

import { deleteRide } from "../db/delete-ride";
import { listRides } from "../db/list-rides";
import type { RideRow } from "../db/ride-row";

export function useRideHistory(): {
  rides: Array<Omit<RideRow, "file">>;
  loading: boolean;
  remove: (id: number) => void;
} {
  const [rides, setRides] = useState<Array<Omit<RideRow, "file">>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRides()
      .then(setRides)
      .finally(() => setLoading(false));
  }, []);

  const remove = (id: number): void => {
    setRides((current) => current.filter((ride) => ride.id !== id));
    void deleteRide(id);
  };

  return { rides, loading, remove };
}

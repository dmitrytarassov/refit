import { GitCompareArrows } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { CompareRideSummary } from "./CompareRideSummary";

import { buildCompareUrl } from "../../compare/build-compare-url";
import type { RideRow } from "../../db/ride-row";
import { useT } from "../../hooks/use-translation";

interface CompareRidePickerRowProps {
  ride: Omit<RideRow, "file">;
  selected: number[];
}

export function CompareRidePickerRow({
  ride,
  selected,
}: CompareRidePickerRowProps): ReactElement {
  const { t } = useT();

  return (
    <li>
      <Link
        to={buildCompareUrl([...selected, ride.id ?? 0])}
        className="compare-picker-row"
        aria-label={t.compare.compareAria(ride.fileName)}
      >
        <CompareRideSummary ride={ride} />
        <GitCompareArrows
          size={16}
          className="compare-picker-row-icon"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

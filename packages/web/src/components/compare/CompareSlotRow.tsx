import { deferCall } from "just-defer-call";
import { Check } from "lucide-react";
import type { ReactElement } from "react";

import { CompareRideSummary } from "./CompareRideSummary";

import type { RideRow } from "../../db/ride-row";

interface CompareSlotRowProps {
  ride: Omit<RideRow, "file">;
  slot: number;
  selected: boolean;
  /** already in the other slot — a ride cannot be compared with itself */
  taken: boolean;
  onPick: (slot: number, id: number) => void;
}

export function CompareSlotRow({
  ride,
  slot,
  selected,
  taken,
  onPick,
}: CompareSlotRowProps): ReactElement {
  return (
    <li>
      <button
        type="button"
        className={
          selected ? "compare-slot-row is-selected" : "compare-slot-row"
        }
        aria-pressed={selected}
        disabled={taken}
        onClick={deferCall(onPick, slot, ride.id ?? 0)}
      >
        <CompareRideSummary ride={ride} />
        {selected && (
          <Check
            size={16}
            className="compare-slot-row-icon"
            aria-hidden="true"
          />
        )}
      </button>
    </li>
  );
}

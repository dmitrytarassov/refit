import "./RideMassFields.css";
import type { ReactElement } from "react";

import { DEFAULT_GEAR_KG } from "../../../lib/power/gear-defaults";
import { POWER_DEFAULTS } from "../../fit/power-defaults";
import type { RideSettings } from "../../types/ride-settings";
import { HelpTip } from "../common/ui/HelpTip";

interface RideMassFieldsProps {
  settings: RideSettings;
  onChange: (settings: RideSettings) => void;
}

export function RideMassFields({
  settings,
  onChange,
}: RideMassFieldsProps): ReactElement {
  const mass = settings.mass ?? POWER_DEFAULTS.mass;
  const gearKg = mass.gearKg ?? DEFAULT_GEAR_KG;

  const commit = (key: "riderKg" | "bikeKg" | "gearKg", raw: string): void => {
    const value = Number(raw);
    const current = key === "gearKg" ? gearKg : mass[key];
    if (
      Number.isNaN(value) ||
      value < 0 ||
      (value === 0 && key !== "gearKg") ||
      value === current
    ) {
      return;
    }
    onChange({ ...settings, mass: { ...mass, [key]: value } });
  };

  return (
    <div className="ride-mass-fields">
      <label>
        <span>Rider, kg</span>
        <input
          type="number"
          min={30}
          max={200}
          step={0.5}
          key={`rider-${mass.riderKg}`}
          defaultValue={mass.riderKg}
          onBlur={(event) => commit("riderKg", event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
      </label>
      <label>
        <span>Bike, kg</span>
        <input
          type="number"
          min={3}
          max={30}
          step={0.1}
          key={`bike-${mass.bikeKg}`}
          defaultValue={mass.bikeKg}
          onBlur={(event) => commit("bikeKg", event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
      </label>
      <label>
        <span>
          Gear, kg{" "}
          <HelpTip text="Everything the rider carries: helmet, shoes, phone, bike computer, bottles and so on." />
        </span>
        <input
          type="number"
          min={0}
          max={30}
          step={0.1}
          key={`gear-${gearKg}`}
          defaultValue={gearKg}
          onBlur={(event) => commit("gearKg", event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
      </label>
    </div>
  );
}

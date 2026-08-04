import "./PowerSettingsPanel.css";
import type { ReactElement } from "react";

import { formatSettingValue } from "./format-setting-value";

import type { RideSettings } from "../../types/ride-settings";

const FIELDS = [
  {
    key: "cda",
    label: "Riding position",
    options: ["auto", "tops", "hoods", "drops", "aero"],
  },
  {
    key: "surface",
    label: "Surface",
    options: ["good-asphalt", "rough-asphalt", "gravel"],
  },
  {
    key: "tires",
    label: "Tires",
    options: ["road", "endurance", "gravel", "mtb"],
  },
  { key: "pressure", label: "Pressure", options: ["high", "medium", "low"] },
] as const;

export function PowerSettingsPanel({
  settings,
  onChange,
}: {
  settings: RideSettings;
  onChange: (settings: RideSettings) => void;
}): ReactElement {
  const valueOf = (key: (typeof FIELDS)[number]["key"]): string =>
    key === "cda" ? settings.cda : settings.crr[key];

  const update = (key: (typeof FIELDS)[number]["key"], value: string): void => {
    onChange(
      key === "cda"
        ? { ...settings, cda: value as RideSettings["cda"] }
        : { ...settings, crr: { ...settings.crr, [key]: value } },
    );
  };

  return (
    <div className="power-settings-panel">
      {FIELDS.map((field) => (
        <label key={field.key}>
          <span>{field.label}</span>
          <select
            value={valueOf(field.key)}
            onChange={(event) => update(field.key, event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {formatSettingValue(option)}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}

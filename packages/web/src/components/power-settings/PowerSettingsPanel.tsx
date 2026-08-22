import "./PowerSettingsPanel.css";
import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";
import type { RideSettings } from "../../types/ride-settings";

const FIELDS = [
  {
    key: "cda",
    labelKey: "position",
    options: ["auto", "tops", "hoods", "drops", "aero"],
  },
  {
    key: "surface",
    labelKey: "surface",
    options: ["good-asphalt", "rough-asphalt", "gravel"],
  },
  {
    key: "tires",
    labelKey: "tires",
    options: ["road", "endurance", "gravel", "mtb"],
  },
  { key: "pressure", labelKey: "pressure", options: ["high", "medium", "low"] },
] as const;

export function PowerSettingsPanel({
  settings,
  onChange,
}: {
  settings: RideSettings;
  onChange: (settings: RideSettings) => void;
}): ReactElement {
  const { t } = useT();
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
          <span>{t.powerSettings.fields[field.labelKey]}</span>
          <select
            value={valueOf(field.key)}
            onChange={(event) => update(field.key, event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {t.powerSettings.values[option]}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}

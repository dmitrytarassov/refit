import { deferCall } from "just-defer-call";
import { Settings } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";

import "./PowerSettingsBar.css";
import { BottleListEditor } from "./BottleListEditor";
import { PowerSettingsPanel } from "./PowerSettingsPanel";
import { RideMassFields } from "./RideMassFields";
import { formatSettingValue } from "./format-setting-value";

import { DEFAULT_GEAR_KG } from "../../../lib/power/gear-defaults";
import { POWER_DEFAULTS } from "../../fit/power-defaults";
import type { RideSettings } from "../../types/ride-settings";

interface PowerSettingsBarProps {
  settings: RideSettings;
  onChange: (settings: RideSettings) => void;
}

export function PowerSettingsBar({
  settings,
  onChange,
}: PowerSettingsBarProps): ReactElement {
  const [open, setOpen] = useState(false);
  const mass = settings.mass ?? POWER_DEFAULTS.mass;
  const bottles = mass.bottlesMl ?? [];
  const bottlesLiters = bottles.reduce((sum, ml) => sum + ml, 0) / 1000;

  return (
    <section className="power-settings-bar">
      <div className="power-settings-row">
        <dl className="power-settings-summary">
          <div>
            <dt>Position</dt>
            <dd>{formatSettingValue(settings.cda)}</dd>
          </div>
          <div>
            <dt>Surface</dt>
            <dd>{formatSettingValue(settings.crr.surface)}</dd>
          </div>
          <div>
            <dt>Tires</dt>
            <dd>{formatSettingValue(settings.crr.tires)}</dd>
          </div>
          <div>
            <dt>Pressure</dt>
            <dd>{formatSettingValue(settings.crr.pressure)}</dd>
          </div>
          <div>
            <dt>Weights</dt>
            <dd>
              {mass.riderKg} + {mass.bikeKg} + {mass.gearKg ?? DEFAULT_GEAR_KG}{" "}
              kg
            </dd>
          </div>
          <div>
            <dt>Bottles</dt>
            <dd>
              {bottles.length > 0
                ? `${bottles.length} (${bottlesLiters.toFixed(1)} L)`
                : "—"}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          className="power-settings-gear"
          aria-label="Power estimation settings"
          aria-expanded={open}
          onClick={deferCall(setOpen, !open)}
        >
          <Settings size={16} aria-hidden="true" />
        </button>
      </div>
      {open && (
        <>
          <PowerSettingsPanel settings={settings} onChange={onChange} />
          <RideMassFields settings={settings} onChange={onChange} />
          <div className="power-settings-bottles">
            <span>Bottles</span>
            <BottleListEditor
              bottles={bottles}
              onChange={(next) => {
                onChange({ ...settings, mass: { ...mass, bottlesMl: next } });
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}

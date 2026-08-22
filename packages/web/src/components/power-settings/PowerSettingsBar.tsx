import { deferCall } from "just-defer-call";
import { Settings } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { DEFAULT_GEAR_KG } from "refit-core";

import "./PowerSettingsBar.css";

import { BottleListEditor } from "./BottleListEditor";
import { PowerSettingsPanel } from "./PowerSettingsPanel";
import { RideMassFields } from "./RideMassFields";

import { POWER_DEFAULTS } from "../../fit/power-defaults";
import { useT } from "../../hooks/use-translation";
import type { RideSettings } from "../../types/ride-settings";

interface PowerSettingsBarProps {
  settings: RideSettings;
  onChange: (settings: RideSettings) => void;
}

export function PowerSettingsBar({
  settings,
  onChange,
}: PowerSettingsBarProps): ReactElement {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const mass = settings.mass ?? POWER_DEFAULTS.mass;
  const bottles = mass.bottlesMl ?? [];
  const bottlesLiters = bottles.reduce((sum, ml) => sum + ml, 0) / 1000;

  return (
    <section className="power-settings-bar">
      <div className="power-settings-row">
        <dl className="power-settings-summary">
          <div>
            <dt>{t.powerSettings.fields.positionShort}</dt>
            <dd>{t.powerSettings.values[settings.cda]}</dd>
          </div>
          <div>
            <dt>{t.powerSettings.fields.surface}</dt>
            <dd>{t.powerSettings.values[settings.crr.surface]}</dd>
          </div>
          <div>
            <dt>{t.powerSettings.fields.tires}</dt>
            <dd>{t.powerSettings.values[settings.crr.tires]}</dd>
          </div>
          <div>
            <dt>{t.powerSettings.fields.pressure}</dt>
            <dd>{t.powerSettings.values[settings.crr.pressure]}</dd>
          </div>
          <div>
            <dt>{t.powerSettings.fields.weights}</dt>
            <dd>
              {mass.riderKg} + {mass.bikeKg} + {mass.gearKg ?? DEFAULT_GEAR_KG}{" "}
              {t.common.units.kg}
            </dd>
          </div>
          <div>
            <dt>{t.powerSettings.fields.bottles}</dt>
            <dd>
              {bottles.length > 0
                ? `${bottles.length} (${bottlesLiters.toFixed(1)} ${t.common.units.l})`
                : "—"}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          className="power-settings-gear"
          aria-label={t.powerSettings.aria}
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
            <span>{t.powerSettings.fields.bottles}</span>
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

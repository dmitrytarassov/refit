import { deferCall } from "just-defer-call";
import { Settings } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";

import "./PowerSettingsBar.css";
import { PowerSettingsPanel } from "./PowerSettingsPanel";
import { formatSettingValue } from "./format-setting-value";

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
      {open && <PowerSettingsPanel settings={settings} onChange={onChange} />}
    </section>
  );
}

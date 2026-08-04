import "./SettingsPage.css";
import type { ReactElement } from "react";

import { usePowerSettings } from "../../hooks/use-power-settings";
import { PowerSettingsPanel } from "../power-settings/PowerSettingsPanel";

export function SettingsPage(): ReactElement {
  const { settings, update } = usePowerSettings();

  return (
    <section className="settings-page">
      <h2>Settings</h2>
      <article className="settings-card">
        <h3>Power estimation defaults</h3>
        <p>
          Applied to every newly loaded ride. Changing these on a ride&rsquo;s
          dashboard also updates the defaults.
        </p>
        {settings != null && (
          <PowerSettingsPanel settings={settings} onChange={update} />
        )}
      </article>
    </section>
  );
}

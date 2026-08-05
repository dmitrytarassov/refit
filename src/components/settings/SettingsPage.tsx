import "./SettingsPage.css";
import { deferCall } from "just-defer-call";
import { X } from "lucide-react";
import type { ReactElement } from "react";

import { useManualFtp } from "../../hooks/use-manual-ftp";
import { usePowerSettings } from "../../hooks/use-power-settings";
import { PowerSettingsPanel } from "../power-settings/PowerSettingsPanel";

export function SettingsPage(): ReactElement {
  const { settings, update } = usePowerSettings();
  const { ftp, save } = useManualFtp();

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
      <article className="settings-card">
        <h3>FTP</h3>
        <p>
          Your Functional Threshold Power. When set, it replaces the per-ride
          estimate everywhere — power zones, TSS and Intensity Factor. Clear it
          to go back to the estimated lower bound.
        </p>
        <div className="settings-ftp-row">
          <label>
            <span>Manual FTP</span>
            <span className="settings-ftp-field">
              <input
                type="number"
                min={50}
                max={600}
                placeholder="e.g. 250"
                value={ftp ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  if (raw === "") {
                    save(null);
                    return;
                  }
                  const value = Number(raw);
                  if (!Number.isNaN(value)) {
                    save(value);
                  }
                }}
              />
              {ftp != null && (
                <button
                  type="button"
                  className="settings-ftp-clear"
                  aria-label="Clear FTP"
                  onClick={deferCall(save, null)}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </span>
          </label>
          <span className="settings-ftp-unit">W</span>
        </div>
      </article>
    </section>
  );
}

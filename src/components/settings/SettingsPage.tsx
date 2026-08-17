import "./SettingsPage.css";
import { deferCall } from "just-defer-call";
import { X } from "lucide-react";
import type { ReactElement } from "react";

import { CyclistScene } from "./CyclistScene";
import { nextMass } from "./next-mass";
import { sceneFromSettings } from "./scene-from-settings";

import { POWER_DEFAULTS } from "../../fit/power-defaults";
import { useManualFtp } from "../../hooks/use-manual-ftp";
import { useMassSettings } from "../../hooks/use-mass-settings";
import { usePowerSettings } from "../../hooks/use-power-settings";
import { BottleListEditor } from "../power-settings/BottleListEditor";
import { PowerSettingsPanel } from "../power-settings/PowerSettingsPanel";

export function SettingsPage(): ReactElement {
  const { settings, update } = usePowerSettings();
  const { ftp, save } = useManualFtp();
  const { mass, save: saveMass } = useMassSettings();

  const updateMass = (
    key: "riderKg" | "bikeKg" | "gearKg",
    raw: string,
  ): void => {
    const next = nextMass(mass, key, raw);
    if (next != null) {
      saveMass(next);
    }
  };

  const updateBottles = (bottles: number[]): void => {
    if (mass == null && bottles.length === 0) {
      return;
    }
    saveMass({
      ...POWER_DEFAULTS.mass,
      ...mass,
      bottlesMl: bottles.length > 0 ? bottles : undefined,
    });
  };

  const scene = sceneFromSettings(settings ?? POWER_DEFAULTS);

  return (
    <section className="settings-page">
      <div className="settings-main">
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
          <h3>Weight</h3>
          <p>
            Default rider, bike and gear mass for the power model — copied into
            every newly loaded ride (each ride can then override them in its
            power settings). Gear is everything the rider carries: helmet,
            shoes, phone, bike computer, bottles and so on. When not set,
            defaults of {POWER_DEFAULTS.mass.riderKg} kg (rider),{" "}
            {POWER_DEFAULTS.mass.bikeKg} kg (bike) and{" "}
            {POWER_DEFAULTS.mass.gearKg} kg (gear) are used and the dashboard
            shows a reminder.
          </p>
          <div className="settings-ftp-row">
            <label>
              <span>Rider, kg</span>
              <span className="settings-ftp-field">
                <input
                  type="number"
                  min={30}
                  max={200}
                  placeholder={String(POWER_DEFAULTS.mass.riderKg)}
                  value={mass?.riderKg ?? ""}
                  onChange={(event) => {
                    updateMass("riderKg", event.target.value);
                  }}
                />
              </span>
            </label>
            <label>
              <span>Bike, kg</span>
              <span className="settings-ftp-field">
                <input
                  type="number"
                  min={3}
                  max={30}
                  placeholder={String(POWER_DEFAULTS.mass.bikeKg)}
                  value={mass?.bikeKg ?? ""}
                  onChange={(event) => {
                    updateMass("bikeKg", event.target.value);
                  }}
                />
              </span>
            </label>
            <label>
              <span>Gear, kg</span>
              <span className="settings-ftp-field">
                <input
                  type="number"
                  min={0}
                  max={30}
                  placeholder={String(POWER_DEFAULTS.mass.gearKg)}
                  value={mass?.gearKg ?? ""}
                  onChange={(event) => {
                    updateMass("gearKg", event.target.value);
                  }}
                />
              </span>
            </label>
            {mass != null && (
              <button
                type="button"
                className="settings-ftp-clear settings-mass-clear"
                aria-label="Clear weights"
                onClick={deferCall(saveMass, null)}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </article>
        <article className="settings-card">
          <h3>Bottles</h3>
          <p>
            Water you start the ride with — each bottle&rsquo;s volume is added
            to the total mass (1 L ≈ 1 kg), counted full for the whole ride.
            Copied into every newly loaded ride; each ride can edit its own set
            in its power settings.
          </p>
          <BottleListEditor
            bottles={mass?.bottlesMl ?? []}
            onChange={updateBottles}
          />
        </article>
        <article className="settings-card">
          <h3>FTP</h3>
          <p>
            Your Functional Threshold Power. When set, it replaces the per-ride
            estimate everywhere — power zones, TSS and Intensity Factor. Clear
            it to go back to the estimated lower bound.
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
      </div>
      <aside className="settings-scene" aria-hidden="true">
        <CyclistScene
          bike={scene.bike}
          position={scene.position}
          surface={scene.surface}
        />
      </aside>
    </section>
  );
}

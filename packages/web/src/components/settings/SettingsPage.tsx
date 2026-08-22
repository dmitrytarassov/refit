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
import { useT } from "../../hooks/use-translation";
import type { Language } from "../../types/language";
import { BottleListEditor } from "../power-settings/BottleListEditor";
import { PowerSettingsPanel } from "../power-settings/PowerSettingsPanel";

export function SettingsPage(): ReactElement {
  const { settings, update } = usePowerSettings();
  const { ftp, save } = useManualFtp();
  const { mass, save: saveMass } = useMassSettings();
  const { t, lang, setLanguage } = useT();

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
        <h2>{t.settings.title}</h2>
        <article className="settings-card">
          <h3>{t.language.settingsTitle}</h3>
          <p>{t.language.settingsText}</p>
          <div className="settings-language-buttons">
            {(["en", "ru"] as Language[]).map((option) => (
              <button
                key={option}
                type="button"
                className={
                  lang === option
                    ? "settings-language-button is-active"
                    : "settings-language-button"
                }
                onClick={deferCall(setLanguage, option)}
              >
                {option === "en" ? t.language.english : t.language.russian}
              </button>
            ))}
          </div>
        </article>
        <article className="settings-card">
          <h3>{t.settings.powerDefaults.title}</h3>
          <p>{t.settings.powerDefaults.text}</p>
          {settings != null && (
            <PowerSettingsPanel settings={settings} onChange={update} />
          )}
        </article>
        <article className="settings-card">
          <h3>{t.settings.weight.title}</h3>
          <p>
            {t.settings.weight.text(
              POWER_DEFAULTS.mass.riderKg,
              POWER_DEFAULTS.mass.bikeKg,
              POWER_DEFAULTS.mass.gearKg ?? 2,
            )}
          </p>
          <div className="settings-ftp-row">
            <label>
              <span>{t.settings.weight.riderKg}</span>
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
              <span>{t.settings.weight.bikeKg}</span>
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
              <span>{t.settings.weight.gearKg}</span>
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
                aria-label={t.settings.weight.clear}
                onClick={deferCall(saveMass, null)}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </article>
        <article className="settings-card">
          <h3>{t.settings.bottles.title}</h3>
          <p>{t.settings.bottles.text}</p>
          <BottleListEditor
            bottles={mass?.bottlesMl ?? []}
            onChange={updateBottles}
          />
        </article>
        <article className="settings-card">
          <h3>{t.settings.ftp.title}</h3>
          <p>{t.settings.ftp.text}</p>
          <div className="settings-ftp-row">
            <label>
              <span>{t.settings.ftp.label}</span>
              <span className="settings-ftp-field">
                <input
                  type="number"
                  min={50}
                  max={600}
                  placeholder={t.settings.ftp.placeholder}
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
                    aria-label={t.settings.ftp.clear}
                    onClick={deferCall(save, null)}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
              </span>
            </label>
            <span className="settings-ftp-unit">{t.common.units.w}</span>
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

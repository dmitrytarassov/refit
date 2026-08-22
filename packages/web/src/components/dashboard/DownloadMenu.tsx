import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";
import { useState } from "react";

import "./DownloadMenu.css";

import { useEnhanceDownload } from "../../hooks/use-enhance-download";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";
import { ToggleSwitch } from "../common/ui/ToggleSwitch";

export function DownloadMenu({
  activity,
}: {
  activity: Activity;
}): ReactElement {
  const { hasDevicePower, download } = useEnhanceDownload(activity);
  const [open, setOpen] = useState(false);
  const [coordinates, setCoordinates] = useState(true);
  const [power, setPower] = useState(!hasDevicePower);

  const { t } = useT();
  const save = (): void => {
    setOpen(false);
    download({ coordinates, power });
  };

  return (
    <span className="download-menu">
      <button
        type="button"
        className="file-header-card-primary"
        aria-expanded={open}
        onClick={deferCall(setOpen, !open)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M4 19h16" />
        </svg>
        {t.dashboard.download.button}
      </button>
      {open && (
        <div className="download-menu-panel">
          <ToggleSwitch
            label={t.dashboard.download.coordinates}
            checked={coordinates}
            onChange={setCoordinates}
          />
          <ToggleSwitch
            label={t.dashboard.download.power}
            checked={power}
            onChange={setPower}
          />
          {hasDevicePower && (
            <p className="download-menu-note">
              {t.dashboard.download.sensorNote}
            </p>
          )}
          <button
            type="button"
            className="download-menu-save"
            onClick={save}
            disabled={!coordinates && !power}
          >
            {t.dashboard.download.save}
          </button>
        </div>
      )}
    </span>
  );
}

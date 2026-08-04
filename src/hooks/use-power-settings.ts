import { useEffect, useState } from "react";

import { getLastSettings } from "../db/get-last-settings";
import { saveLastSettings } from "../db/save-last-settings";
import type { RideSettings } from "../types/ride-settings";

export function usePowerSettings(): {
  settings: RideSettings | null;
  update: (settings: RideSettings) => void;
} {
  const [settings, setSettings] = useState<RideSettings | null>(null);

  useEffect(() => {
    getLastSettings().then(setSettings);
  }, []);

  const update = (next: RideSettings): void => {
    setSettings(next);
    void saveLastSettings(next);
  };

  return { settings, update };
}

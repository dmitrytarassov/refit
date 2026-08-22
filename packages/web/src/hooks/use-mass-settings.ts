import { useEffect, useState } from "react";
import type { MassConfig } from "refit-core";

import { getMassSettings } from "../db/get-mass-settings";
import { saveMassSettings } from "../db/save-mass-settings";

export function useMassSettings(): {
  mass: MassConfig | null;
  loaded: boolean;
  save: (value: MassConfig | null) => void;
} {
  const [mass, setMass] = useState<MassConfig | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getMassSettings()
      .then(setMass)
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  const save = (value: MassConfig | null): void => {
    setMass(value);
    void saveMassSettings(value);
  };

  return { mass, loaded, save };
}

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import "./DefaultMassAlert.css";

import { POWER_DEFAULTS } from "../../fit/power-defaults";
import { useT } from "../../hooks/use-translation";
import type { RideSettings } from "../../types/ride-settings";

export function DefaultMassAlert({
  settings,
}: {
  settings: RideSettings;
}): ReactElement | null {
  const { t } = useT();
  if (settings.mass != null) {
    return null;
  }

  return (
    <p className="default-mass-alert" role="status">
      {t.dashboard.massAlert.before(
        POWER_DEFAULTS.mass.riderKg,
        POWER_DEFAULTS.mass.bikeKg,
        POWER_DEFAULTS.mass.gearKg ?? 2,
      )}
      <Link to="/?view=settings">{t.dashboard.massAlert.link}</Link>
      {t.dashboard.massAlert.after}
    </p>
  );
}

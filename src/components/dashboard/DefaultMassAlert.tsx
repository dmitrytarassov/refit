import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import "./DefaultMassAlert.css";

import { POWER_DEFAULTS } from "../../fit/power-defaults";
import type { RideSettings } from "../../types/ride-settings";

export function DefaultMassAlert({
  settings,
}: {
  settings: RideSettings;
}): ReactElement | null {
  if (settings.mass != null) {
    return null;
  }

  return (
    <p className="default-mass-alert" role="status">
      Power was estimated with default weights: rider{" "}
      {POWER_DEFAULTS.mass.riderKg} kg, bike {POWER_DEFAULTS.mass.bikeKg} kg,
      gear {POWER_DEFAULTS.mass.gearKg} kg. Set your defaults in{" "}
      <Link to="/?view=settings">Settings</Link>, or change them for this ride
      via the gear icon above.
    </p>
  );
}

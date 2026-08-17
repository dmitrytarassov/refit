import type { BikeKey, PositionKey, SurfaceKey } from "./CyclistScene";

import type { RideSettings } from "../../types/ride-settings";

export function sceneFromSettings(settings: RideSettings): {
  bike: BikeKey;
  position: PositionKey;
  surface: SurfaceKey;
} {
  const { tires, surface } = settings.crr;

  let bike: BikeKey = "road";
  if (settings.cda === "aero") {
    bike = "tt";
  } else if (tires === "gravel") {
    bike = "gravel";
  } else if (tires === "mtb") {
    bike = "mtb";
  }

  let position: PositionKey = "hoods";
  if (bike === "mtb") {
    position = "grips";
  } else if (settings.cda !== "auto") {
    position = settings.cda;
  }

  let sceneSurface: SurfaceKey = "gravel";
  if (surface === "good-asphalt") {
    sceneSurface = "asphalt";
  } else if (surface === "rough-asphalt") {
    sceneSurface = "badAsphalt";
  }

  return { bike, position, surface: sceneSurface };
}

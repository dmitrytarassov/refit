import { useMemo } from "react";

import { useActivitySummary } from "./use-activity-summary";
import { useFTP } from "./use-ftp";
import { useRoutePalette } from "./use-route-palette";
import { useT } from "./use-translation";
import { useTSS } from "./use-tss";

import { routePoints } from "../fit/route-points";
import { ROUTE_PALETTES } from "../route/route-palettes";
import type { Activity } from "../types/activity";
import type { ShareCardData } from "../types/share-card-data";
import type { ShareTile } from "../types/share-tile";

/** Everything the share image needs, memoized so the render effect doesn't loop. */
export function useShareCardData(activity: Activity): ShareCardData {
  const { t } = useT();
  const { meta, metrics } = useActivitySummary(activity);
  const ftp = useFTP(activity);
  const tss = useTSS(activity);
  const { paletteKey } = useRoutePalette();
  const ftpWatts = ftp?.watts;
  const ftpSource = ftp?.source;

  return useMemo(() => {
    const [distanceValue = "0.0", distanceUnit = "km"] =
      metrics.distanceLabel.split(" ");
    const tiles: Array<ShareTile | null> = [
      {
        key: "movingTime",
        label: t.dashboard.tiles.movingTime,
        value: metrics.movingLabel,
      },
      {
        key: "distance",
        label: t.dashboard.tiles.distance,
        value: distanceValue,
        unit: distanceUnit,
      },
      metrics.avgSpeedKmh != null
        ? {
            key: "avgSpeed",
            label: t.dashboard.tiles.avgSpeed,
            value: metrics.avgSpeedKmh.toFixed(1),
            unit: t.common.units.kmh,
          }
        : null,
      metrics.maxSpeedKmh != null
        ? {
            key: "maxSpeed",
            label: t.dashboard.tiles.maxSpeed,
            value: metrics.maxSpeedKmh.toFixed(1),
            unit: t.common.units.kmh,
          }
        : null,
      metrics.avgHeartRate != null
        ? {
            key: "avgHeartRate",
            label: t.dashboard.tiles.avgHeartRate,
            value: String(metrics.avgHeartRate),
            unit: t.common.units.bpm,
          }
        : null,
      metrics.avgPower != null
        ? {
            key: "avgPower",
            label: t.dashboard.tiles.avgPower,
            value: String(metrics.avgPower),
            unit: t.common.units.w,
          }
        : null,
      metrics.normalizedPower != null
        ? {
            key: "normalizedPower",
            label: t.dashboard.tiles.normalizedPower,
            value: String(metrics.normalizedPower),
            unit: t.common.units.w,
          }
        : null,
      ftpWatts != null
        ? {
            key: "ftp",
            label:
              ftpSource === "manual"
                ? t.dashboard.tiles.ftpManual
                : t.dashboard.tiles.estFtp,
            value: String(ftpWatts),
            unit: t.common.units.w,
          }
        : null,
      tss != null
        ? { key: "tss", label: t.dashboard.tiles.tss, value: String(tss) }
        : null,
    ];
    return {
      title: activity.title ?? activity.fileName.replace(/\.fit$/i, ""),
      subtitle: [meta.sport, meta.deviceLabel]
        .filter((part): part is string => part != null)
        .join(" · "),
      dateLabel: meta.dateLabel,
      points: routePoints(activity),
      routePalette: ROUTE_PALETTES[paletteKey],
      tiles: tiles.filter((tile): tile is ShareTile => tile != null),
    };
  }, [activity, t, meta, metrics, ftpWatts, ftpSource, tss, paletteKey]);
}

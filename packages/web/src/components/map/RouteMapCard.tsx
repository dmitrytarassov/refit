import "leaflet/dist/leaflet.css";
import "./RouteMapCard.css";
import type { ReactElement } from "react";
import { useState } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

import { MapPinchZoom } from "./MapPinchZoom";
import { RouteGradientLine } from "./RouteGradientLine";
import { RoutePalettePicker } from "./RoutePalettePicker";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { useRoutePalette } from "../../hooks/use-route-palette";
import { useRoutePoints } from "../../hooks/use-route-points";
import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";
import { ROUTE_PALETTES } from "../../route/route-palettes";
import type { Activity } from "../../types/activity";
import { ChartCard } from "../charts/ui/ChartCard";
import { ToggleSwitch } from "../common/ui/ToggleSwitch";

interface RouteMapCardProps {
  activity: Activity;
}

export function RouteMapCard({
  activity,
}: RouteMapCardProps): ReactElement | null {
  const { t } = useT();
  const [showOriginal, setShowOriginal] = useState(false);
  const hasEdits = activity.report.accepted < activity.report.withGps;
  const points = useRoutePoints(activity);
  const originalPoints = useRoutePoints(activity, true);
  const { mode } = useTheme();
  const { paletteKey } = useRoutePalette();
  if (points.length === 0) {
    return null;
  }

  return (
    <ChartCard
      title={t.charts.titles.route}
      aside={
        <div className="route-map-aside">
          <RoutePalettePicker />
          {hasEdits && (
            <ToggleSwitch
              label={t.charts.showOriginal}
              checked={showOriginal}
              onChange={setShowOriginal}
            />
          )}
        </div>
      }
    >
      <div className="route-map">
        <MapContainer
          bounds={points}
          boundsOptions={{ padding: [24, 24] }}
          scrollWheelZoom={false}
          zoomSnap={0}
          ref={(map) => {
            map?.attributionControl.setPrefix(false);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {showOriginal && hasEdits && (
            <Polyline
              positions={originalPoints}
              pathOptions={{ color: CHART_PALETTE[mode].heartRate, weight: 3 }}
            />
          )}
          <RouteGradientLine
            points={points}
            palette={ROUTE_PALETTES[paletteKey]}
          />
          <MapPinchZoom />
        </MapContainer>
      </div>
    </ChartCard>
  );
}

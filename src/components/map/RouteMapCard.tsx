import "leaflet/dist/leaflet.css";
import "./RouteMapCard.css";
import type { ReactElement } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

import { MapPinchZoom } from "./MapPinchZoom";

import { CHART_PALETTE } from "../../charts/chart-palette";
import { useRoutePoints } from "../../hooks/use-route-points";
import { useTheme } from "../../hooks/use-theme";
import type { Activity } from "../../types/activity";
import { ChartCard } from "../charts/ui/ChartCard";

interface RouteMapCardProps {
  activity: Activity;
}

export function RouteMapCard({
  activity,
}: RouteMapCardProps): ReactElement | null {
  const points = useRoutePoints(activity);
  const { mode } = useTheme();
  if (points.length === 0) {
    return null;
  }

  return (
    <ChartCard title="Route">
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
          <Polyline
            positions={points}
            pathOptions={{ color: CHART_PALETTE[mode].heartRate, weight: 3 }}
          />
          <MapPinchZoom />
        </MapContainer>
      </div>
    </ChartCard>
  );
}

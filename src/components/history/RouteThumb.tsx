import "./RouteThumb.css";
import type { ReactElement } from "react";

interface RouteThumbProps {
  track?: Array<[number, number]>;
}

export function RouteThumb({ track }: RouteThumbProps): ReactElement {
  if (track == null || track.length < 2) {
    return <div className="route-thumb is-empty" aria-hidden="true" />;
  }

  const lats = track.map((p) => p[0]);
  const lons = track.map((p) => p[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const kx = Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
  const w = Math.max((maxLon - minLon) * kx, 1e-6);
  const h = Math.max(maxLat - minLat, 1e-6);
  const points = track
    .map(([lat, lon]) => `${(lon - minLon) * kx},${maxLat - lat}`)
    .join(" ");

  return (
    <svg
      className="route-thumb"
      viewBox={`${-w * 0.05} ${-h * 0.05} ${w * 1.1} ${h * 1.1}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

import type { ReactElement } from "react";
import { Polyline } from "react-leaflet";

import { routeSegmentColor } from "../../route/route-segment-color";
import { ROUTE_SEGMENT_COUNT } from "../../route/route-segment-count";
import { splitRouteSegments } from "../../route/split-route-segments";
import type { RoutePalette } from "../../types/route-palette";

interface RouteGradientLineProps {
  points: Array<[number, number]>;
  palette: RoutePalette;
}

/** The route as 100 same-color pieces forming a start → finish gradient. */
export function RouteGradientLine({
  points,
  palette,
}: RouteGradientLineProps): ReactElement {
  const segments = splitRouteSegments(points, ROUTE_SEGMENT_COUNT);
  return (
    <>
      {segments.map((segment, index) => (
        <Polyline
          key={index}
          positions={segment}
          pathOptions={{
            color: routeSegmentColor(index, segments.length, palette),
            weight: 3,
            lineCap: "round",
          }}
        />
      ))}
    </>
  );
}

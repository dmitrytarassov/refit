import "./RoutePalettePicker.css";
import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";

import { useRoutePalette } from "../../hooks/use-route-palette";
import { useT } from "../../hooks/use-translation";
import { ROUTE_PALETTE_KEYS, ROUTE_PALETTES } from "../../route/route-palettes";

/** Row of five gradient swatches choosing the route line palette (persisted in settings). */
export function RoutePalettePicker(): ReactElement {
  const { t } = useT();
  const { paletteKey, setPaletteKey } = useRoutePalette();
  return (
    <div
      className="route-palette-picker"
      role="radiogroup"
      aria-label={t.charts.routePalette.label}
    >
      {ROUTE_PALETTE_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={key === paletteKey}
          aria-label={t.charts.routePalette.names[key]}
          title={t.charts.routePalette.names[key]}
          style={{
            background: `linear-gradient(90deg, ${ROUTE_PALETTES[key].start}, ${ROUTE_PALETTES[key].end})`,
          }}
          onClick={deferCall(setPaletteKey, key)}
        />
      ))}
    </div>
  );
}

import type { ChangeEvent, ReactElement } from "react";
import { useState } from "react";

import { useT } from "../../hooks/use-translation";
import { SHARE_SHADE_MODES } from "../../share/share-shade-defaults";
import type { ShareShade, ShareShadeMode } from "../../types/share-shade";

interface ShareShadeControlsProps {
  value: ShareShade;
  onChange: (shade: ShareShade) => void;
}

/** Shade placement select + strength slider (10–50%); the slider commits on release so dragging doesn't re-render the canvas. */
export function ShareShadeControls({
  value,
  onChange,
}: ShareShadeControlsProps): ReactElement {
  const { t } = useT();
  const [percent, setPercent] = useState(Math.round(value.opacity * 100));
  const onMode = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange({ ...value, mode: event.target.value as ShareShadeMode });
  };
  const commit = (): void => {
    if (percent / 100 !== value.opacity) {
      onChange({ ...value, opacity: percent / 100 });
    }
  };

  return (
    <div className="share-shade-controls">
      <label>
        <span>{t.share.shade.label}</span>
        <select value={value.mode} onChange={onMode}>
          {SHARE_SHADE_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {t.share.shade.modes[mode]}
            </option>
          ))}
        </select>
      </label>
      {value.mode !== "none" && (
        <label>
          <span>
            {t.share.shade.strength} · {percent}%
          </span>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={percent}
            onChange={(event) => setPercent(Number(event.target.value))}
            onPointerUp={commit}
            onKeyUp={commit}
            onBlur={commit}
          />
        </label>
      )}
    </div>
  );
}

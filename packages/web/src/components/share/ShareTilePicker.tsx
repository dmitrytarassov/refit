import type { ReactElement } from "react";

import type { ShareTile, ShareTileKey } from "../../types/share-tile";
import { ToggleSwitch } from "../common/ui/ToggleSwitch";

interface ShareTilePickerProps {
  tiles: ShareTile[];
  selected: ShareTileKey[];
  onToggle: (key: ShareTileKey, checked: boolean) => void;
}

export function ShareTilePicker({
  tiles,
  selected,
  onToggle,
}: ShareTilePickerProps): ReactElement {
  return (
    <ul className="share-tile-picker">
      {tiles.map((tile) => (
        <li key={tile.key}>
          <ToggleSwitch
            label={tile.label}
            checked={selected.includes(tile.key)}
            onChange={(checked) => onToggle(tile.key, checked)}
          />
        </li>
      ))}
    </ul>
  );
}

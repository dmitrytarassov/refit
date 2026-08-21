import type { RoutePalette } from "./route-palette";
import type { ShareTile } from "./share-tile";

export interface ShareCardData {
  title: string;
  subtitle: string;
  dateLabel?: string;
  points: Array<[number, number]>;
  routePalette: RoutePalette;
  tiles: ShareTile[];
}

export interface ShareCardPalette {
  background: string;
  card: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  ink: string;
  inkOn: string;
}

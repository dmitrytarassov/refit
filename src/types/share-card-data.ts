import type { ShareTile } from "./share-tile";

export interface ShareCardData {
  title: string;
  subtitle: string;
  dateLabel?: string;
  points: Array<[number, number]>;
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
  route: string;
  routeOutline: string;
}

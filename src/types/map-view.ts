/** World-pixel viewport of a Web Mercator map: `origin` is the top-left corner at `zoom`. */
export interface MapView {
  zoom: number;
  originX: number;
  originY: number;
}

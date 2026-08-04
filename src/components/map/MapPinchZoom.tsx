import { useEffect } from "react";
import { useMap } from "react-leaflet";

export function MapPinchZoom(): null {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey) {
        return;
      }
      event.preventDefault();
      map.setZoomAround(
        map.mouseEventToLatLng(event),
        map.getZoom() - event.deltaY / 80,
        {
          animate: false,
        },
      );
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [map]);

  return null;
}

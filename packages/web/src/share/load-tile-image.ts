const cache = new Map<string, Promise<HTMLImageElement | null>>();

/**
 * Loads a tile with CORS enabled so the canvas stays exportable; resolves null on failure or after 15 s.
 * Results are cached per URL for the page lifetime, so re-rendering the share image doesn't hit the OSM server again.
 */
export function loadTileImage(url: string): Promise<HTMLImageElement | null> {
  const cached = cache.get(url);
  if (cached != null) {
    return cached;
  }
  const loading = new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    const timer = window.setTimeout(() => resolve(null), 15_000);
    image.crossOrigin = "anonymous";
    image.onload = () => {
      window.clearTimeout(timer);
      resolve(image);
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      cache.delete(url);
      resolve(null);
    };
    image.src = url;
  });
  cache.set(url, loading);
  return loading;
}

import { useSyncExternalStore } from "react";

import { MOBILE_MEDIA_QUERY } from "../styles/mobile-breakpoint";

export function useIsMobile(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(MOBILE_MEDIA_QUERY);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOBILE_MEDIA_QUERY).matches,
  );
}

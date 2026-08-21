import { useCallback, useEffect, useState } from "react";

import { decodeSharePhoto } from "../share/decode-share-photo";

/** The user's photo for the share image, decoded from a picked file; the object URL is revoked on replace/unmount. */
export function useSharePhoto(): {
  photo: HTMLImageElement | null;
  decoding: boolean;
  pick: (file: File) => void;
} {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [decoding, setDecoding] = useState(false);

  const pick = useCallback((file: File) => {
    setDecoding(true);
    decodeSharePhoto(file)
      .then(setPhoto)
      .catch(() => undefined)
      .finally(() => setDecoding(false));
  }, []);

  useEffect(
    () => () => {
      if (photo != null) {
        URL.revokeObjectURL(photo.src);
      }
    },
    [photo],
  );

  return { photo, decoding, pick };
}

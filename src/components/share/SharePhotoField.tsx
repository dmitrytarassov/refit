import { ImagePlus, Loader2 } from "lucide-react";
import type { ChangeEvent, ReactElement } from "react";

import { useT } from "../../hooks/use-translation";

interface SharePhotoFieldProps {
  hasPhoto: boolean;
  busy: boolean;
  onPick: (file: File) => void;
}

/** File picker for the photo layout; styled as a button, the input itself is visually hidden. */
export function SharePhotoField({
  hasPhoto,
  busy,
  onPick,
}: SharePhotoFieldProps): ReactElement {
  const { t } = useT();
  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file != null) {
      onPick(file);
    }
    event.target.value = "";
  };
  return (
    <label className="share-photo-field" aria-busy={busy}>
      {busy ? (
        <Loader2 size={16} className="share-modal-spinner" aria-hidden="true" />
      ) : (
        <ImagePlus size={16} aria-hidden="true" />
      )}
      {hasPhoto ? t.share.changePhoto : t.share.choosePhoto}
      <input
        type="file"
        accept="image/*,.heic,.heif"
        disabled={busy}
        onChange={onChange}
      />
    </label>
  );
}

import { deferCall } from "just-defer-call";
import { Download, Loader2, Settings2, X } from "lucide-react";
import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import "./ShareModal.css";
import { SharePhotoField } from "./SharePhotoField";
import { ShareShadeControls } from "./ShareShadeControls";
import { ShareThemeButton } from "./ShareThemeButton";
import { ShareTilePicker } from "./ShareTilePicker";
import { ShareTitleField } from "./ShareTitleField";
import { ShareVariantSwitch } from "./ShareVariantSwitch";

import { useDropFile } from "../../hooks/use-drop-file";
import { useShareCardImage } from "../../hooks/use-share-card-image";
import { useSharePhoto } from "../../hooks/use-share-photo";
import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";
import { downloadDataUrl } from "../../share/download-data-url";
import { SHARE_SHADE_DEFAULT } from "../../share/share-shade-defaults";
import {
  SHARE_PHOTO_TILE_KEYS,
  SHARE_TILE_KEYS,
} from "../../share/share-tile-defaults";
import type { ShareCardData } from "../../types/share-card-data";
import type { ShareShade } from "../../types/share-shade";
import type { ShareTileKey } from "../../types/share-tile";
import type { ShareVariant } from "../../types/share-variant";
import { RoutePalettePicker } from "../map/RoutePalettePicker";

interface ShareModalProps {
  data: ShareCardData;
  onTitleChange: (title: string) => void;
  onClose: () => void;
}

export function ShareModal({
  data,
  onTitleChange,
  onClose,
}: ShareModalProps): ReactElement {
  const { t } = useT();
  const { mode } = useTheme();
  const [selection, setSelection] = useState<
    Record<ShareVariant, ShareTileKey[]>
  >({ map: SHARE_TILE_KEYS, photo: SHARE_PHOTO_TILE_KEYS });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [variant, setVariant] = useState<ShareVariant>("map");
  const [shade, setShade] = useState<ShareShade>(SHARE_SHADE_DEFAULT);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { photo, decoding, pick } = useSharePhoto();
  const { dragging, dropProps } = useDropFile(pick);
  const selected = selection[variant];
  const url = useShareCardImage(data, selected, {
    mode,
    variant,
    photo,
    shade,
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (settingsOpen) {
      settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [settingsOpen]);

  const toggle = (key: ShareTileKey, checked: boolean): void => {
    setSelection({
      ...selection,
      [variant]: checked
        ? SHARE_TILE_KEYS.filter((k) => k === key || selected.includes(k))
        : selected.filter((k) => k !== key),
    });
  };
  const save = (): void => {
    if (url != null) {
      downloadDataUrl(url, `${data.title}.png`);
    }
  };

  return (
    <div className="share-modal" role="dialog" aria-modal="true">
      <button
        type="button"
        className="share-modal-backdrop"
        onClick={onClose}
        aria-label={t.nav.close}
      />
      <section
        className="share-modal-panel"
        aria-label={t.share.title}
        data-dragging={variant === "photo" && dragging}
        {...(variant === "photo" ? dropProps : {})}
      >
        <header className="share-modal-header">
          <h2>{t.share.title}</h2>
          <button
            type="button"
            className="share-modal-icon-button"
            onClick={onClose}
            aria-label={t.nav.close}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="share-modal-body">
          <ShareVariantSwitch value={variant} onChange={setVariant} />
          {variant === "photo" && (
            <SharePhotoField
              hasPhoto={photo != null}
              busy={decoding}
              onPick={pick}
            />
          )}
          {url != null && !decoding ? (
            <img
              className="share-modal-preview"
              src={url}
              alt={t.share.preview}
            />
          ) : (
            <div className="share-modal-preview share-modal-placeholder">
              <Loader2
                size={20}
                className="share-modal-spinner"
                aria-hidden="true"
              />
              {decoding ? t.share.decodingPhoto : t.share.rendering}
            </div>
          )}
          {settingsOpen && (
            <div className="share-modal-settings" ref={settingsRef}>
              <ShareTitleField value={data.title} onChange={onTitleChange} />
              {variant === "photo" && (
                <ShareShadeControls value={shade} onChange={setShade} />
              )}
              <p>{t.charts.routePalette.label}</p>
              <RoutePalettePicker />
              <p>{t.share.cards}</p>
              <ShareTilePicker
                tiles={data.tiles}
                selected={selected}
                onToggle={toggle}
              />
            </div>
          )}
        </div>
        <footer className="share-modal-footer">
          <div className="share-modal-footer-actions">
            <button
              type="button"
              className="share-modal-icon-button"
              aria-label={t.share.settings}
              title={t.share.settings}
              aria-pressed={settingsOpen}
              onClick={deferCall(setSettingsOpen, !settingsOpen)}
            >
              <Settings2 size={18} aria-hidden="true" />
            </button>
            <ShareThemeButton />
          </div>
          <button
            type="button"
            className="share-modal-save"
            onClick={save}
            disabled={url == null}
          >
            <Download size={16} aria-hidden="true" />
            {t.share.save}
          </button>
        </footer>
      </section>
    </div>
  );
}

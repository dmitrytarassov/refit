import { deferCall } from "just-defer-call";
import { Download, Settings2, X } from "lucide-react";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import "./ShareModal.css";
import { ShareTilePicker } from "./ShareTilePicker";
import { ShareTitleField } from "./ShareTitleField";

import { useShareCardImage } from "../../hooks/use-share-card-image";
import { useTheme } from "../../hooks/use-theme";
import { useT } from "../../hooks/use-translation";
import { downloadDataUrl } from "../../share/download-data-url";
import { SHARE_TILE_KEYS } from "../../share/share-tile-defaults";
import type { ShareCardData } from "../../types/share-card-data";
import type { ShareTileKey } from "../../types/share-tile";

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
  const [selected, setSelected] = useState<ShareTileKey[]>(SHARE_TILE_KEYS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const url = useShareCardImage(data, selected, mode);

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggle = (key: ShareTileKey, checked: boolean): void => {
    setSelected(
      checked
        ? SHARE_TILE_KEYS.filter((k) => k === key || selected.includes(k))
        : selected.filter((k) => k !== key),
    );
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
      <section className="share-modal-panel" aria-label={t.share.title}>
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
          {url != null ? (
            <img
              className="share-modal-preview"
              src={url}
              alt={t.share.preview}
            />
          ) : (
            <div className="share-modal-preview share-modal-placeholder">
              {t.share.rendering}
            </div>
          )}
          {settingsOpen && (
            <div className="share-modal-settings">
              <ShareTitleField value={data.title} onChange={onTitleChange} />
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

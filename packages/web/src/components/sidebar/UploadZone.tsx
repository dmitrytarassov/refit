import { useRef, useState } from "react";
import type { DragEvent, KeyboardEvent, ReactElement } from "react";

import "./UploadZone.css";
import { useT } from "../../hooks/use-translation";

interface UploadZoneProps {
  onFile: (file: File) => void;
  busy: boolean;
}

export function UploadZone({ onFile, busy }: UploadZoneProps): ReactElement {
  const { t } = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragDepth, setDragDepth] = useState(0);

  const openBrowser = (): void => {
    if (!busy) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openBrowser();
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    if (!busy) {
      setDragDepth((depth) => depth + 1);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragDepth((depth) => Math.max(0, depth - 1));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragDepth(0);
    if (busy) {
      return;
    }
    const file = event.dataTransfer.files[0];
    if (file) {
      onFile(file);
    }
  };

  const className = [
    "upload-zone",
    dragDepth > 0 ? "is-dragover" : "",
    busy ? "is-busy" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      role="button"
      tabIndex={busy ? -1 : 0}
      aria-label={t.sidebar.upload.aria}
      aria-disabled={busy}
      onClick={openBrowser}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className="upload-zone-icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 16V4M12 4l-5 5M12 4l5 5M4 20h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="upload-zone-text">{t.sidebar.upload.drag}</p>
      <p className="upload-zone-browse">{t.sidebar.upload.browse}</p>
      <p className="upload-zone-hint">{t.sidebar.upload.hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept=".fit"
        className="upload-zone-input"
        tabIndex={-1}
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFile(file);
          }
          event.target.value = "";
        }}
      />
    </div>
  );
}

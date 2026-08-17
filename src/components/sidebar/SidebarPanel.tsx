import "./SidebarPanel.css";
import type { ReactElement } from "react";

import { UploadZone } from "./UploadZone";

import { useT } from "../../hooks/use-translation";

interface SidebarPanelProps {
  onFile: (file: File) => void;
  busy: boolean;
}

export function SidebarPanel({
  onFile,
  busy,
}: SidebarPanelProps): ReactElement {
  const { t } = useT();
  return (
    <aside className="sidebar-panel">
      <div className="sidebar-brand">
        <h1 className="sidebar-title">ReFit</h1>
        <p className="sidebar-subtitle">{t.sidebar.subtitle}</p>
      </div>
      <UploadZone onFile={onFile} busy={busy} />
    </aside>
  );
}

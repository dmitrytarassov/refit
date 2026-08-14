import "./SidebarPanel.css";
import type { ReactElement } from "react";

import { UploadZone } from "./UploadZone";

interface SidebarPanelProps {
  onFile: (file: File) => void;
  busy: boolean;
}

export function SidebarPanel({
  onFile,
  busy,
}: SidebarPanelProps): ReactElement {
  return (
    <aside className="sidebar-panel">
      <div className="sidebar-brand">
        <h1 className="sidebar-title">ReFit</h1>
        <p className="sidebar-subtitle">
          Clean and enrich your .fit files with power data and more insights.
        </p>
      </div>
      <UploadZone onFile={onFile} busy={busy} />
    </aside>
  );
}

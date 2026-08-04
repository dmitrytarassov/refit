import "./SidebarPanel.css";
import type { ReactElement } from "react";

import { HowItWorksCard } from "./HowItWorksCard";
import { UploadZone } from "./UploadZone";
import { WhatYouGetCard } from "./WhatYouGetCard";

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
      <h1 className="sidebar-title">ReFit</h1>
      <p className="sidebar-subtitle">
        Clean and enrich your .fit files with power data and more insights.
      </p>
      <UploadZone onFile={onFile} busy={busy} />
      <HowItWorksCard />
      <WhatYouGetCard />
    </aside>
  );
}

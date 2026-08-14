import "./SidebarInfoCards.css";
import type { ReactElement } from "react";

import { HowItWorksCard } from "./HowItWorksCard";
import { WhatYouGetCard } from "./WhatYouGetCard";

export function SidebarInfoCards(): ReactElement {
  return (
    <aside className="sidebar-info-cards">
      <HowItWorksCard />
      <WhatYouGetCard />
    </aside>
  );
}

import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";
import { useState } from "react";

import { MobileNavBar } from "./MobileNavBar";
import { MobileNavDrawer } from "./MobileNavDrawer";

interface MobileNavProps {
  activeView: "dashboard" | "history" | "help" | "settings";
}

export function MobileNav({ activeView }: MobileNavProps): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <MobileNavBar
        activeView={activeView}
        onOpenMenu={deferCall(setMenuOpen, true)}
      />
      <MobileNavDrawer
        open={menuOpen}
        activeView={activeView}
        onClose={deferCall(setMenuOpen, false)}
      />
    </>
  );
}

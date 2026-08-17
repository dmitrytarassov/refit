import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";

export function PowerModelHelp(): ReactElement {
  const { t } = useT();
  return <article className="help-card">{t.help.powerModel}</article>;
}

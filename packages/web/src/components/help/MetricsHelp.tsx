import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";

export function MetricsHelp(): ReactElement {
  const { t } = useT();
  return <article className="help-card">{t.help.metrics}</article>;
}

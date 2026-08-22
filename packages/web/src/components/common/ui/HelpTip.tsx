import { CircleHelp } from "lucide-react";
import type { ReactElement } from "react";

import "./HelpTip.css";
import { useT } from "../../../hooks/use-translation";

interface HelpTipProps {
  text: string;
}

export function HelpTip({ text }: HelpTipProps): ReactElement {
  const { t } = useT();
  return (
    <span className="help-tip">
      <button
        type="button"
        className="help-tip-trigger"
        aria-label={t.charts.whatIsThis}
      >
        <CircleHelp size={16} aria-hidden="true" />
      </button>
      <span role="tooltip" className="help-tip-bubble">
        {text}
      </span>
    </span>
  );
}

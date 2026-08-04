import { CircleHelp } from "lucide-react";
import type { ReactElement } from "react";
import "./HelpTip.css";

interface HelpTipProps {
  text: string;
}

export function HelpTip({ text }: HelpTipProps): ReactElement {
  return (
    <span className="help-tip">
      <button
        type="button"
        className="help-tip-trigger"
        aria-label="What is this?"
      >
        <CircleHelp size={16} aria-hidden="true" />
      </button>
      <span role="tooltip" className="help-tip-bubble">
        {text}
      </span>
    </span>
  );
}

import "./ToggleSwitch.css";
import type { ReactElement } from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({
  label,
  checked,
  onChange,
}: ToggleSwitchProps): ReactElement {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle-switch-track" aria-hidden="true" />
      <span className="toggle-switch-label">{label}</span>
    </label>
  );
}

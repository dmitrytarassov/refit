import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";

import { useT } from "../../hooks/use-translation";
import { SHARE_VARIANTS } from "../../share/share-variant-defaults";
import type { ShareVariant } from "../../types/share-variant";

interface ShareVariantSwitchProps {
  value: ShareVariant;
  onChange: (variant: ShareVariant) => void;
}

/** Segmented "Map / Photo" switch for the share image layout. */
export function ShareVariantSwitch({
  value,
  onChange,
}: ShareVariantSwitchProps): ReactElement {
  const { t } = useT();
  return (
    <div
      className="share-variant-switch"
      role="radiogroup"
      aria-label={t.share.layout}
    >
      {SHARE_VARIANTS.map((variant) => (
        <button
          key={variant}
          type="button"
          role="radio"
          aria-checked={variant === value}
          onClick={deferCall(onChange, variant)}
        >
          {t.share.variants[variant]}
        </button>
      ))}
    </div>
  );
}

import { useNavigate } from "react-router-dom";

import { buildCompareUrl } from "../compare/build-compare-url";
import { replaceCompareId } from "../compare/replace-compare-id";

/** Puts a ride into a compare slot by rewriting the URL in place. */
export function useComparePicker(ids: number[]): {
  pick: (slot: number, id: number) => void;
} {
  const navigate = useNavigate();
  const pick = (slot: number, id: number): void => {
    void navigate(buildCompareUrl(replaceCompareId(ids, slot, id)), {
      replace: true,
    });
  };
  return { pick };
}

import { deferCall } from "just-defer-call";
import type { ReactElement } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { CompareModal } from "./CompareModal";
import { CompareRideColumn } from "./CompareRideColumn";
import { CompareRidePicker } from "./CompareRidePicker";
import "./ComparePage.css";

import { parseCompareIds } from "../../compare/parse-compare-ids";
import { useT } from "../../hooks/use-translation";

export function ComparePage(): ReactElement {
  const { t } = useT();
  const [searchParams] = useSearchParams();
  const ids = parseCompareIds(searchParams);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <section className="compare-page">
      <header className="compare-page-header">
        <h2>{t.compare.title}</h2>
        <button
          type="button"
          className="compare-change"
          onClick={deferCall(setModalOpen, true)}
        >
          {t.compare.change}
        </button>
      </header>
      <div className="compare-columns">
        {[0, 1].map((slot) => {
          const id = ids[slot];
          return (
            <div className="compare-column" key={id ?? `slot-${slot}`}>
              {id != null ? (
                <CompareRideColumn id={id} />
              ) : (
                slot === ids.length && <CompareRidePicker selected={ids} />
              )}
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <CompareModal ids={ids} onClose={deferCall(setModalOpen, false)} />
      )}
    </section>
  );
}

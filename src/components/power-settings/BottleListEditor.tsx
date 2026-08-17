import "./BottleListEditor.css";
import { deferCall } from "just-defer-call";
import { Plus, X } from "lucide-react";
import type { ReactElement } from "react";

interface BottleListEditorProps {
  bottles: number[];
  onChange: (bottles: number[]) => void;
}

export function BottleListEditor({
  bottles,
  onChange,
}: BottleListEditorProps): ReactElement {
  const removeAt = (index: number): void => {
    onChange(bottles.filter((_, i) => i !== index));
  };

  const add = (): void => {
    onChange([...bottles, 500]);
  };

  const commit = (index: number, raw: string): void => {
    const value = Number(raw);
    if (Number.isNaN(value) || value <= 0 || value === bottles[index]) {
      return;
    }
    onChange(bottles.map((ml, i) => (i === index ? value : ml)));
  };

  return (
    <div className="bottle-list">
      {bottles.map((ml, index) => (
        <span className="bottle-list-item" key={`${index}-${ml}`}>
          <input
            type="number"
            min={100}
            max={3000}
            step={50}
            defaultValue={ml}
            aria-label={`Bottle ${index + 1} volume, ml`}
            onBlur={(event) => commit(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
          <span className="bottle-list-unit">ml</span>
          <button
            type="button"
            className="bottle-list-remove"
            aria-label={`Remove bottle ${index + 1}`}
            onClick={deferCall(removeAt, index)}
          >
            <X size={13} aria-hidden="true" />
          </button>
        </span>
      ))}
      <button type="button" className="bottle-list-add" onClick={add}>
        <Plus size={13} aria-hidden="true" /> Add bottle
      </button>
    </div>
  );
}

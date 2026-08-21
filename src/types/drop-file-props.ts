import type { DragEvent } from "react";

/** Handlers spread onto the drop target element. */
export interface DropFileProps {
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDragLeave: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}

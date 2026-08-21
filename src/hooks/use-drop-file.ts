import { useState } from "react";

import { IMAGE_FILE_NAME } from "../share/image-file-name";
import type { DropFileProps } from "../types/drop-file-props";

/** Drag-and-drop of one image file (by MIME type or extension — HEIC drops may come with an empty type) onto an element; `dragging` is true while a file hovers over it. */
export function useDropFile(onFile: (file: File) => void): {
  dragging: boolean;
  dropProps: DropFileProps;
} {
  const [dragging, setDragging] = useState(false);
  const dropProps: DropFileProps = {
    onDragOver: (event) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: (event) => {
      const next = event.relatedTarget;
      if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
        setDragging(false);
      }
    },
    onDrop: (event) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files[0];
      if (
        file != null &&
        (file.type.startsWith("image/") || IMAGE_FILE_NAME.test(file.name))
      ) {
        onFile(file);
      }
    },
  };
  return { dragging, dropProps };
}

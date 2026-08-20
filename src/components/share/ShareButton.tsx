import { deferCall } from "just-defer-call";
import { Share2 } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";

import { ShareModal } from "./ShareModal";

import { useShareCardData } from "../../hooks/use-share-card-data";
import { useT } from "../../hooks/use-translation";
import type { Activity } from "../../types/activity";

interface ShareButtonProps {
  activity: Activity;
  onTitleChange: (title: string) => void;
}

export function ShareButton({
  activity,
  onTitleChange,
}: ShareButtonProps): ReactElement {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const data = useShareCardData(activity);

  return (
    <>
      <button
        type="button"
        className="file-header-card-secondary file-header-card-share"
        onClick={deferCall(setOpen, true)}
      >
        <Share2 size={16} aria-hidden="true" />
        {t.share.button}
      </button>
      {open && (
        <ShareModal
          data={data}
          onTitleChange={onTitleChange}
          onClose={deferCall(setOpen, false)}
        />
      )}
    </>
  );
}

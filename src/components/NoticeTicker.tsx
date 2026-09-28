import React, { useState } from 'react';
import { Volume2, X, ExternalLink } from 'lucide-react';

interface NoticeTickerProps {
  noticeText: string;
  telegramUrl: string;
  enabled?: boolean;
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({
  noticeText,
  telegramUrl,
  enabled = true
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!enabled || !noticeText || isDismissed) return null;

  return (
    <div className="relative border-b border-amber-950/40 bg-gradient-to-r from-amber-950/30 via-neutral-900/90 to-amber-950/30 px-4 py-2 text-xs text-amber-200/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <Volume2 className="h-3 w-3" />
          </span>
          <p className="truncate text-xs text-neutral-300 font-medium">
            {noticeText}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {telegramUrl && (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              <span>Join Telegram</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss notice"
            className="cursor-pointer text-neutral-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

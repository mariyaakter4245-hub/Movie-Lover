import React, { useEffect, useRef } from 'react';
import { AdSlotConfig } from '../types';
import { recordAdClick } from '../services/api';
import { ExternalLink, X } from 'lucide-react';

interface AdBannerProps {
  slot?: AdSlotConfig;
  masterEnabled?: boolean;
  isAdminView?: boolean;
  forcePreview?: boolean;
  className?: string;
  onDismiss?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  masterEnabled = true,
  isAdminView = false,
  forcePreview = false,
  className = '',
  onDismiss
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // CRITICAL REQUIREMENT: "admin panel e ads show na kore"
  // Never show ads in admin views unless explicitly inside the Ad Manager Preview box (forcePreview = true)
  if (isAdminView && !forcePreview) {
    return null;
  }

  // If master ads is disabled and not in forced preview, don't show
  if (!masterEnabled && !forcePreview) {
    return null;
  }

  // If slot doesn't exist or is disabled
  if (!slot || (!slot.enabled && !forcePreview)) {
    return null;
  }

  // Effect to safely execute scripts when slot type is script/custom_html
  useEffect(() => {
    if (!containerRef.current || slot.type === 'banner') return;

    if (slot.customHtml) {
      // Find scripts in the customHtml and create fresh DOM script nodes so browser executes them
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = slot.customHtml;

      const scripts = tempDiv.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.text = oldScript.text;
        containerRef.current?.appendChild(newScript);
      });
    }
  }, [slot.customHtml, slot.type]);

  const handleAdClick = () => {
    recordAdClick();
  };

  return (
    <div className={`relative overflow-hidden transition-all duration-200 ${className}`}>
      {/* Subtle Ad label for regulatory & user transparency */}
      <div className="flex items-center justify-between pb-1 text-[10px] uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1 font-medium">
          {slot.label || 'Sponsored Ad'}
          {forcePreview && (
            <span className="ml-1 rounded bg-amber-500/20 px-1 py-0.2 text-[9px] text-amber-400">
              Admin Sandbox Preview
            </span>
          )}
        </span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss ad"
            className="cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {slot.type === 'banner' && slot.bannerUrl ? (
        <a
          href={slot.targetUrl || '#'}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={handleAdClick}
          className="group relative block overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60 shadow-lg transition-all hover:border-amber-500/50"
        >
          <img
            src={slot.bannerUrl}
            alt={slot.name || 'Advertisement'}
            referrerPolicy="no-referrer"
            className="h-auto max-h-[140px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-slate-300 backdrop-blur-xs flex items-center gap-1">
            <span>Visit Sponsor</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </div>
        </a>
      ) : (
        <div
          ref={containerRef}
          className="overflow-hidden rounded-lg"
          dangerouslySetInnerHTML={{ __html: slot.customHtml || '<div class="p-3 text-center text-xs text-slate-500">Empty Ad Slot</div>' }}
        />
      )}
    </div>
  );
};

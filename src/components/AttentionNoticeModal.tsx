import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, X, ThumbsUp } from 'lucide-react';

interface AttentionNoticeModalProps {
  telegramUrl?: string;
}

export const AttentionNoticeModal: React.FC<AttentionNoticeModalProps> = ({
  telegramUrl = 'https://t.me/+pv7RFxweVzA3ZmFl'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('seen_moviebaaz_notice');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('seen_moviebaaz_notice', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-red-600 bg-gradient-to-r from-[#02182f] via-[#3b073b] to-[#02182f] shadow-2xl z-10 text-neutral-200">
        {/* Close Button Top Right */}
        <button
          onClick={handleClose}
          className="absolute -top-1 -right-1 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-900 bg-gradient-to-tr from-amber-500 to-lime-400 text-red-600 font-bold hover:scale-110 transition-transform cursor-pointer shadow-lg"
          title="Close notice"
        >
          <X className="h-4 w-4 stroke-[3]" />
        </button>

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-[#0087fc] via-[#ff2b99] to-[#0087fc] py-3 px-4 text-center">
          <h2 className="flex items-center justify-center gap-2.5 font-['Cabinet_Grotesk'] text-lg font-black uppercase tracking-wider text-white">
            <AlertTriangle className="h-5 w-5 text-amber-300 fill-amber-300/30" />
            <span>Attention Please</span>
            <AlertTriangle className="h-5 w-5 text-amber-300 fill-amber-300/30" />
          </h2>
        </div>

        {/* Notice Body in authentic Bengali from MovieBaaz.baby */}
        <div className="p-6 text-center space-y-4 text-sm leading-relaxed">
          <p className="font-medium text-white">
            আমাদের সাইটে ভিজিট করতে সব সময়{' '}
            <strong className="text-red-500 font-bold underline">MovieBaaz.com</strong> লিখে ভিজিট করবেন।
          </p>

          <hr className="border-neutral-700/60" />

          <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-medium">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
            <span>প্রতি পেইজে ১/২ টা করে এডস আসতে পারে, এডস আসলে ফোনের ব্যাক বাটনে ক্লিক করে আবার চেষ্টা করুন।</span>
          </div>

          <hr className="border-neutral-700/60" />

          <p className="text-xs text-neutral-300">
            প্রতিদিন সকল নতুন মুভি ও ওয়েবসাইটের আপডেট পেতে আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন হয়ে থাকুন:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0088cc] to-[#34b8fa] px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Join Telegram Channel</span>
            </a>

            <a
              href="https://www.facebook.com/moviebaazlink"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3b5998] to-[#0f59f5] px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <span>Facebook Page</span>
            </a>
          </div>

          {/* Bottom Confirmation Button */}
          <div className="pt-2">
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-red-500 bg-gradient-to-r from-[#00d0ff] to-[#cbfc01] px-6 py-2 text-xs font-bold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Thank You! (Enter Site)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

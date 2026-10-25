import React from 'react';
import { X, Heart, Calendar } from 'lucide-react';
import { FeedbackLetter } from '../../types';

interface LetterReaderModalProps {
  letter: FeedbackLetter | null;
  onClose: () => void;
}

export const LetterReaderModal: React.FC<LetterReaderModalProps> = ({ letter, onClose }) => {
  if (!letter) return null;

  const isVideo = letter.image?.startsWith('data:video') || letter.image?.endsWith('.mp4') || letter.image?.endsWith('.webm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white text-dark-forest shadow-xl border border-black/10 flex items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer z-30"
          title="Close note"
        >
          <X size={20} />
        </button>

        {/* Paper Clipboard Container */}
        <div className="relative w-full aspect-[9/16] flex items-center justify-center select-none filter drop-shadow-2xl">
          {/* Paper Clipboard Graphic Asset */}
          <img
            src="/assets/letters/paper-clipboard.png"
            alt="Paper Clipboard"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Lined Note Content Overlay */}
          <div className="relative z-10 w-full h-full flex flex-col pt-[36%] pb-[26%] px-[18%] text-[#1B4332]">
            {/* Note Meta Header */}
            <div className="flex items-center justify-between text-[11px] font-sans font-semibold border-b border-[#839958]/30 pb-1 mb-2 text-[#2E7D32]">
              <span className="truncate">From: <strong>{letter.userName}</strong></span>
              <span className="flex items-center gap-1 text-[10px] text-slate-600 flex-shrink-0">
                <Calendar size={10} />
                {new Date(letter.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Handwritten Letter Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              <p
                className="font-handwritten text-lg sm:text-xl text-[#0A3323] leading-relaxed whitespace-pre-line tracking-wide"
                style={{ fontFamily: 'var(--font-handwritten), Caveat, cursive' }}
              >
                {letter.text}
              </p>

              {/* Attached Media (Photo or Video Clip) */}
              {letter.image && (
                <div className="rounded-xl overflow-hidden border border-[#839958]/40 shadow-sm mt-2 bg-white/80">
                  {isVideo ? (
                    <video
                      src={letter.image}
                      controls
                      className="w-full max-h-36 object-cover"
                    />
                  ) : (
                    <img
                      src={letter.image}
                      alt="Letter memory"
                      className="w-full max-h-36 object-cover"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Note Footer */}
            <div className="pt-2 border-t border-[#839958]/20 flex items-center justify-between text-[10px] font-sans text-slate-600">
              <span className="italic font-serif text-[#2E7D32]">GreenBridge Community Reel</span>
              <div className="flex items-center gap-1 text-red-500">
                <Heart size={12} className="fill-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

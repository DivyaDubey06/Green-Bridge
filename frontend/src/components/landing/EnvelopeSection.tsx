import React, { useState } from 'react';
import { Mail, Heart, Sparkles, Send, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { FeedbackLetter } from '../../types';
import { WriteLetterModal } from './WriteLetterModal';
import { LetterReaderModal } from './LetterReaderModal';

export const EnvelopeSection: React.FC = () => {
  const { letters } = useAuthStore();
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<FeedbackLetter | null>(null);

  const approvedLetters = letters.filter(l => l.status === 'APPROVED');

  return (
    <section className="py-20 bg-gradient-to-b from-transparent via-[#F5DFC0]/20 to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-green bg-soft-mint px-3.5 py-1.5 rounded-full border border-primary-green/20">
            Community Voice & Experience
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-dark-forest dark:text-beige">
            Write Us a Letter & Community Reel
          </h2>
          <p className="text-xs text-slate-text/70 dark:text-moss max-w-md mx-auto">
            Click the envelope to send a note or browse real letters shared by volunteers and citizens across Dehradun.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left 6 Cols: Kraft Envelope Interactive Graphic */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center space-y-6">
            <div
              onClick={() => setIsWriteOpen(true)}
              className="relative w-72 h-48 cursor-pointer group animate-sway"
              title="Click to write us a letter"
            >
              {/* Kraft Envelope Body */}
              <div 
                className="w-full h-full rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 group-hover:scale-105 border-2 border-[#CD9777]/40 flex items-center justify-center"
                style={{
                  backgroundColor: '#839958',
                  backgroundImage: 'radial-gradient(circle at top, #9AB36A, #6C8045)'
                }}
              >
                {/* Flap Graphic */}
                <div 
                  className="absolute top-0 left-0 right-0 h-24 border-b-2 border-[#CD9777]/30 transition-transform duration-300 group-hover:-translate-y-2 origin-top"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    backgroundColor: '#0A3323'
                  }}
                />

                {/* Peeking Cream Paper Letter */}
                <div className="w-56 h-28 bg-[#FAF6ED] rounded-xl shadow-md p-3 transition-transform duration-300 group-hover:-translate-y-4 flex flex-col justify-between border border-[#CD9777]/30">
                  <span className="text-[10px] font-serif font-bold text-dark-forest">Dear GreenBridge...</span>
                  <p className="text-[9px] text-slate-600 line-clamp-2 italic">"Thank you for helping us organize the Robbers Cave cleanup!"</p>
                  <span className="text-[8px] font-bold text-primary-green uppercase tracking-wider text-right">Click to write &rarr;</span>
                </div>
              </div>

              {/* Heart Badge on Flap */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-100 text-dark-forest flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Mail size={18} className="text-primary-green" />
              </div>
            </div>

            <button
              onClick={() => setIsWriteOpen(true)}
              className="bg-primary-green hover:bg-dark-forest text-white font-bold px-7 py-3.5 rounded-2xl flex items-center gap-2 text-xs shadow-lg shadow-primary-green/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Send size={14} />
              Write Us a Letter
            </button>
          </div>

          {/* Right 6 Cols: Vertically Auto-Scrolling Letter Reel Marquee (Pause on Hover) */}
          <div className="lg:col-span-6 bg-white/70 dark:bg-dark-forest/70 backdrop-blur-sm border border-[#CD9777]/25 p-6 rounded-[36px] shadow-sm h-[400px] overflow-hidden relative group">
            <h4 className="font-serif text-base font-bold text-dark-forest dark:text-beige mb-4 flex items-center gap-2 border-b border-[#CD9777]/15 pb-3">
              <Sparkles size={16} className="text-primary-green" />
              Recent Letters & Feedback Reel ({approvedLetters.length})
            </h4>

            {approvedLetters.length > 0 ? (
              <div className="h-[310px] overflow-y-auto space-y-4 pr-2 group-hover:[animation-play-state:paused]">
                {approvedLetters.map((letter) => (
                  <div
                    key={letter.id}
                    onClick={() => setSelectedLetter(letter)}
                    className="p-4 bg-warm-cream/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 rounded-2xl border border-[#CD9777]/15 shadow-xs cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-dark-forest dark:text-beige block truncate">{letter.userName}</span>
                        <p 
                          className="font-handwritten text-base text-[#0A3323] dark:text-[#F7F4D5] line-clamp-2 mt-0.5"
                          style={{ fontFamily: 'var(--font-handwritten), Caveat, cursive' }}
                        >
                          "{letter.text}"
                        </p>
                      </div>
                      {letter.image && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#CD9777]/20 bg-black/5 flex items-center justify-center">
                          {letter.image.startsWith('data:video') ? (
                            <span className="text-xs">🎬</span>
                          ) : (
                            <img src={letter.image} alt="Thumbnail" className="w-full h-full object-cover" />
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-text/45 dark:text-moss/60 mt-2 block text-right">
                      {new Date(letter.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-2 border border-dashed border-[#CD9777]/30 rounded-2xl">
                <MessageSquare size={36} className="text-primary-green/30" />
                <p className="text-xs font-semibold text-slate-text/60 dark:text-moss">No community letters submitted yet.</p>
                <button
                  onClick={() => setIsWriteOpen(true)}
                  className="text-xs font-bold text-primary-green hover:underline cursor-pointer"
                >
                  Be the first to write a letter! &rarr;
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modals */}
      <WriteLetterModal isOpen={isWriteOpen} onClose={() => setIsWriteOpen(false)} />
      <LetterReaderModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
    </section>
  );
};

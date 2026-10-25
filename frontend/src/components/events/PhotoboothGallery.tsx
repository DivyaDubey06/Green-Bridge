import React from 'react';
import { Camera, Heart, Sparkles, MessageSquare, Plus } from 'lucide-react';
import { EventExperience } from '../../types';
import { Avatar } from '../common/Avatar';

interface PhotoboothGalleryProps {
  experiences: EventExperience[];
  onOpenUpload: () => void;
}

export const PhotoboothGallery: React.FC<PhotoboothGalleryProps> = ({ experiences, onOpenUpload }) => {
  const approvedExperiences = experiences.filter(exp => exp.status === 'APPROVED');

  return (
    <div className="mt-16 space-y-8 bg-gradient-to-b from-transparent via-[#F5DFC0]/20 to-transparent p-8 rounded-[40px] border border-[#CD9777]/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#CD9777]/15">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary-green bg-soft-mint px-3.5 py-1 rounded-full border border-primary-green/20">
            Community Photobooth & Memories
          </span>
          <h2 className="font-serif text-3xl font-bold text-dark-forest dark:text-beige mt-2 flex items-center gap-2">
            <Camera className="text-primary-green" size={28} />
            Event Experiences & Gallery
          </h2>
          <p className="text-xs text-slate-text/70 dark:text-moss mt-1 max-w-xl">
            Real photos and handwritten journal notes from volunteers and attendees who made a difference in recent drives.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="bg-primary-green hover:bg-dark-forest text-white font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 text-sm shadow-lg shadow-primary-green/20 hover:-translate-y-0.5 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus size={18} />
          Share Your Event Photos
        </button>
      </div>

      {/* Gallery Grid */}
      {approvedExperiences.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {approvedExperiences.map((exp) => (
            <div
              key={exp.id}
              className="break-inside-avoid watercolor-card p-5 rounded-3xl border border-[#CD9777]/25 shadow-sm hover:shadow-xl transition-all space-y-4 group bg-white/90 dark:bg-dark-forest/80"
            >
              {/* Image or Video */}
              {exp.images.length > 0 && (
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 group-hover:scale-[1.01] transition-transform bg-black/5">
                  {exp.images[0].startsWith('data:video') || exp.images[0].endsWith('.mp4') || exp.images[0].endsWith('.webm') ? (
                    <video
                      src={exp.images[0]}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={exp.images[0]}
                      alt={exp.eventTitle}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-xs font-medium pointer-events-none">
                    📍 Tagged in: {exp.eventTitle}
                  </div>
                </div>
              )}

              {/* Reflection Note */}
              <div className="space-y-2">
                <p className="text-xs font-serif italic text-dark-forest/90 dark:text-beige leading-relaxed">
                  "{exp.reflection}"
                </p>
                <div className="text-[10px] text-primary-green font-semibold bg-soft-mint/30 dark:bg-primary-green/20 px-2.5 py-1 rounded-lg inline-block">
                  Event: {exp.eventTitle}
                </div>
              </div>

              {/* Uploader Footer */}
              <div className="pt-3 border-t border-[#CD9777]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {exp.userAvatar ? (
                    <Avatar config={exp.userAvatar} size={28} />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center text-xs font-bold">
                      {exp.userName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="block text-xs font-bold text-dark-forest dark:text-beige leading-none">{exp.userName}</span>
                    <span className="text-[9px] text-slate-text/50 dark:text-moss">{new Date(exp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-text/40 dark:text-moss/60 text-xs">
                  <Heart size={14} className="hover:text-red-500 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/50 dark:bg-dark-forest/50 rounded-3xl border border-dashed border-[#CD9777]/30 space-y-3">
          <Camera size={44} className="mx-auto text-primary-green/40" />
          <h4 className="font-bold text-sm text-dark-forest dark:text-beige">No Event Memories Uploaded Yet</h4>
          <p className="text-xs text-slate-text/60 dark:text-moss max-w-sm mx-auto">
            Be the first attendee to post a photo and handwritten reflection from an event you participated in!
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-2 text-xs font-bold text-primary-green underline hover:text-dark-forest transition-colors cursor-pointer"
          >
            Post your experience now &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

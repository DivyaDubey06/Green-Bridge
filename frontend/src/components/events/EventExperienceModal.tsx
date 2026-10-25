import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Send, Sparkles, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

interface EventExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledEventId?: string;
}

export const EventExperienceModal: React.FC<EventExperienceModalProps> = ({
  isOpen,
  onClose,
  prefilledEventId
}) => {
  const { events, currentUser, createEventExperience } = useAuthStore();
  const [selectedEventId, setSelectedEventId] = useState(prefilledEventId || (events[0]?.id || ''));
  const [reflection, setReflection] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFilePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setUploadedFiles((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to post an event experience.');
      return;
    }
    if (!reflection.trim()) {
      toast.error('Please write a short reflection note.');
      return;
    }

    const eventObj = events.find(ev => ev.id === selectedEventId);
    const eventTitle = eventObj ? eventObj.title : 'Community Event';

    try {
      setIsSubmitting(true);
      await createEventExperience({
        eventId: selectedEventId,
        eventTitle,
        reflection: reflection.trim(),
        images: uploadedFiles.length > 0 ? uploadedFiles : ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=60']
      });

      toast.success('Journal note posted! Pending admin moderation approval. 📝');
      setReflection('');
      setUploadedFiles([]);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit experience.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-xl rounded-[36px] shadow-2xl p-8 border-2 border-[#CD9777]/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: '#FDFBF7',
          backgroundImage: `
            linear-gradient(90deg, rgba(239,68,68,0.15) 1px, transparent 0),
            linear-gradient(rgba(205,151,119,0.1) 1px, transparent 0)
          `,
          backgroundSize: '100% 100%, 100% 28px',
          backgroundPosition: '40px 0, 0 0'
        }}
      >
        {/* Notebook Spiral Hole Punches visual effect */}
        <div className="absolute left-3 top-0 bottom-0 flex flex-col justify-around py-6 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full bg-slate-300/80 border border-slate-400/50 shadow-inner" />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-100/70 hover:bg-amber-200/80 text-dark-forest flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        <div className="pl-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#CD9777]/20 text-dark-forest flex items-center justify-center font-serif font-bold text-lg shadow-xs">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-dark-forest">Event Journal Reflection</h3>
              <p className="text-xs text-slate-text/70 italic">Write a handwritten note on paper to record your experience.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Event Selector */}
            <div>
              <label className="block text-xs font-bold text-dark-forest uppercase tracking-wider mb-1">
                Select Event Attended:
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-white/90 border border-[#CD9777]/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.date})
                  </option>
                ))}
              </select>
            </div>

            {/* Handwritten Reflection Textarea with custom pencil cursor */}
            <div>
              <label className="block text-xs font-bold text-dark-forest uppercase tracking-wider mb-1">
                Your Reflection Note:
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={4}
                placeholder="What did you experience? What touched your heart during this drive?"
                className="pencil-cursor w-full bg-white/80 border border-[#CD9777]/30 rounded-2xl p-4 text-sm font-serif text-slate-800 leading-loose focus:outline-none focus:ring-2 focus:ring-primary-green resize-none shadow-inner"
                style={{ lineHeight: '28px' }}
              />
              <span className="text-[10px] text-slate-text/50 italic mt-1 block">
                ✏️ Hover over text box to activate pencil cursor.
              </span>
            </div>

            {/* Device Media Upload Field (Images & Videos) */}
            <div>
              <label className="block text-xs font-bold text-dark-forest uppercase tracking-wider mb-1">
                Upload Event Photos or Videos from Device:
              </label>
              <div className="relative border-2 border-dashed border-[#CD9777]/40 hover:border-primary-green rounded-2xl p-4 bg-white/70 text-center transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFilePickerChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="event-file-input"
                />
                <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-soft-mint text-primary-green flex items-center justify-center">
                    <Upload size={18} />
                  </div>
                  <span className="text-xs font-bold text-dark-forest">
                    Click or drag files here to upload from device
                  </span>
                  <span className="text-[10px] text-slate-text/60">
                    Supports high-res photos and short video clips from your gallery
                  </span>
                </div>
              </div>

              {/* Uploaded Files Preview Grid */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {uploadedFiles.map((fileData, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-[#CD9777]/30 bg-black/5">
                      {fileData.startsWith('data:video') ? (
                        <video src={fileData} className="w-full h-full object-cover" />
                      ) : (
                        <img src={fileData} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-green hover:bg-dark-forest text-white px-7 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary-green/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={14} />
                {isSubmitting ? 'Posting Note...' : 'Submit Journal Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

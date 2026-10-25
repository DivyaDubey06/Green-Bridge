import React, { useState } from 'react';
import { X, Send, Mail, Upload, Sparkles, Eye, Edit3 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

interface WriteLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WriteLetterModal: React.FC<WriteLetterModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, createFeedbackLetter } = useAuthStore();
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [letterText, setLetterText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  if (!isOpen) return null;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video/');
    setMediaType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setMediaUrl(result);
        toast.success(`Attached ${isVid ? 'video' : 'photo'} from your gallery! 📎`);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaUrl('');
    setZoomLevel(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterText.trim()) {
      toast.error('Please write a message or feedback letter.');
      return;
    }
    if (!userName.trim()) {
      toast.error('Please enter your name.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createFeedbackLetter({
        userId: currentUser?.id,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        text: letterText.trim(),
        image: mediaUrl || undefined
      });

      toast.success('Your letter has been posted to our community reel! 💌');
      setLetterText('');
      setMediaUrl('');
      setActiveTab('write');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit letter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-xl rounded-[36px] shadow-2xl p-6 sm:p-8 border-2 border-[#CD9777]/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: '#FAF6ED',
          backgroundImage: 'radial-gradient(circle, rgba(205,151,119,0.1) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-dark-forest flex items-center justify-center transition-colors cursor-pointer z-20"
        >
          <X size={18} />
        </button>

        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pr-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-green/10 text-primary-green flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-dark-forest">Write Us a Letter</h3>
                <p className="text-xs text-slate-text/70 italic">Share your experience or feedback with GreenBridge.</p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-amber-200/40 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'write' ? 'bg-white shadow-xs text-dark-forest' : 'text-slate-600 hover:text-dark-forest'
                }`}
              >
                <Edit3 size={12} />
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'preview' ? 'bg-white shadow-xs text-dark-forest' : 'text-slate-600 hover:text-dark-forest'
                }`}
              >
                <Eye size={12} />
                Preview Note
              </button>
            </div>
          </div>

          {activeTab === 'preview' ? (
            /* Live Handwritten Clipboard Preview */
            <div className="space-y-4">
              <div className="relative mx-auto w-full max-w-[340px] aspect-[9/16] select-none filter drop-shadow-xl">
                <img
                  src="/assets/letters/paper-clipboard.png"
                  alt="Paper Clipboard"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <div className="relative z-10 w-full h-full flex flex-col pt-[36%] pb-[26%] px-[18%] text-[#1B4332]">
                  <div className="flex items-center justify-between text-[10px] font-sans font-semibold border-b border-[#839958]/30 pb-1 mb-2 text-[#2E7D32]">
                    <span className="truncate">From: <strong>{userName || 'A caring friend'}</strong></span>
                    <span className="text-[9px] text-slate-600">{new Date().toLocaleDateString()}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                    <p
                      className="font-handwritten text-base text-[#0A3323] leading-relaxed whitespace-pre-line"
                      style={{ fontFamily: 'var(--font-handwritten), Caveat, cursive' }}
                    >
                      {letterText || 'Your handwritten words will appear here on this clipboard...'}
                    </p>

                    {mediaUrl && (
                      <div className="rounded-lg overflow-hidden border border-[#839958]/40 shadow-xs mt-2">
                        {mediaType === 'video' ? (
                          <video src={mediaUrl} controls className="w-full max-h-28 object-cover" />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt="Attachment"
                            className="w-full max-h-28 object-cover"
                            style={{ transform: `scale(${zoomLevel})` }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-dark-forest hover:bg-amber-100 cursor-pointer"
                >
                  &larr; Back to Editing
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary-green hover:bg-dark-forest text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send size={14} />
                  {isSubmitting ? 'Posting...' : 'Post Handwritten Letter'}
                </button>
              </div>
            </div>
          ) : (
            /* Editing Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-dark-forest uppercase tracking-wider block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sonaa Dobriyal"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-white/90 border border-[#CD9777]/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-green"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-dark-forest uppercase tracking-wider block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-white/90 border border-[#CD9777]/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-green"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-dark-forest uppercase tracking-wider block mb-1">Letter Content *</label>
                <textarea
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  rows={4}
                  required
                  placeholder="Dear GreenBridge team & community..."
                  className="w-full bg-white/90 border border-[#CD9777]/30 rounded-2xl p-4 text-xs font-serif text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-green resize-none shadow-inner"
                />
              </div>

              {/* Native Device File Picker (No URL typing) */}
              <div>
                <label className="text-xs font-bold text-dark-forest uppercase tracking-wider block mb-1">
                  Attach Photo or Video Clip from Device (Optional):
                </label>
                {!mediaUrl ? (
                  <div className="relative border-2 border-dashed border-[#CD9777]/40 hover:border-primary-green rounded-2xl p-4 bg-white/70 text-center transition-colors">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="letter-file-picker"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-soft-mint text-primary-green flex items-center justify-center">
                        <Upload size={16} />
                      </div>
                      <span className="text-xs font-bold text-dark-forest">
                        Choose photo or video clip from device gallery
                      </span>
                      <span className="text-[10px] text-slate-text/60">
                        PNG, JPG, MP4, MOV up to 30MB
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 p-3 bg-white/80 rounded-2xl border border-[#CD9777]/30">
                    <div className="flex items-center justify-between text-xs font-bold text-dark-forest">
                      <span className="flex items-center gap-1">
                        📎 Attached {mediaType === 'video' ? 'Video Clip' : 'Photo'}
                      </span>
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="text-red-600 hover:text-red-800 text-[11px] font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="h-32 rounded-xl overflow-hidden relative border border-slate-200 bg-black/5 flex items-center justify-center">
                      {mediaType === 'video' ? (
                        <video src={mediaUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt="Letter attachment"
                          className="w-full h-full object-cover transition-transform duration-200"
                          style={{ transform: `scale(${zoomLevel})` }}
                        />
                      )}
                    </div>

                    {mediaType === 'image' && (
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-slate-500">Zoom:</span>
                        <input
                          type="range"
                          min="1"
                          max="2"
                          step="0.1"
                          value={zoomLevel}
                          onChange={(e) => setZoomLevel(Number(e.target.value))}
                          className="flex-1 accent-primary-green cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 font-mono">{Math.round(zoomLevel * 100)}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-dark-forest text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye size={14} />
                  Preview on Clipboard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-green hover:bg-dark-forest text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-primary-green/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send size={14} />
                  {isSubmitting ? 'Posting...' : 'Send Letter'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

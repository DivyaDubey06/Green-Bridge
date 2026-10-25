import React, { useState, useEffect } from 'react';
import { ApplicationFormData, User } from '../../types';

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ApplicationFormData) => void;
  currentUser: User | null;
  type: 'opportunity' | 'event';
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  type
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    age: '',
    phone: '',
    whatsapp: '',
    location: '',
    skills: '',
    whyVolunteer: '',
    availability: ''
  });

  // Pre-fill user data
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.name || '',
        location: currentUser.city && currentUser.state ? `${currentUser.city}, ${currentUser.state}` : '',
        skills: currentUser.interests?.join(', ') || '',
        availability: currentUser.availability || ''
      }));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-4 border-b border-[#CD9777]/10 flex justify-between items-center bg-warm-cream/30">
          <div>
            <h3 className="font-serif text-2xl font-bold text-dark-forest leading-none">
              {type === 'opportunity' ? 'Volunteer Application' : 'Event Registration'}
            </h3>
            <p className="text-xs text-slate-text/60 mt-2">
              Please provide your details so the organization can review your profile.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-[#CD9777]/20 text-slate-text hover:text-primary-green hover:border-primary-green flex items-center justify-center font-bold transition-all shadow-sm"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Section 1: Personal Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-dark-forest uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-soft-mint text-primary-green flex items-center justify-center text-[10px]">1</span>
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/30 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Age *</label>
                <input
                  type="number"
                  required
                  min="13"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/30 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/30 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/30 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#CD9777]/10" />

          {/* Section 2: About */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-dark-forest uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-soft-mint text-primary-green flex items-center justify-center text-[10px]">2</span>
              About You
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Area / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dalanwala, Dehradun"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/30 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none focus:bg-white transition-colors"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Skills / Expertise *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Teaching, Photography, Event Management"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/30 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Why would you like to volunteer? *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.whyVolunteer}
                  onChange={(e) => setFormData({ ...formData, whyVolunteer: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/30 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none focus:bg-white transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#CD9777]/10" />

          {/* Section 3: Additional */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-dark-forest uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-soft-mint text-primary-green flex items-center justify-center text-[10px]">3</span>
              Availability
            </h4>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-text/75 block">Availability / Relevant Details (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Available only on weekends"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-2.5 bg-warm-cream/30 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 mt-6 border-t border-[#CD9777]/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border border-[#CD9777]/30 text-sm font-bold rounded-2xl text-slate-text hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-primary-green hover:bg-dark-forest text-white text-sm font-bold rounded-2xl transition-all cursor-pointer shadow-md"
            >
              Submit Application
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

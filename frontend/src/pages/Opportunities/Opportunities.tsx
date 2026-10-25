import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight, CheckCircle2, Plus, Phone, AlertCircle, FileText, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ApplicationFormModal } from '../../components/common/ApplicationFormModal';
import { ApplicationFormData } from '../../types';
import { Background3DScene } from '../../components/common/Background3DScene';
import { Surface } from '../../components/common/Surface';
import toast from 'react-hot-toast';

export const Opportunities: React.FC = () => {
  const navigate = useNavigate();
  const { opportunities, isAuthenticated, applyForOpportunity, currentUser, currentOrg, createOpportunity } = useAuthStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');

  // Modals state
  const [showOppModal, setShowOppModal] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [showAppForm, setShowAppForm] = useState(false);

  // Creation Form state
  const [oppForm, setOppForm] = useState({
    title: '',
    description: '',
    category: 'Environment',
    location: '',
    date: '',
    time: '',
    duration: '',
    skillsRequired: '',
    volunteerLimit: 15,
    contactInfo: '',
    deadline: '',
    coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=60'
  });

  const isVerifiedNGO = currentOrg?.verificationStatus === 'APPROVED';

  const handleApply = async (formData: ApplicationFormData) => {
    if (!isAuthenticated) {
      toast('Please sign in to apply for campaigns!', { icon: '🔑' });
      navigate('/login');
      return;
    }
    if (!selectedOpp) return;
    try {
      await applyForOpportunity(selectedOpp.id, 'Applied via structural form.', formData);
      toast.success('Application submitted successfully! 🌱');
      setShowAppForm(false);
      setSelectedOpp(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application.');
    }
  };

  const handleCreateOppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppForm.title || !oppForm.description || !oppForm.location || !oppForm.date || !oppForm.time || !oppForm.duration || !oppForm.contactInfo || !oppForm.deadline) {
      toast.error('Please fill in all campaign fields.');
      return;
    }
    const skillsArray = oppForm.skillsRequired.split(',').map(s => s.trim()).filter(s => s.length > 0);
    try {
      await createOpportunity({
        title: oppForm.title,
        description: oppForm.description,
        category: oppForm.category,
        location: oppForm.location,
        date: oppForm.date,
        time: oppForm.time,
        duration: oppForm.duration,
        skillsRequired: skillsArray,
        volunteerLimit: Number(oppForm.volunteerLimit),
        coverImage: oppForm.coverImage,
        contactInfo: oppForm.contactInfo,
        deadline: oppForm.deadline
      } as any);
      setShowOppModal(false);
      // Reset Form
      setOppForm({
        title: '',
        description: '',
        category: 'Environment',
        location: '',
        date: '',
        time: '',
        duration: '',
        skillsRequired: '',
        volunteerLimit: 15,
        contactInfo: '',
        deadline: '',
        coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=60'
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create campaign.');
    }
  };

  // Filter listings
  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase()) || 
                          opp.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || opp.category === category;
    const matchesLocation = location === 'All' || opp.location.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
      
      {/* Header with 3D Opportunities Scene */}
      <Surface tone="deep" className="p-10 md:p-14 rounded-[40px] shadow-xl text-center space-y-4 relative overflow-hidden">
        <Background3DScene tab="opportunities" className="w-full">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D3968C] bg-white/10 px-4 py-1.5 rounded-full border border-white/20 inline-block mb-3">
            🌱 Volunteer Campaigns & Drives
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1C8F6A] leading-tight">Volunteer Opportunities</h2>
          <p className="text-sm text-[#1C8F6A]/80 max-w-lg mx-auto mt-2">Discover local drives in your area, join hands with verified organizations, and earn impact certificates.</p>
        </Background3DScene>
      </Surface>


      {/* Filter panel */}
      <div className="bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search campaign name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-warm-cream/45 border border-[#CD9777]/25 focus:border-primary-green focus:bg-white focus:outline-none rounded-2xl text-sm"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
        </div>

        {/* Category & Location selectors */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Environment">🌲 Environment</option>
            <option value="Education">📚 Education</option>
            <option value="Healthcare">🩸 Healthcare</option>
            <option value="Animals">🐶 Animals</option>
            <option value="Community">🤝 Community</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
          >
            <option value="All">All Locations</option>
            <option value="Karanpur">Karanpur</option>
            <option value="Mussoorie">Mussoorie</option>
            <option value="Rajpur">Rajpur Road</option>
          </select>
        </div>
      </div>

      {/* Opportunities Cards Grid */}
      {filteredOpps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOpps.map((opp) => (
            <div 
              key={opp.id} 
              className="watercolor-card flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={opp.coverImage} 
                  alt={opp.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[10px] font-bold text-primary-green uppercase tracking-widest border border-primary-green/15">
                  {opp.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                  {opp.organizationLogo && (
                    <img 
                      src={opp.organizationLogo} 
                      alt={opp.organizationName} 
                      className="w-7 h-7 rounded-full object-cover border border-[#CD9777]/20"
                    />
                  )}
                  <span className="text-xs font-bold text-slate-text/75">{opp.organizationName}</span>
                  <span className="inline-flex items-center gap-0.5 bg-green-50 text-green-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-green-200">
                    <CheckCircle2 size={8} /> Verified
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-dark-forest mb-2 leading-snug group-hover:text-primary-green transition-colors">
                  {opp.title}
                </h4>
                <p className="text-xs text-slate-text/60 line-clamp-3 mb-6 leading-relaxed">
                  {opp.description}
                </p>

                <div className="mt-auto pt-4 border-t border-[#CD9777]/10 flex flex-col gap-3 text-xs text-slate-text/65">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary-green" />
                    <span>{opp.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary-green" />
                      <span>{opp.date} • {opp.time}</span>
                    </div>
                    <span className="font-bold text-primary-green bg-green-50 px-2 py-0.5 rounded-full">
                      {opp.applicantsCount} Applied
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOpp(opp);
                    }}
                    className="w-full mt-2 bg-primary-green hover:bg-dark-forest text-white py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    View Details & Apply
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[#CD9777]/10 rounded-[40px] space-y-4 max-w-md mx-auto">
          <span className="text-4xl block">🔍</span>
          <h4 className="font-serif text-xl font-bold text-dark-forest">No Campaigns Found</h4>
          <p className="text-xs text-slate-text/60 leading-relaxed max-w-xs mx-auto">
            Looks like there aren't any opportunities matching your filters yet. Check back soon or explore another category.
          </p>
        </div>
      )}

      {/* Floating Create Button */}
      {isVerifiedNGO && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setShowOppModal(true)}
            className="w-14 h-14 bg-primary-green hover:bg-dark-forest text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            title="Create Volunteer Opportunity"
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      {/* CREATE OPPORTUNITY MODAL */}
      {showOppModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setShowOppModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream text-slate-text hover:text-primary-green flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
            <div className="mb-4">
              <h3 className="font-serif text-xl font-bold text-dark-forest leading-none">Create Volunteer Opportunity</h3>
              <p className="text-[10px] text-slate-text/60 mt-1">Publish a new volunteering event for citizens to join.</p>
            </div>
            
            <form onSubmit={handleCreateOppSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Forest Sprout Plantation Drive"
                  value={oppForm.title}
                  onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed instructions for volunteers, materials needed, and meeting location details."
                  value={oppForm.description}
                  onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Category</label>
                  <select
                    value={oppForm.category}
                    onChange={(e) => setOppForm({ ...oppForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  >
                    <option value="Environment">🌲 Environment</option>
                    <option value="Education">📚 Education</option>
                    <option value="Healthcare">🩸 Healthcare</option>
                    <option value="Animals">🐶 Animals</option>
                    <option value="Community">🤝 Community</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajpur Road, Dehradun"
                    value={oppForm.location}
                    onChange={(e) => setOppForm({ ...oppForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Date</label>
                  <input
                    type="date"
                    required
                    value={oppForm.date}
                    onChange={(e) => setOppForm({ ...oppForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM"
                    value={oppForm.time}
                    onChange={(e) => setOppForm({ ...oppForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 Hours"
                    value={oppForm.duration}
                    onChange={(e) => setOppForm({ ...oppForm, duration: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Skills Required</label>
                  <input
                    type="text"
                    placeholder="e.g. Gardening, Physical Work"
                    value={oppForm.skillsRequired}
                    onChange={(e) => setOppForm({ ...oppForm, skillsRequired: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Volunteer Limit</label>
                  <input
                    type="number"
                    required
                    value={oppForm.volunteerLimit}
                    onChange={(e) => setOppForm({ ...oppForm, volunteerLimit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Contact Information</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. info@greenbridge.org"
                    value={oppForm.contactInfo}
                    onChange={(e) => setOppForm({ ...oppForm, contactInfo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={oppForm.deadline}
                    onChange={(e) => setOppForm({ ...oppForm, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Optional Cover Image URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={oppForm.coverImage}
                  onChange={(e) => setOppForm({ ...oppForm, coverImage: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#CD9777]/10">
                <button
                  type="button"
                  onClick={() => setShowOppModal(false)}
                  className="flex-1 py-3 border border-[#CD9777]/30 text-xs font-bold rounded-2xl text-slate-text hover:bg-red-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS & APPLY MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => {
                setSelectedOpp(null);
                setShowAppForm(false);
              }}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream text-slate-text hover:text-primary-green flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-extrabold bg-soft-mint text-primary-green px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedOpp.category}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              <img 
                src={selectedOpp.coverImage} 
                alt={selectedOpp.title} 
                className="w-full h-44 object-cover rounded-2xl border border-[#CD9777]/10"
              />
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-dark-forest leading-tight">{selectedOpp.title}</h3>
                <span className="text-xs text-slate-text/50 block mt-1">Organized by: <strong>{selectedOpp.organizationName}</strong></span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-dark-forest uppercase tracking-wider">About the Campaign</h4>
                <p className="text-xs text-slate-text/70 leading-relaxed bg-warm-cream/20 p-4 border border-[#CD9777]/10 rounded-2xl">
                  {selectedOpp.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary-green flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 block leading-none">Location</span>
                      <span className="font-semibold text-dark-forest">{selectedOpp.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary-green flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 block leading-none">Date & Time</span>
                      <span className="font-semibold text-dark-forest">{selectedOpp.date} • {selectedOpp.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary-green flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 block leading-none">Duration</span>
                      <span className="font-semibold text-dark-forest">{selectedOpp.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-primary-green flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 block leading-none">Limit & Applicants</span>
                      <span className="font-semibold text-dark-forest">{selectedOpp.applicantsCount} / {selectedOpp.volunteerLimit} Volunteers</span>
                    </div>
                  </div>
                  {selectedOpp.contactInfo && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-primary-green flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-text/45 block leading-none">Contact Info</span>
                        <span className="font-semibold text-dark-forest">{selectedOpp.contactInfo}</span>
                      </div>
                    </div>
                  )}
                  {selectedOpp.deadline && (
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-primary-green flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-text/45 block leading-none">Apply Deadline</span>
                        <span className="font-semibold text-dark-forest">{selectedOpp.deadline}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedOpp.skillsRequired && selectedOpp.skillsRequired.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-dark-forest uppercase tracking-wider">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpp.skillsRequired.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-warm-cream/60 border border-[#CD9777]/25 text-slate-text text-[10px] px-2.5 py-1 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 mt-4 border-t border-[#CD9777]/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOpp(null);
                  }}
                  className="flex-1 py-3.5 border border-[#CD9777]/30 text-xs font-bold rounded-2xl text-slate-text hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Close details
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast('Please sign in to apply for campaigns!', { icon: '🔑' });
                      navigate('/login');
                      return;
                    }
                    setShowAppForm(true);
                  }}
                  className="flex-1 py-3.5 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION FORM MODAL */}
      <ApplicationFormModal
        isOpen={showAppForm}
        onClose={() => setShowAppForm(false)}
        onSubmit={handleApply}
        currentUser={currentUser}
        type="opportunity"
      />
    </div>
  );
};
export default Opportunities;

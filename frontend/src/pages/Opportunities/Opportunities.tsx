import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight, CheckCircle2, Plus, Phone, AlertCircle, FileText, ClipboardList, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ApplicationFormModal } from '../../components/common/ApplicationFormModal';
import { ApplicationFormData } from '../../types';
import { Background3DScene } from '../../components/common/Background3DScene';
import { Surface } from '../../components/common/Surface';
import toast from 'react-hot-toast';

export const Opportunities: React.FC = () => {
  const navigate = useNavigate();
  const { 
    opportunities, 
    isAuthenticated, 
    applyForOpportunity, 
    currentUser, 
    currentOrg, 
    createOpportunity,
    recommendations,
    fetchRecommendations
  } = useAuthStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'match' | 'urgent'>('default');

  // Modals state
  const [showOppModal, setShowOppModal] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [showAppForm, setShowAppForm] = useState(false);

  // Fetch AI Recommendations on mount
  useEffect(() => {
    if (currentUser) {
      fetchRecommendations();
    }
  }, [currentUser, fetchRecommendations]);

  // Fast recommendation lookup map
  const recMap = useMemo(() => {
    const map = new Map<string, typeof recommendations[0]>();
    recommendations.forEach(r => {
      map.set(r.opportunity.id, r);
    });
    return map;
  }, [recommendations]);

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

  // Filter & sort listings
  const filteredOpps = useMemo(() => {
    let result = opportunities.filter((opp) => {
      const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase()) || 
                            opp.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || opp.category === category;
      const matchesLocation = location === 'All' || opp.location.toLowerCase().includes(location.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });

    if (sortBy === 'match') {
      result.sort((a, b) => {
        const scoreA = recMap.get(a.id)?.matchScore ?? 0;
        const scoreB = recMap.get(b.id)?.matchScore ?? 0;
        return scoreB - scoreA;
      });
    } else if (sortBy === 'urgent') {
      result.sort((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        return dateA - dateB;
      });
    }

    return result;
  }, [opportunities, search, category, location, sortBy, recMap]);

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
      <div className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search campaign name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-warm-cream/45 dark:bg-[#121713] border border-[#CD9777]/25 dark:border-white/10 focus:border-primary-green focus:bg-white dark:focus:bg-[#121713] focus:outline-none rounded-2xl text-sm text-dark-forest dark:text-[#F7F4D5]"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-text/40 dark:text-[#F7F4D5]/40" />
        </div>

        {/* Category, Location & Sort selectors */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 bg-warm-cream/35 dark:bg-[#121713] border border-[#CD9777]/20 dark:border-white/10 rounded-xl text-xs focus:border-primary-green focus:outline-none text-dark-forest dark:text-[#F7F4D5]"
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
            className="px-4 py-2.5 bg-warm-cream/35 dark:bg-[#121713] border border-[#CD9777]/20 dark:border-white/10 rounded-xl text-xs focus:border-primary-green focus:outline-none text-dark-forest dark:text-[#F7F4D5]"
          >
            <option value="All">All Locations</option>
            <option value="Karanpur">Karanpur</option>
            <option value="Mussoorie">Mussoorie</option>
            <option value="Rajpur">Rajpur Road</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2.5 bg-warm-cream/35 dark:bg-[#121713] border border-primary-green/30 dark:border-primary-green/40 rounded-xl text-xs font-semibold focus:border-primary-green focus:outline-none text-dark-forest dark:text-[#F7F4D5]"
          >
            <option value="default">Sort: Default</option>
            <option value="match">✨ Sort: AI Match (Deterministic)</option>
            <option value="urgent">⏰ Sort: Upcoming Soon</option>
          </select>
        </div>
      </div>

      {/* Opportunities Cards Grid */}
      {filteredOpps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOpps.map((opp) => {
            const rec = recMap.get(opp.id);
            return (
              <div 
                key={opp.id} 
                className="watercolor-card dark:bg-[#1A211C] dark:border-white/10 flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={opp.coverImage} 
                    alt={opp.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 bg-white/90 dark:bg-[#1A211C]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[10px] font-bold text-primary-green dark:text-green-300 uppercase tracking-widest border border-primary-green/15 dark:border-white/10">
                    {opp.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {opp.organizationLogo && (
                      <img 
                        src={opp.organizationLogo} 
                        alt={opp.organizationName} 
                        className="w-7 h-7 rounded-full object-cover border border-[#CD9777]/20 dark:border-white/10"
                      />
                    )}
                    <span className="text-xs font-bold text-slate-text/75 dark:text-[#F7F4D5]/70">{opp.organizationName}</span>
                    <span className="inline-flex items-center gap-0.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                      <CheckCircle2 size={8} /> Verified
                    </span>
                  </div>

                  {/* AI Recommendation Match Pill if available */}
                  {rec && (
                    <div className="flex items-center justify-between bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl mb-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={13} className="text-emerald-700 dark:text-emerald-400" />
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">{rec.matchScore}% AI Match</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300/80 font-medium truncate max-w-[140px]" title={rec.reasons[0]}>
                        {rec.reasons[0]}
                      </span>
                    </div>
                  )}

                  <h4 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] mb-2 leading-snug group-hover:text-primary-green transition-colors">
                    {opp.title}
                  </h4>
                  <p className="text-xs text-slate-text/60 dark:text-[#F7F4D5]/60 line-clamp-3 mb-6 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#CD9777]/10 dark:border-white/10 flex flex-col gap-3 text-xs text-slate-text/65 dark:text-[#F7F4D5]/70">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary-green dark:text-green-400" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary-green dark:text-green-400" />
                        <span>{opp.date} • {opp.time}</span>
                      </div>
                      <span className="font-bold text-primary-green dark:text-green-300 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
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
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#1A211C] border border-[#CD9777]/10 dark:border-white/10 rounded-[40px] space-y-4 max-w-md mx-auto">
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
          <div className="w-full max-w-xl bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => {
                setSelectedOpp(null);
                setShowAppForm(false);
              }}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream dark:bg-white/10 text-slate-text dark:text-[#F7F4D5] hover:text-primary-green flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-extrabold bg-soft-mint dark:bg-green-950/60 text-primary-green dark:text-green-300 px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedOpp.category}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              <img 
                src={selectedOpp.coverImage} 
                alt={selectedOpp.title} 
                className="w-full h-44 object-cover rounded-2xl border border-[#CD9777]/10 dark:border-white/10"
              />
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-dark-forest dark:text-[#F7F4D5] leading-tight">{selectedOpp.title}</h3>
                <span className="text-xs text-slate-text/50 dark:text-[#F7F4D5]/60 block mt-1">Organized by: <strong>{selectedOpp.organizationName}</strong></span>
              </div>

              {/* Explainable AI Recommendation Breakdown Card */}
              {recMap.get(selectedOpp.id) && (() => {
                const rec = recMap.get(selectedOpp.id)!;
                return (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={16} className="text-emerald-700 dark:text-emerald-400" />
                        <span className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200">
                          AI Match Score: {rec.matchScore}%
                        </span>
                      </div>
                      <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        Deterministic 4-Criteria Engine
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                      <div className="bg-white/80 dark:bg-[#1A211C] p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                        <span className="block text-slate-text/50 dark:text-[#F7F4D5]/60 font-medium">Skills (35%)</span>
                        <span className="font-black text-emerald-800 dark:text-emerald-300">{Math.round((rec.scoreBreakdown.skillsScore / 0.35) * 100)}%</span>
                      </div>
                      <div className="bg-white/80 dark:bg-[#1A211C] p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                        <span className="block text-slate-text/50 dark:text-[#F7F4D5]/60 font-medium">Interests (30%)</span>
                        <span className="font-black text-emerald-800 dark:text-emerald-300">{Math.round((rec.scoreBreakdown.interestsScore / 0.30) * 100)}%</span>
                      </div>
                      <div className="bg-white/80 dark:bg-[#1A211C] p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                        <span className="block text-slate-text/50 dark:text-[#F7F4D5]/60 font-medium">Availability (20%)</span>
                        <span className="font-black text-emerald-800 dark:text-emerald-300">{Math.round((rec.scoreBreakdown.availabilityScore / 0.20) * 100)}%</span>
                      </div>
                      <div className="bg-white/80 dark:bg-[#1A211C] p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                        <span className="block text-slate-text/50 dark:text-[#F7F4D5]/60 font-medium">Location (15%)</span>
                        <span className="font-black text-emerald-800 dark:text-emerald-300">{Math.round((rec.scoreBreakdown.locationScore / 0.15) * 100)}%</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">Why this matches you:</span>
                      <ul className="text-xs text-emerald-800 dark:text-emerald-300/90 list-disc list-inside space-y-0.5">
                        {rec.reasons.map((reason, rIdx) => (
                          <li key={rIdx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-dark-forest dark:text-[#F7F4D5] uppercase tracking-wider">About the Campaign</h4>
                <p className="text-xs text-slate-text/70 dark:text-[#F7F4D5]/75 leading-relaxed bg-warm-cream/20 dark:bg-[#121713] p-4 border border-[#CD9777]/10 dark:border-white/10 rounded-2xl">
                  {selectedOpp.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary-green dark:text-green-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 dark:text-[#F7F4D5]/50 block leading-none">Location</span>
                      <span className="font-semibold text-dark-forest dark:text-[#F7F4D5]">{selectedOpp.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary-green dark:text-green-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 dark:text-[#F7F4D5]/50 block leading-none">Date & Time</span>
                      <span className="font-semibold text-dark-forest dark:text-[#F7F4D5]">{selectedOpp.date} • {selectedOpp.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary-green dark:text-green-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 dark:text-[#F7F4D5]/50 block leading-none">Duration</span>
                      <span className="font-semibold text-dark-forest dark:text-[#F7F4D5]">{selectedOpp.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-primary-green dark:text-green-400 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 dark:text-[#F7F4D5]/50 block leading-none">Limit & Applicants</span>
                      <span className="font-semibold text-dark-forest dark:text-[#F7F4D5]">{selectedOpp.applicantsCount} / {selectedOpp.volunteerLimit} Volunteers</span>
                    </div>
                  </div>
                  {selectedOpp.contactInfo && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-primary-green dark:text-green-400 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-text/45 dark:text-[#F7F4D5]/50 block leading-none">Contact Info</span>
                        <span className="font-semibold text-dark-forest dark:text-[#F7F4D5]">{selectedOpp.contactInfo}</span>
                      </div>
                    </div>
                  )}
                  {selectedOpp.deadline && (
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-primary-green dark:text-green-400 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-text/45 dark:text-[#F7F4D5]/50 block leading-none">Apply Deadline</span>
                        <span className="font-semibold text-dark-forest dark:text-[#F7F4D5]">{selectedOpp.deadline}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedOpp.skillsRequired && selectedOpp.skillsRequired.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-dark-forest dark:text-[#F7F4D5] uppercase tracking-wider">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedOpp.skillsRequired.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-warm-cream/60 dark:bg-[#121713] border border-[#CD9777]/25 dark:border-white/10 text-slate-text dark:text-[#F7F4D5] text-[10px] px-2.5 py-1 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 mt-4 border-t border-[#CD9777]/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOpp(null);
                  }}
                  className="flex-1 py-3.5 border border-[#CD9777]/30 dark:border-white/20 text-xs font-bold rounded-2xl text-slate-text dark:text-[#F7F4D5] hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
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

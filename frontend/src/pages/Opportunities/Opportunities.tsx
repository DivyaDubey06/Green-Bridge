import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const Opportunities: React.FC = () => {
  const navigate = useNavigate();
  const { opportunities, isAuthenticated, applyForOpportunity } = useAuthStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');

  const handleApply = async (oppId: string) => {
    if (!isAuthenticated) {
      toast('Please sign in to apply for campaigns!', { icon: '🔑' });
      navigate('/login');
      return;
    }
    try {
      await applyForOpportunity(oppId, 'Applying via active listing explorer.');
      toast.success('Application submitted successfully! 🌱');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application.');
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
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary-green bg-soft-mint px-3.5 py-1.5 rounded-full">Explore</span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-dark-forest">Volunteer Campaigns</h2>
        <p className="text-sm text-slate-text/60 max-w-lg mx-auto">Discover local drives in your area, join hands with verified organizations, and earn impact certificates.</p>
      </div>

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
                    onClick={() => handleApply(opp.id)}
                    className="w-full mt-2 bg-primary-green hover:bg-dark-forest text-white py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Apply for Campaign
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
    </div>
  );
};
export default Opportunities;

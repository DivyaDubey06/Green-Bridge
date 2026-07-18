import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const Events: React.FC = () => {
  const navigate = useNavigate();
  const { events, currentUser, isAuthenticated, registerForEvent } = useAuthStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const handleRegister = async (eventId: string) => {
    if (!isAuthenticated) {
      toast('Please sign in to register for events!', { icon: '🔑' });
      navigate('/login');
      return;
    }
    try {
      await registerForEvent(eventId);
      toast.success('Successfully registered for event! 📅');
    } catch (err: any) {
      toast.error(err.message || 'Failed to register.');
    }
  };

  // Filter listings
  const filteredEvents = events.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(search.toLowerCase()) || 
                          evt.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || evt.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary-green bg-soft-mint px-3.5 py-1.5 rounded-full">Community Hub</span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-dark-forest">Upcoming Local Events</h2>
        <p className="text-sm text-slate-text/60 max-w-lg mx-auto">Join webinars, local cleanup drives, and donor camps to meet other volunteers in Uttarakhand.</p>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search event name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-warm-cream/45 border border-[#CD9777]/25 focus:border-primary-green focus:bg-white focus:outline-none rounded-2xl text-sm"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
        </div>

        {/* Category selector */}
        <div className="w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Environment">🌲 Environment</option>
            <option value="Healthcare">🩸 Healthcare</option>
            <option value="Education">📚 Education</option>
            <option value="Community">🤝 Community</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => {
            const isRegistered = !!currentUser && evt.registeredUsers.includes(currentUser.id);
            return (
              <div 
                key={evt.id} 
                className="watercolor-card flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={evt.banner} 
                    alt={evt.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 bg-soft-sky/95 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-blue-900 uppercase tracking-widest border border-blue-200">
                    {evt.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-primary-green uppercase tracking-wider block mb-2">
                    Organizer: {evt.organizationName}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-dark-forest mb-2 leading-snug group-hover:text-primary-green transition-colors">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-text/60 line-clamp-3 mb-6 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#CD9777]/10 flex flex-col gap-3 text-xs text-slate-text/65">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary-green" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary-green" />
                        <span>{evt.date} • {evt.time}</span>
                      </div>
                      <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
                        <UserCheck size={10} />
                        {evt.registeredUsers.length} Going
                      </span>
                    </div>

                    <button
                      onClick={() => handleRegister(evt.id)}
                      disabled={isRegistered}
                      className={`w-full mt-2 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                        isRegistered
                          ? 'bg-blue-100 text-blue-800 border border-blue-200 cursor-default'
                          : 'bg-primary-green hover:bg-dark-forest text-white'
                      }`}
                    >
                      {isRegistered ? 'Successfully Registered! 📅' : 'Register for Event'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[#CD9777]/10 rounded-[40px] space-y-4 max-w-md mx-auto">
          <span className="text-4xl block">📅</span>
          <h4 className="font-serif text-xl font-bold text-dark-forest">No Events Found</h4>
          <p className="text-xs text-slate-text/60 leading-relaxed max-w-xs mx-auto">
            Looks like there aren't any community events scheduled matching your filters yet.
          </p>
        </div>
      )}
    </div>
  );
};
export default Events;

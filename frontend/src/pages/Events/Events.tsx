import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight, UserCheck, Plus, Phone, AlertCircle, Link2, HelpCircle, Camera } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ApplicationFormModal } from '../../components/common/ApplicationFormModal';
import { PhotoboothGallery } from '../../components/events/PhotoboothGallery';
import { EventExperienceModal } from '../../components/events/EventExperienceModal';
import { ApplicationFormData } from '../../types';
import { Background3DScene } from '../../components/common/Background3DScene';
import { Surface } from '../../components/common/Surface';
import toast from 'react-hot-toast';

export const Events: React.FC = () => {
  const navigate = useNavigate();
  const { events, experiences, currentUser, currentOrg, isAuthenticated, registerForEvent, unregisterFromEvent, createEvent } = useAuthStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modals state
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showAppForm, setShowAppForm] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);


  // Creation Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    capacity: 50,
    category: 'Environment',
    banner: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=60',
    registrationLink: '',
    contactInfo: ''
  });

  const isVerifiedNGO = currentOrg?.verificationStatus === 'APPROVED';

  const handleRegister = async (formData: ApplicationFormData) => {
    if (!isAuthenticated) {
      toast('Please sign in to register for events!', { icon: '🔑' });
      navigate('/login');
      return;
    }
    if (!selectedEvent) return;
    try {
      await registerForEvent(selectedEvent.id, formData);
      toast.success('Successfully registered for event! 📅');
      setShowAppForm(false);
      // Refresh selected event preview if open
      const updated = events.find(e => e.id === selectedEvent.id);
      if (updated) {
        setSelectedEvent(updated);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to register.');
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!isAuthenticated) return;
    try {
      await unregisterFromEvent(eventId);
      toast.success('Successfully unregistered from event! 📅');
      const updated = events.find(e => e.id === eventId);
      if (updated) {
        setSelectedEvent(updated);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to unregister.');
    }
  };

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.description || !eventForm.location || !eventForm.date || !eventForm.time || !eventForm.contactInfo) {
      toast.error('Please fill in all event details.');
      return;
    }
    try {
      await createEvent({
        title: eventForm.title,
        description: eventForm.description,
        location: eventForm.location,
        date: eventForm.date,
        time: eventForm.time,
        capacity: Number(eventForm.capacity),
        category: eventForm.category,
        banner: eventForm.banner,
        registrationLink: eventForm.registrationLink,
        contactInfo: eventForm.contactInfo
      } as any);
      setShowEventModal(false);
      // Reset Form
      setEventForm({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        capacity: 50,
        category: 'Environment',
        banner: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=60',
        registrationLink: '',
        contactInfo: ''
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to schedule event.');
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
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
      
      {/* Header with 3D Events Scene */}
      <Surface tone="midnight" className="p-10 md:p-14 rounded-[40px] shadow-xl text-center space-y-4 relative overflow-hidden">
        <Background3DScene tab="events" className="w-full">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D3968C] bg-white/10 px-4 py-1.5 rounded-full border border-white/20 inline-block mb-3">
            🎉 Community Events & Drives
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1BC0BA]">Upcoming Local Events</h2>
          <p className="text-sm text-[#1BC0BA]/80 max-w-lg mx-auto mt-2">Join webinars, local cleanup drives, and donor camps to meet other volunteers in Uttarakhand.</p>
        </Background3DScene>
      </Surface>

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
                      onClick={() => setSelectedEvent(evt)}
                      className="w-full mt-2 bg-primary-green hover:bg-dark-forest text-white py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      View Details & Register
                      <ArrowRight size={14} />
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

      {/* Photobooth & Event Gallery Section */}
      <PhotoboothGallery 
        experiences={experiences} 
        onOpenUpload={() => setShowJournalModal(true)} 
      />

      {/* Floating Create Button */}
      {isVerifiedNGO && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setShowEventModal(true)}
            className="w-14 h-14 bg-primary-green hover:bg-dark-forest text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            title="Publish Community Event"
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setShowEventModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream text-slate-text hover:text-primary-green flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
            <div className="mb-4">
              <h3 className="font-serif text-xl font-bold text-dark-forest leading-none">Schedule Community Event</h3>
              <p className="text-[10px] text-slate-text/60 mt-1">Create an upcoming community webinar, camp, or cleanup drive.</p>
            </div>
            
            <form onSubmit={handleCreateEventSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blood Donation Camp Dehradun"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed schedule and what attendees should expect."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  >
                    <option value="Environment">🌲 Environment</option>
                    <option value="Healthcare">🩸 Healthcare</option>
                    <option value="Education">📚 Education</option>
                    <option value="Community">🤝 Community</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Venue (Location)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gandhi Park, Dehradun"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
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
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Capacity Limit</label>
                  <input
                    type="number"
                    required
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-xs focus:border-primary-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Contact Information</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. contact@hopefoundation.org"
                    value={eventForm.contactInfo}
                    onChange={(e) => setEventForm({ ...eventForm, contactInfo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-text/75 block">Optional Registration Link</label>
                  <input
                    type="text"
                    placeholder="e.g. https://forms.gle/..."
                    value={eventForm.registrationLink}
                    onChange={(e) => setEventForm({ ...eventForm, registrationLink: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Optional Banner Image URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={eventForm.banner}
                  onChange={(e) => setEventForm({ ...eventForm, banner: e.target.value })}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#CD9777]/10">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-3 border border-[#CD9777]/30 text-xs font-bold rounded-2xl text-slate-text hover:bg-red-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW EVENT DETAILS MODAL */}
      {selectedEvent && (() => {
        const isRegistered = !!currentUser && selectedEvent.registeredUsers.includes(currentUser.id);
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream text-slate-text hover:text-primary-green flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-extrabold bg-soft-sky text-blue-900 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedEvent.category}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                <img 
                  src={selectedEvent.banner} 
                  alt={selectedEvent.title} 
                  className="w-full h-44 object-cover rounded-2xl border border-[#CD9777]/10"
                />
                
                <div>
                  <h3 className="font-serif text-2xl font-bold text-dark-forest leading-tight">{selectedEvent.title}</h3>
                  <span className="text-xs text-slate-text/50 block mt-1">Organized by: <strong>{selectedEvent.organizationName}</strong></span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-dark-forest uppercase tracking-wider">About the Event</h4>
                  <p className="text-xs text-slate-text/70 leading-relaxed bg-warm-cream/20 p-4 border border-[#CD9777]/10 rounded-2xl">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary-green flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-text/45 block leading-none">Venue</span>
                        <span className="font-semibold text-dark-forest">{selectedEvent.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary-green flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-text/45 block leading-none">Date & Time</span>
                        <span className="font-semibold text-dark-forest">{selectedEvent.date} • {selectedEvent.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-primary-green flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-text/45 block leading-none">Registered Attendees</span>
                        <span className="font-semibold text-dark-forest">{selectedEvent.registeredUsers.length} / {selectedEvent.capacity} Going</span>
                      </div>
                    </div>
                    {selectedEvent.contactInfo && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-primary-green flex-shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-text/45 block leading-none">Contact Info</span>
                          <span className="font-semibold text-dark-forest">{selectedEvent.contactInfo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEvent.registrationLink && (
                  <div className="flex items-center gap-2 text-xs">
                    <Link2 size={16} className="text-primary-green flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-text/45 block leading-none">External Link</span>
                      <a href={selectedEvent.registrationLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 underline hover:text-blue-800">
                        {selectedEvent.registrationLink}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-[#CD9777]/10">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 py-3.5 border border-[#CD9777]/30 text-xs font-bold rounded-2xl text-slate-text hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  {isRegistered ? (
                    <button
                      onClick={() => handleUnregister(selectedEvent.id)}
                      className="flex-1 py-3.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                    >
                      Cancel Registration 📅
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast('Please sign in to register for events!', { icon: '🔑' });
                          navigate('/login');
                          return;
                        }
                        setShowAppForm(true);
                      }}
                      disabled={selectedEvent.registeredUsers.length >= selectedEvent.capacity}
                      className="flex-1 py-3.5 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                      {selectedEvent.registeredUsers.length >= selectedEvent.capacity ? 'Event Full' : 'Register for Event'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* APPLICATION FORM MODAL */}
      <ApplicationFormModal
        isOpen={showAppForm}
        onClose={() => setShowAppForm(false)}
        onSubmit={handleRegister}
        currentUser={currentUser}
        type="event"
      />

      {/* JOURNAL EXPERIENCE MODAL */}
      <EventExperienceModal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
      />
    </div>
  );
};

export default Events;

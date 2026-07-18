import React, { useState } from 'react';
import { 
  Building2, Users, FileText, CheckCircle, XCircle, Plus, Calendar, Compass, BarChart3, Clock, MapPin, Sparkles, Upload, ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import toast from 'react-hot-toast';

export const OrgDashboard: React.FC = () => {
  const { 
    currentUser, 
    currentOrg, 
    opportunities, 
    events, 
    applications, 
    updateApplicationStatus, 
    createOpportunity, 
    createEvent 
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'opps' | 'events' | 'apps'>('overview');
  
  // Modals
  const [showOppModal, setShowOppModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Forms
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
    coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=60'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    capacity: 50,
    category: 'Environment',
    banner: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=60'
  });

  if (!currentUser || currentUser.role !== 'ORGANIZATION' || !currentOrg) {
    return (
      <div className="text-center py-20 bg-white border border-[#CD9777]/20 rounded-[40px] max-w-xl mx-auto space-y-4">
        <ShieldAlert size={48} className="text-red-500 mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-dark-forest">Access Restricted</h3>
        <p className="text-sm text-slate-text/75 max-w-sm mx-auto">
          Only verified organizations can access this dashboard. If you recently applied, please wait for an administrator to review your request.
        </p>
      </div>
    );
  }

  // Filter items owned by this organization
  const orgOpps = opportunities.filter(o => o.organizationId === currentOrg.id);
  const orgEvents = events.filter(e => e.organizationId === currentOrg.id);
  
  // Applications for this org's opportunities
  const orgOppIds = orgOpps.map(o => o.id);
  const orgApps = applications.filter(a => orgOppIds.includes(a.opportunityId));

  // Analytics mock data
  const chartData = [
    { name: 'Jan', volunteers: 4 },
    { name: 'Feb', volunteers: 8 },
    { name: 'Mar', volunteers: 15 },
    { name: 'Apr', volunteers: 22 },
    { name: 'May', volunteers: 30 },
    { name: 'Jun', volunteers: 45 },
  ];

  const handleCreateOppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = oppForm.skillsRequired.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    createOpportunity({
      title: oppForm.title,
      description: oppForm.description,
      category: oppForm.category,
      location: oppForm.location,
      date: oppForm.date,
      time: oppForm.time,
      duration: oppForm.duration,
      skillsRequired: skillsArray,
      volunteerLimit: Number(oppForm.volunteerLimit),
      coverImage: oppForm.coverImage
    });

    toast.success('Volunteer campaign created! 🌱');
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
      coverImage: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=60'
    });
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent({
      title: eventForm.title,
      description: eventForm.description,
      location: eventForm.location,
      date: eventForm.date,
      time: eventForm.time,
      capacity: Number(eventForm.capacity),
      category: eventForm.category,
      banner: eventForm.banner
    });

    toast.success('Community event scheduled! 📅');
    setShowEventModal(false);
    setEventForm({
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      capacity: 50,
      category: 'Environment',
      banner: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=60'
    });
  };

  const handleAppStatusChange = (appId: string, status: 'ACCEPTED' | 'REJECTED') => {
    updateApplicationStatus(appId, status);
    toast.success(`Application marked as ${status.toLowerCase()}!`);
  };

  return (
    <div className="space-y-8 p-1">
      {/* 1. ORG HEADER */}
      <div className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
        <img 
          src={currentOrg.logo} 
          alt={currentOrg.organizationName} 
          className="w-20 h-20 rounded-3xl object-cover border border-[#CD9777]/20 shadow-md"
        />
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start">
            <h2 className="font-serif text-3xl font-bold text-dark-forest leading-none">
              {currentOrg.organizationName}
            </h2>
            <span className="inline-flex justify-center items-center gap-0.5 bg-green-100 text-green-800 text-[10px] font-bold px-3 py-1 rounded-full border border-green-200 shadow-sm">
              <CheckCircle size={10} />
              Verified Partner
            </span>
          </div>
          <span className="text-xs text-primary-green uppercase tracking-widest font-extrabold block">
            Category: {currentOrg.category}
          </span>
          <p className="text-sm text-slate-text/75 max-w-2xl leading-relaxed">
            {currentOrg.description}
          </p>
        </div>
      </div>

      {/* 2. STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Campaigns', value: orgOpps.length, icon: Compass, color: 'text-primary-green bg-green-50' },
          { label: 'Upcoming Events', value: orgEvents.length, icon: Calendar, color: 'text-blue-700 bg-blue-50' },
          { label: 'Applications Received', value: orgApps.length, icon: FileText, color: 'text-amber-700 bg-amber-50' },
          { label: 'Approved Volunteers', value: orgApps.filter(a => a.status === 'ACCEPTED').length, icon: Users, color: 'text-purple-700 bg-purple-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#CD9777]/20 p-5 rounded-3xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0`}>
              <item.icon size={22} />
            </div>
            <div>
              <span className="text-2xl font-black text-dark-forest leading-none block">{item.value}</span>
              <span className="text-xs font-semibold text-slate-text/50 mt-1 block">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TABS SELECTOR */}
      <div className="border-b border-[#CD9777]/10 flex gap-4 text-sm font-bold text-slate-text">
        {[
          { id: 'overview', label: 'Overview Analytics', icon: BarChart3 },
          { id: 'opps', label: 'My Opportunities', icon: Compass },
          { id: 'events', label: 'My Events', icon: Calendar },
          { id: 'apps', label: 'Volunteer Applications', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-3.5 border-b-2 transition-all px-1 cursor-pointer ${
              activeTab === tab.id
                ? 'border-primary-green text-primary-green'
                : 'border-transparent text-slate-text/60 hover:text-primary-green'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="mt-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm">
              <h4 className="font-serif text-lg font-bold text-dark-forest mb-6">Volunteer Growth</h4>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E4E7" />
                    <XAxis dataKey="name" stroke="#2C2C2C" fontSize={11} tickLine={false} />
                    <YAxis stroke="#2C2C2C" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="volunteers" stroke="#2E7D32" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm space-y-6">
              <h4 className="font-serif text-lg font-bold text-dark-forest">Recent Actions</h4>
              <div className="space-y-4">
                <div className="flex gap-3 text-xs leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">🌱</span>
                  <div>
                    <strong>New Drive Published</strong>
                    <p className="text-slate-text/60">Mussoorie Road Tree Plantation went live.</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">📅</span>
                  <div>
                    <strong>Robbers Cave Event set</strong>
                    <p className="text-slate-text/60">Scheduled cleanup drive for 50 attendees.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OPPORTUNITIES */}
        {activeTab === 'opps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-lg font-bold text-dark-forest">Active Volunteer Campaigns</h4>
              <button
                onClick={() => setShowOppModal(true)}
                className="bg-primary-green hover:bg-dark-forest text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1 transition-all"
              >
                <Plus size={14} />
                Create Opportunity
              </button>
            </div>

            {orgOpps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orgOpps.map((opp) => (
                  <div key={opp.id} className="watercolor-card p-6 flex flex-col justify-between hover:shadow-md transition-all group">
                    <div>
                      <img 
                        src={opp.coverImage} 
                        alt={opp.title} 
                        className="w-full h-36 object-cover rounded-2xl border border-[#CD9777]/10 mb-4"
                      />
                      <span className="text-[9px] font-extrabold bg-soft-mint text-primary-green px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {opp.category}
                      </span>
                      <h5 className="font-serif font-bold text-dark-forest text-sm mt-2 mb-2 leading-snug group-hover:text-primary-green transition-colors">
                        {opp.title}
                      </h5>
                    </div>
                    <div className="pt-4 border-t border-[#CD9777]/10 flex justify-between items-center text-xs text-slate-text/50">
                      <span>Limit: {opp.volunteerLimit} members</span>
                      <span className="font-bold text-primary-green">{opp.applicantsCount} Applied</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-text/40 border border-dashed border-[#CD9777]/20 rounded-3xl">
                No opportunities created yet. Create a campaign to start recruiting.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-lg font-bold text-dark-forest">Scheduled Community Events</h4>
              <button
                onClick={() => setShowEventModal(true)}
                className="bg-primary-green hover:bg-dark-forest text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1 transition-all"
              >
                <Plus size={14} />
                Create Event
              </button>
            </div>

            {orgEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orgEvents.map((evt) => (
                  <div key={evt.id} className="watercolor-card p-6 flex flex-col justify-between hover:shadow-md transition-all group">
                    <div>
                      <img 
                        src={evt.banner} 
                        alt={evt.title} 
                        className="w-full h-36 object-cover rounded-2xl border border-blue-200/10 mb-4"
                      />
                      <span className="text-[9px] font-extrabold bg-soft-sky text-blue-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {evt.category}
                      </span>
                      <h5 className="font-serif font-bold text-dark-forest text-sm mt-2 mb-2 leading-snug group-hover:text-primary-green transition-colors">
                        {evt.title}
                      </h5>
                    </div>
                    <div className="pt-4 border-t border-[#CD9777]/10 flex justify-between items-center text-xs text-slate-text/50">
                      <span>Limit: {evt.capacity} seats</span>
                      <span className="font-bold text-blue-700">{evt.registeredUsers.length} Registered</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-text/40 border border-dashed border-[#CD9777]/20 rounded-3xl">
                No upcoming community events scheduled.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: APPLICATIONS */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold text-dark-forest">Pending Volunteer Applications</h4>

            {orgApps.length > 0 ? (
              <div className="space-y-4">
                {orgApps.map((app) => (
                  <div 
                    key={app.id}
                    className="p-5 bg-white border border-[#CD9777]/25 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Live Avatar Preview */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-soft-sky/40 border border-[#CD9777]/20 flex-shrink-0">
                        {/* Dynamic Avatar config */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="48" fill="#F0F8FF" />
                          <rect x="44" y="65" width="12" height="15" fill={app.userAvatar.skin} />
                          <path d="M20 90C20 78 30 72 50 72C70 72 80 78 80 90V100H20V90Z" fill={app.userAvatar.clothing} />
                          <circle cx="50" cy="50" r="23" fill={app.userAvatar.skin} />
                          <circle cx="40" cy="49" r="2.5" fill="#1B4332" />
                          <circle cx="60" cy="49" r="2.5" fill="#1B4332" />
                          <path d="M44 56C47 59 53 59 56 56" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <h5 className="font-bold text-dark-forest text-sm leading-none">{app.userName}</h5>
                        <span className="text-[10px] text-slate-text/50 block">Applied for: <strong>{app.opportunityTitle}</strong></span>
                        <p className="text-xs text-slate-text/75 italic leading-relaxed pt-1">"{app.notes || 'No custom notes provided.'}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleAppStatusChange(app.id, 'ACCEPTED')}
                            className="bg-primary-green hover:bg-dark-forest text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <CheckCircle size={14} />
                            Accept
                          </button>
                          <button
                            onClick={() => handleAppStatusChange(app.id, 'REJECTED')}
                            className="border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <XCircle size={14} />
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          app.status === 'ACCEPTED' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-text/40 border border-dashed border-[#CD9777]/20 rounded-3xl">
                No active applications received yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE OPPORTUNITY MODAL */}
      {showOppModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setShowOppModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream text-slate-text hover:text-primary-green flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>
            <div className="mb-4">
              <h3 className="font-serif text-xl font-bold text-dark-forest leading-none">Create Campaign</h3>
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

              <div className="flex gap-4 pt-4 border-t border-[#CD9777]/10">
                <button
                  type="button"
                  onClick={() => setShowOppModal(false)}
                  className="flex-1 py-3 border border-[#CD9777]/30 text-xs font-bold rounded-2xl text-slate-text hover:bg-red-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-xl bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setShowEventModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream text-slate-text hover:text-primary-green flex items-center justify-center font-bold text-xs"
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
                  <label className="text-xs font-bold text-slate-text/75 block">Location</label>
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

              <div className="flex gap-4 pt-4 border-t border-[#CD9777]/10">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-3 border border-[#CD9777]/30 text-xs font-bold rounded-2xl text-slate-text hover:bg-red-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrgDashboard;

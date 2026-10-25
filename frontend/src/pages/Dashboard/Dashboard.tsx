import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Award, Calendar, Heart, Clock, ArrowRight, Sun, Thermometer, Flame, ChevronRight, BookOpen, Compass, MapPin
} from 'lucide-react';
import { useAuthStore, LEVEL_NAMES } from '../../store/useAuthStore';
import { ImpactTree } from '../../components/dashboard/ImpactTree';
import { Avatar } from '../../components/common/Avatar';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    opportunities, 
    events, 
    donations, 
    applications,
    applyForOpportunity,
    registerForEvent,
    unregisterFromEvent
  } = useAuthStore();

  const [quote, setQuote] = useState('');
  const [greeting, setGreeting] = useState('Hello');

  // Load random quote & greeting based on time
  useEffect(() => {
    const quotes = [
      "Every act of kindness creates a ripple of hope.",
      "Communities grow stronger when people care together.",
      "Your small actions create lasting, visible change.",
      "Together we build warmer, friendlier neighborhoods.",
      "The best way to find yourself is to lose yourself in the service of others."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    const hr = new Date().getHours();
    if (hr < 12) setGreeting('Good Morning');
    else if (hr < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  if (!currentUser) return null;

  // Filter recommended opportunities based on user interests
  const recommendedOpps = opportunities
    .filter(o => currentUser.interests.includes(o.category))
    .slice(0, 2);

  // Fallback if no interests match
  const finalRecommended = recommendedOpps.length > 0 
    ? recommendedOpps 
    : opportunities.slice(0, 2);

  const upcomingEvents = events.slice(0, 2);

  const handleQuickApply = async (oppId: string) => {
    try {
      await applyForOpportunity(oppId, 'Applying via my dashboard recommendations.');
      toast.success('Application submitted! 🌱');
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply.');
    }
  };

  const handleRegisterEvent = async (eventId: string) => {
    try {
      await registerForEvent(eventId);
      toast.success('Successfully registered for this event! 📅');
    } catch (err: any) {
      toast.error(err.message || 'Failed to register.');
    }
  };

  // User activity history compilation
  const userApps = applications.filter(a => a.userId === currentUser.id);
  const userEventsJoined = events.filter(e => e.registeredUsers.includes(currentUser.id));
  const userDonations = donations.filter(d => d.ownerId === currentUser.id);

  const activities = [
    ...userApps.map(a => ({
      title: `Applied for "${a.opportunityTitle}"`,
      time: a.createdAt,
      type: 'apply',
      badge: '🤝'
    })),
    ...userEventsJoined.map(e => ({
      title: `Registered for event "${e.title}"`,
      time: new Date().toISOString(), // Fallback
      type: 'event',
      badge: '📅'
    })),
    ...userDonations.map(d => ({
      title: `Donated item: "${d.title}"`,
      time: d.createdAt,
      type: 'donate',
      badge: '❤️'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

  return (
    <div className="space-y-8 p-1">
      {/* 1. GREETING & WEATHER MOTIVATION HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Warm greeting card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-primary-green to-dark-forest text-warm-cream p-8 rounded-[36px] shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 opacity-10 select-none text-9xl">🌳</div>
          <div className="z-10 space-y-4">
            <span className="text-xs uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full font-bold">
              Citizen Workspace
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold">
              {greeting}, {currentUser.name} 🌱
            </h2>
            <p className="text-sm text-warm-cream/80 max-w-lg leading-relaxed">
              "{quote}"
            </p>
          </div>
          <div className="mt-8 flex gap-4 text-xs font-semibold text-soft-mint z-10">
            <span>Level {currentUser.level} Contributor</span>
            <span>•</span>
            <span>{currentUser.city}, {currentUser.state}</span>
          </div>
        </div>

        {/* Weather Indicator Card */}
        <div className="lg:col-span-4 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-text/50">Local Weather</span>
            <span className="bg-soft-mint/30 text-primary-green px-2.5 py-1 rounded-full text-[10px] font-bold">
              Dehradun
            </span>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Sun size={32} className="animate-slow-spin" />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-dark-forest">24</span>
                <span className="text-lg font-bold text-dark-forest">°C</span>
              </div>
              <span className="text-xs font-semibold text-slate-text/60">Sunny & Clear Sky</span>
            </div>
          </div>

          <div className="border-t border-[#CD9777]/10 pt-4 flex items-center gap-2 text-xs text-primary-green font-bold">
            <Flame size={14} className="text-leaf-green" />
            <span>Excellent conditions for outdoor volunteering today!</span>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTION CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Volunteer', link: '/opportunities', icon: Compass, bg: 'bg-[#E6F4EA]', text: 'text-primary-green' },
          { label: 'Join Event', link: '/events', icon: Calendar, bg: 'bg-soft-sky/35', text: 'text-blue-700' },
          { label: 'Donate Items', link: '/donate', icon: Heart, bg: 'bg-red-50', text: 'text-red-700' },
          { label: 'Register Org', link: '/profile', icon: BookOpen, bg: 'bg-[#F5DFC0]/35', text: 'text-amber-800' },
        ].map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={`${item.bg} p-6 rounded-3xl flex flex-col justify-between aspect-square hover:shadow-md transition-all duration-300 group`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <item.icon className={`${item.text} group-hover:scale-110 transition-transform`} size={22} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className={`font-serif font-bold text-lg text-dark-forest leading-none`}>{item.label}</span>
              <ChevronRight className={`${item.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} size={18} />
            </div>
          </Link>
        ))}
      </div>

      {/* 3. IMPACT PREVIEW & PROGRESS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 4 Columns: Interactive Impact Tree progress */}
        <div className="lg:col-span-4 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-text/50">My Growth Tree</span>
            <span className="bg-primary-green/10 text-primary-green px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              Level {currentUser.level}
            </span>
          </div>

          <ImpactTree level={currentUser.level} />

          <div className="mt-4 w-full">
            <h4 className="font-serif font-bold text-dark-forest text-lg">
              {LEVEL_NAMES[currentUser.level - 1] || 'Bridge Builder'}
            </h4>
            <p className="text-xs text-slate-text/60 mt-1">
              Your seedling grows as you complete volunteering jobs and upload donations.
            </p>
            <Link 
              to="/my-impact" 
              className="mt-4 text-xs font-bold text-primary-green hover:text-dark-forest inline-flex items-center gap-1 hover:underline"
            >
              See milestones and certificates &rarr;
            </Link>
          </div>
        </div>

        {/* Right 8 Columns: Recommended Opportunities */}
        <div className="lg:col-span-8 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-green block">Tailored for You</span>
              <h3 className="font-serif text-xl font-bold text-dark-forest mt-0.5">Recommended Opportunities</h3>
            </div>
            <Link 
              to="/opportunities" 
              className="text-xs font-bold text-primary-green hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {finalRecommended.map((opp) => (
              <div 
                key={opp.id} 
                className="p-4 bg-warm-cream/40 border border-[#CD9777]/10 hover:border-primary-green/30 rounded-2xl flex flex-col sm:flex-row items-center gap-4 hover:shadow-sm transition-all group"
              >
                <img 
                  src={opp.coverImage} 
                  alt={opp.title} 
                  className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#CD9777]/10"
                />
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[9px] font-extrabold bg-soft-mint text-primary-green px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {opp.category}
                  </span>
                  <h4 className="font-bold text-dark-forest text-sm mt-1 mb-1 leading-snug group-hover:text-primary-green transition-colors">
                    {opp.title}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center sm:justify-start text-xs text-slate-text/50">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {opp.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {opp.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickApply(opp.id)}
                  className="bg-primary-green hover:bg-dark-forest text-white text-xs px-4 py-2.5 rounded-full font-bold transition-colors whitespace-nowrap self-stretch sm:self-center flex items-center justify-center"
                >
                  Quick Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. EVENTS & ACTIVITY TIMELINE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 6 Columns: Upcoming Events Registration */}
        <div className="lg:col-span-6 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-bold text-dark-forest">Upcoming Local Events</h3>
            <Link to="/events" className="text-xs font-bold text-primary-green hover:underline">All Events</Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((evt) => {
              const isRegistered = evt.registeredUsers.includes(currentUser.id);
              return (
                <div 
                  key={evt.id} 
                  className="p-4 bg-soft-sky/10 border border-blue-200/35 rounded-2xl flex items-center gap-4 hover:shadow-sm transition-all"
                >
                  <img 
                    src={evt.banner} 
                    alt={evt.title} 
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-dark-forest text-sm truncate leading-snug">{evt.title}</h4>
                    <span className="text-[10px] text-blue-800 font-bold block mt-0.5">{evt.category} • {evt.date}</span>
                    <span className="text-[10px] text-slate-text/55 flex items-center gap-0.5 mt-1">
                      <MapPin size={10} /> {evt.location.split(',')[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRegisterEvent(evt.id)}
                    disabled={isRegistered}
                    className={`text-xs px-3.5 py-2 rounded-full font-bold whitespace-nowrap ${
                      isRegistered 
                        ? 'bg-blue-100 text-blue-800 cursor-default' 
                        : 'bg-primary-green hover:bg-dark-forest text-white'
                    }`}
                  >
                    {isRegistered ? 'Going' : 'Join'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Columns: Recent activity timeline */}
        <div className="lg:col-span-6 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm">
          <h3 className="font-serif text-xl font-bold text-dark-forest mb-6">Recent Activity</h3>
          
          <div className="relative pl-6 border-l-2 border-[#CD9777]/15 space-y-6">
            {activities.length > 0 ? (
              activities.map((act, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline point indicator */}
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary-green flex items-center justify-center text-[9px] shadow-sm">
                    {act.badge}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h5 className="text-xs font-bold text-dark-forest">{act.title}</h5>
                    <span className="text-[10px] text-slate-text/45">
                      {new Date(act.time).toLocaleDateString()} at {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-text/40 pl-0 border-l-0">
                🌱 Welcome to GreenBridge! Let's begin your journey by joining your first campaign, event, or uploading a donation item.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. VOLUNTEER WORKSPACE & EVENT REGISTRATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Volunteering Applications */}
        <div className="lg:col-span-6 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-dark-forest mb-4">My Volunteering Applications</h3>
            <div className="space-y-3">
              {userApps.length > 0 ? (
                userApps.map((app) => (
                  <div key={app.id} className="p-4 bg-warm-cream/20 border border-[#CD9777]/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-dark-forest text-sm">{app.opportunityTitle}</h4>
                      <span className="text-[10px] text-slate-text/50 block mt-0.5">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${
                        app.status === 'ACCEPTED'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : app.status === 'REJECTED'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-text/45 bg-warm-cream/5 border border-dashed border-[#CD9777]/10 rounded-2xl">
                  No active volunteering applications.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registered Events */}
        <div className="lg:col-span-6 bg-white border border-[#CD9777]/20 p-6 rounded-[36px] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-dark-forest mb-4">My Registered Events</h3>
            <div className="space-y-3">
              {userEventsJoined.length > 0 ? (
                userEventsJoined.map((evt) => (
                  <div key={evt.id} className="p-4 bg-warm-cream/20 border border-[#CD9777]/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-dark-forest text-sm">{evt.title}</h4>
                      <span className="text-[10px] text-blue-800 font-bold block mt-0.5">{evt.date} • {evt.time}</span>
                      <span className="text-[10px] text-slate-text/55 block mt-0.5">{evt.location}</span>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await unregisterFromEvent(evt.id);
                          toast.success('Unregistered successfully!');
                        } catch (err: any) {
                          toast.error(err.message || 'Failed to unregister.');
                        }
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline bg-red-50 hover:bg-red-100/50 px-2.5 py-1.5 rounded-xl border border-red-100 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-text/45 bg-warm-cream/5 border border-dashed border-[#CD9777]/10 rounded-2xl">
                  No upcoming event registrations.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

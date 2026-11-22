import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Award, Calendar, Heart, Clock, ArrowRight, Sun, Flame, ChevronRight, BookOpen, Compass, MapPin,
  Sparkles, CheckCircle2, TrendingUp, ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
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
    unregisterFromEvent,
    recommendations,
    fetchRecommendations,
    volunteerAnalytics,
    fetchVolunteerAnalytics
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

    // Fetch recommendations and analytics from backend
    fetchRecommendations();
    fetchVolunteerAnalytics();
  }, [fetchRecommendations, fetchVolunteerAnalytics]);

  if (!currentUser) return null;

  const displayRecommendations = recommendations.length > 0 
    ? recommendations.slice(0, 3)
    : opportunities.slice(0, 3).map(opp => ({
        opportunity: opp,
        matchScore: 85,
        scoreBreakdown: { skillsScore: 80, interestsScore: 90, availabilityScore: 85, locationScore: 85 },
        reasons: [`Matches interest in ${opp.category}`, 'Open to all verified volunteers']
      }));

  const upcomingEvents = events.slice(0, 2);

  const handleQuickApply = async (oppId: string) => {
    try {
      await applyForOpportunity(oppId, 'Applying via AI recommendation match engine.');
      toast.success('Application submitted! 🌱');
      fetchRecommendations();
      fetchVolunteerAnalytics();
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
      time: new Date().toISOString(),
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
        <div className="lg:col-span-8 bg-gradient-to-br from-[#0A3323] to-[#105666] text-[#F7F4D5] p-8 rounded-[36px] shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 opacity-10 select-none text-9xl">🌳</div>
          <div className="z-10 space-y-4">
            <span className="text-xs uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full font-bold">
              Citizen Workspace
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#F7F4D5]">
              {greeting}, {currentUser.name} 🌱
            </h2>
            <p className="text-sm text-[#F7F4D5]/80 max-w-lg leading-relaxed">
              "{quote}"
            </p>
          </div>
          <div className="mt-8 flex gap-4 text-xs font-semibold text-[#839958] z-10">
            <span>Level {currentUser.level} Contributor</span>
            <span>•</span>
            <span>{currentUser.city}, {currentUser.state}</span>
          </div>
        </div>

        {/* Weather Indicator Card */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-text/50 dark:text-[#F3F1E7]/50">Local Climate</span>
            <span className="bg-soft-mint/30 dark:bg-[#839958]/30 text-primary-green dark:text-[#F7F4D5] px-2.5 py-1 rounded-full text-[10px] font-bold">
              {currentUser.city || 'Dehradun'}
            </span>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500">
              <Sun size={32} className="animate-slow-spin" />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-dark-forest dark:text-[#F7F4D5]">24</span>
                <span className="text-lg font-bold text-dark-forest dark:text-[#F7F4D5]">°C</span>
              </div>
              <span className="text-xs font-semibold text-slate-text/60 dark:text-[#F3F1E7]/60">Pleasant & Clear Sky</span>
            </div>
          </div>

          <div className="border-t border-[#CD9777]/10 dark:border-white/10 pt-4 flex items-center gap-2 text-xs text-primary-green dark:text-[#839958] font-bold">
            <Flame size={14} className="text-leaf-green" />
            <span>Optimal conditions for outdoor community drives today!</span>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTION CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Volunteer', link: '/opportunities', icon: Compass, bg: 'bg-[#E6F4EA] dark:bg-[#16291E]', text: 'text-primary-green dark:text-[#839958]' },
          { label: 'Join Event', link: '/events', icon: Calendar, bg: 'bg-soft-sky/35 dark:bg-[#11252A]', text: 'text-blue-700 dark:text-cyan-400' },
          { label: 'Donate Items', link: '/donate', icon: Heart, bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-[#D3968C]' },
          { label: 'Register Org', link: '/profile', icon: BookOpen, bg: 'bg-[#F5DFC0]/35 dark:bg-[#28221B]', text: 'text-amber-800 dark:text-[#F7F4D5]' },
        ].map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={`${item.bg} p-6 rounded-3xl flex flex-col justify-between aspect-square hover:shadow-md transition-all duration-300 group border border-transparent dark:border-white/5`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1A211C] flex items-center justify-center shadow-sm">
              <item.icon className={`${item.text} group-hover:scale-110 transition-transform`} size={22} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className={`font-serif font-bold text-lg text-dark-forest dark:text-[#F7F4D5] leading-none`}>{item.label}</span>
              <ChevronRight className={`${item.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} size={18} />
            </div>
          </Link>
        ))}
      </div>

      {/* 3. AI RECOMMENDATION ENGINE SECTION */}
      <section className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-8 rounded-[36px] shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-green dark:text-[#839958] flex items-center gap-1">
                <Sparkles size={12} />
                Multi-Criteria Recommendation Engine
              </span>
              <span className="text-[9px] font-mono bg-soft-mint dark:bg-[#839958]/20 text-primary-green dark:text-[#F7F4D5] px-2 py-0.5 rounded-full">
                0.35S + 0.30I + 0.20A + 0.15L
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-dark-forest dark:text-[#F7F4D5] mt-1">
              Recommended Volunteering For You
            </h3>
            <p className="text-xs text-slate-text/60 dark:text-[#F3F1E7]/60 mt-0.5">
              Ranked mathematically based on your registered skills, interest categories, calendar availability, and geographic proximity.
            </p>
          </div>
          <Link 
            to="/opportunities" 
            className="text-xs font-bold text-primary-green dark:text-[#839958] hover:underline flex items-center gap-1"
          >
            Explore All Opportunities
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayRecommendations.map((rec) => {
            const opp = rec.opportunity;
            return (
              <div 
                key={opp.id} 
                className="p-5 bg-warm-cream/35 dark:bg-[#121713] border border-[#CD9777]/20 dark:border-white/10 hover:border-primary-green/40 dark:hover:border-[#839958]/50 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative">
                    <img 
                      src={opp.coverImage} 
                      alt={opp.title} 
                      className="w-full h-36 object-cover rounded-2xl border border-[#CD9777]/10 dark:border-white/5"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#0A3323]/90 backdrop-blur-md text-[#F7F4D5] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles size={11} className="text-[#839958]" />
                      {rec.matchScore}% Match
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-extrabold bg-soft-mint dark:bg-[#839958]/25 text-primary-green dark:text-[#F7F4D5] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {opp.category}
                    </span>
                    <h4 className="font-bold text-dark-forest dark:text-[#F7F4D5] text-base mt-1.5 leading-snug group-hover:text-primary-green dark:group-hover:text-[#839958] transition-colors">
                      {opp.title}
                    </h4>
                    <span className="text-xs text-slate-text/60 dark:text-[#F3F1E7]/60 block mt-0.5">
                      by {opp.organizationName}
                    </span>
                  </div>

                  {/* Explainability Tags */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-text/40 dark:text-[#F3F1E7]/40 block">
                      Why Recommended:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {rec.reasons.map((reason, rIdx) => (
                        <span 
                          key={rIdx} 
                          className="text-[10px] bg-white dark:bg-[#1A211C] border border-[#CD9777]/15 dark:border-white/10 text-slate-text/80 dark:text-[#F3F1E7]/80 px-2 py-0.5 rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle2 size={10} className="text-primary-green" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score Breakdown Indicator */}
                  <div className="bg-white/60 dark:bg-white/5 p-2.5 rounded-xl space-y-1 text-[10px]">
                    <div className="flex justify-between font-bold text-slate-text/70 dark:text-[#F3F1E7]/70">
                      <span>Skills ({rec.scoreBreakdown.skillsScore}%)</span>
                      <span>Interests ({rec.scoreBreakdown.interestsScore}%)</span>
                      <span>Availability ({rec.scoreBreakdown.availabilityScore}%)</span>
                    </div>
                    <div className="w-full bg-[#CD9777]/10 dark:bg-white/10 h-1 rounded-full overflow-hidden flex">
                      <div className="bg-primary-green h-full" style={{ width: `${rec.scoreBreakdown.skillsScore * 0.35}%` }} />
                      <div className="bg-[#839958] h-full" style={{ width: `${rec.scoreBreakdown.interestsScore * 0.30}%` }} />
                      <div className="bg-[#105666] h-full" style={{ width: `${rec.scoreBreakdown.availabilityScore * 0.20}%` }} />
                      <div className="bg-[#D3968C] h-full" style={{ width: `${rec.scoreBreakdown.locationScore * 0.15}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#CD9777]/10 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-text/50 dark:text-[#F3F1E7]/50">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {opp.location.split(',')[0]}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {opp.date}</span>
                  </div>
                  <button
                    onClick={() => handleQuickApply(opp.id)}
                    className="bg-primary-green hover:bg-dark-forest dark:bg-[#0A3323] dark:hover:bg-[#105666] text-white text-xs px-4 py-2 rounded-full font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Quick Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. REAL-TIME VOLUNTEER IMPACT ANALYTICS (RECHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 4 Columns: Interactive Impact Tree progress */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm flex flex-col items-center justify-between text-center transition-colors">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-text/50 dark:text-[#F3F1E7]/50">My Growth Tree</span>
            <span className="bg-primary-green/10 dark:bg-[#839958]/20 text-primary-green dark:text-[#F7F4D5] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              Level {currentUser.level}
            </span>
          </div>

          <ImpactTree level={currentUser.level} />

          <div className="mt-4 w-full">
            <h4 className="font-serif font-bold text-dark-forest dark:text-[#F7F4D5] text-lg">
              {LEVEL_NAMES[currentUser.level - 1] || 'Bridge Builder'}
            </h4>
            <p className="text-xs text-slate-text/60 dark:text-[#F3F1E7]/60 mt-1">
              Your seedling grows as you complete verified volunteer jobs and upload donation items.
            </p>
            <div className="mt-3 bg-warm-cream/50 dark:bg-[#121713] p-3 rounded-2xl border border-[#CD9777]/10 dark:border-white/10 text-left">
              <div className="flex justify-between text-[10px] font-bold text-slate-text/70 dark:text-[#F3F1E7]/70 mb-1">
                <span>XP Progress</span>
                <span>{currentUser.xp} / {currentUser.level * 500} XP</span>
              </div>
              <div className="w-full h-2 bg-[#CD9777]/15 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-green transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentUser.xp / (currentUser.level * 500)) * 100)}%` }}
                />
              </div>
            </div>
            <Link 
              to="/my-impact" 
              className="mt-4 text-xs font-bold text-primary-green dark:text-[#839958] hover:underline inline-flex items-center gap-1"
            >
              View certificates and impact breakdown &rarr;
            </Link>
          </div>
        </div>

        {/* Right 8 Columns: Recharts 6-Month Volunteer Impact AreaChart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-primary-green dark:text-[#839958]">
                <TrendingUp size={12} />
                Verified Activity Analytics
              </div>
              <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5]">
                Monthly Volunteer Hours & Drives
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-primary-green dark:text-[#839958]">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-green inline-block" />
                Total Hours: {volunteerAnalytics?.totalVolunteerHours || 12} hrs
              </span>
              <span className="flex items-center gap-1.5 text-[#105666] dark:text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#105666] inline-block" />
                Accepted Drives: {volunteerAnalytics?.acceptedApplications || 2}
              </span>
            </div>
          </div>

          <div className="h-64 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volunteerAnalytics?.monthlyActivity || [
                { month: 'Nov', hours: 4, drives: 1 },
                { month: 'Dec', hours: 8, drives: 2 },
                { month: 'Jan', hours: 6, drives: 2 },
                { month: 'Feb', hours: 10, drives: 3 },
                { month: 'Mar', hours: 14, drives: 3 },
                { month: 'Apr', hours: 12, drives: 2 }
              ]}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#839958" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,51,35,0.08)" />
                <XAxis dataKey="month" stroke="#738075" fontSize={11} tickLine={false} />
                <YAxis stroke="#738075" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A211C', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    color: '#F7F4D5',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="hours" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" name="Volunteer Hours" />
                <Area type="monotone" dataKey="drives" stroke="#105666" strokeWidth={2} fillOpacity={0} name="Drives Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution Pills */}
          <div className="pt-3 border-t border-[#CD9777]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-text/50 dark:text-[#F3F1E7]/50 text-[11px]">Category Breakdown:</span>
            <div className="flex flex-wrap gap-2">
              {(volunteerAnalytics?.categoryDistribution || [
                { category: 'Environment', count: 3, hours: 12 },
                { category: 'Education', count: 1, hours: 4 }
              ]).map((c, idx) => (
                <span 
                  key={idx}
                  className="bg-warm-cream dark:bg-[#121713] border border-[#CD9777]/15 dark:border-white/10 text-slate-text/80 dark:text-[#F3F1E7]/80 px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />
                  {c.category}: <strong>{c.hours} hrs</strong> ({c.count} {c.count === 1 ? 'drive' : 'drives'})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. EVENTS & ACTIVITY TIMELINE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 6 Columns: Upcoming Events Registration */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5]">Upcoming Local Events</h3>
            <Link to="/events" className="text-xs font-bold text-primary-green dark:text-[#839958] hover:underline">All Events</Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((evt) => {
              const isRegistered = evt.registeredUsers.includes(currentUser.id);
              return (
                <div 
                  key={evt.id} 
                  className="p-4 bg-soft-sky/10 dark:bg-[#11252A] border border-blue-200/35 dark:border-white/5 rounded-2xl flex items-center gap-4 hover:shadow-sm transition-all"
                >
                  <img 
                    src={evt.banner} 
                    alt={evt.title} 
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-dark-forest dark:text-[#F7F4D5] text-sm truncate leading-snug">{evt.title}</h4>
                    <span className="text-[10px] text-blue-800 dark:text-cyan-400 font-bold block mt-0.5">{evt.category} • {evt.date}</span>
                    <span className="text-[10px] text-slate-text/55 dark:text-[#F3F1E7]/55 flex items-center gap-0.5 mt-1">
                      <MapPin size={10} /> {evt.location.split(',')[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRegisterEvent(evt.id)}
                    disabled={isRegistered}
                    className={`text-xs px-3.5 py-2 rounded-full font-bold whitespace-nowrap cursor-pointer ${
                      isRegistered 
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 cursor-default' 
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
        <div className="lg:col-span-6 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm transition-colors">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] mb-6">Recent Activity</h3>
          
          <div className="relative pl-6 border-l-2 border-[#CD9777]/15 dark:border-white/10 space-y-6">
            {activities.length > 0 ? (
              activities.map((act, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline point indicator */}
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white dark:bg-[#1A211C] border-2 border-primary-green flex items-center justify-center text-[9px] shadow-sm">
                    {act.badge}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h5 className="text-xs font-bold text-dark-forest dark:text-[#F7F4D5]">{act.title}</h5>
                    <span className="text-[10px] text-slate-text/45 dark:text-[#F3F1E7]/45">
                      {new Date(act.time).toLocaleDateString()} at {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-text/40 dark:text-[#F3F1E7]/40 pl-0 border-l-0">
                🌱 Welcome to GreenBridge! Let's begin your journey by joining your first campaign, event, or uploading a donation item.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. VOLUNTEER WORKSPACE & EVENT REGISTRATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Volunteering Applications */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] mb-4">My Volunteering Applications</h3>
            <div className="space-y-3">
              {userApps.length > 0 ? (
                userApps.map((app) => (
                  <div key={app.id} className="p-4 bg-warm-cream/20 dark:bg-[#121713] border border-[#CD9777]/10 dark:border-white/5 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-dark-forest dark:text-[#F7F4D5] text-sm">{app.opportunityTitle}</h4>
                      <span className="text-[10px] text-slate-text/50 dark:text-[#F3F1E7]/50 block mt-0.5">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${
                        app.status === 'ACCEPTED'
                          ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-emerald-300 border-green-200 dark:border-green-800'
                          : app.status === 'REJECTED'
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-rose border-red-200 dark:border-red-800'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-text/45 dark:text-[#F3F1E7]/45 bg-warm-cream/5 border border-dashed border-[#CD9777]/10 dark:border-white/10 rounded-2xl">
                  No active volunteering applications.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registered Events */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] mb-4">My Registered Events</h3>
            <div className="space-y-3">
              {userEventsJoined.length > 0 ? (
                userEventsJoined.map((evt) => (
                  <div key={evt.id} className="p-4 bg-warm-cream/20 dark:bg-[#121713] border border-[#CD9777]/10 dark:border-white/5 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-dark-forest dark:text-[#F7F4D5] text-sm">{evt.title}</h4>
                      <span className="text-[10px] text-blue-800 dark:text-cyan-400 font-bold block mt-0.5">{evt.date} • {evt.time}</span>
                      <span className="text-[10px] text-slate-text/55 dark:text-[#F3F1E7]/55 block mt-0.5">{evt.location}</span>
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
                      className="text-[10px] font-bold text-red-600 dark:text-[#D3968C] hover:text-red-800 hover:underline bg-red-50 dark:bg-red-950/30 hover:bg-red-100/50 px-2.5 py-1.5 rounded-xl border border-red-100 dark:border-red-900/40 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-text/45 dark:text-[#F3F1E7]/45 bg-warm-cream/5 border border-dashed border-[#CD9777]/10 dark:border-white/10 rounded-2xl">
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

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, Users, Gift, MapPin, ArrowRight, Search, Award, Sparkles, Clock, CheckCircle2 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { EnvelopeSection } from '../../components/landing/EnvelopeSection';
import { Background3DScene } from '../../components/common/Background3DScene';
import { Surface } from '../../components/common/Surface';
import toast from 'react-hot-toast';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { 
    opportunities, 
    events, 
    donations, 
    organizations,
    isAuthenticated,
    applyForOpportunity,
    registerForEvent,
    requestDonation
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'opportunities' | 'events' | 'donations'>('opportunities');
  const [selectedMapPoint, setSelectedMapPoint] = useState<string | null>('dehradun');

  // Animation values for stats counters
  const [counts, setCounts] = useState({ volunteers: 0, orgs: 0, events: 0, donations: 0 });

  useEffect(() => {
    const target = { volunteers: 250, orgs: 35, events: 120, donations: 500 };
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setCounts({
        volunteers: Math.floor(target.volunteers * progress),
        orgs: Math.floor(target.orgs * progress),
        events: Math.floor(target.events * progress),
        donations: Math.floor(target.donations * progress),
      });

      if (frame === totalFrames) {
        clearInterval(counterInterval);
        setCounts(target);
      }
    }, frameDuration);

    return () => clearInterval(counterInterval);
  }, []);

  const handleApply = async (oppId: string) => {
    if (!isAuthenticated) {
      toast('Please sign in to apply for volunteering opportunities!', { icon: '🔑' });
      navigate('/login');
      return;
    }
    try {
      await applyForOpportunity(oppId, 'Interested in helping!');
      toast.success('Application submitted successfully! 🌱');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application.');
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!isAuthenticated) {
      toast('Please sign in to register for events!', { icon: '🔑' });
      navigate('/login');
      return;
    }
    try {
      await registerForEvent(eventId);
      toast.success('Registered for event! See you there! 📅');
    } catch (err: any) {
      toast.error(err.message || 'Failed to register.');
    }
  };

  const handleClaimDonation = async (donationId: string) => {
    if (!isAuthenticated) {
      toast('Please sign in to request items!', { icon: '🔑' });
      navigate('/login');
      return;
    }
    try {
      await requestDonation(donationId);
      toast.success('Donation requested! The owner has been notified. 🎁');
    } catch (err: any) {
      toast.error(err.message || 'Failed to request donation.');
    }
  };

  // Coordinates data for the interactive Uttarakhand SVG Map
  const mapHotspots = [
    { id: 'dehradun', name: 'Dehradun Valley', cx: 35, cy: 55, activeOpps: 4, desc: 'Central hub. Tree planting drives, tutoring programs.' },
    { id: 'mussoorie', name: 'Mussoorie Hills', cx: 48, cy: 40, activeOpps: 2, desc: 'Eco-cleanups and landslide mitigation awareness.' },
    { id: 'rishikesh', name: 'Rishikesh Ganga Bend', cx: 65, cy: 75, activeOpps: 3, desc: 'Ganges river cleaning drives, plastic audits.' },
  ];

  return (
    <div className="pt-20">
      {/* 1. HERO SECTION - PAIR A */}
      <Surface tone="pairA" className="min-h-[85vh] flex flex-col items-center justify-center text-center relative px-6 py-20 overflow-hidden">
        <Background3DScene tab="hero" className="w-full">
          <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8 relative"
            >
              {/* Float-animated illustration container */}
              {/* HERO_IMAGE_PENDING: Replace src="/assets/illustrations/bridge_hero.png" with "/assets/illustrations/bridge_hero_cutout.png" once polished cutout asset is approved */}
              <div className="w-80 h-80 md:w-96 md:h-96 mx-auto relative select-none animate-float">
                <img 
                  src="/assets/illustrations/bridge_hero.png" 
                  alt="GreenBridge Illustration (HERO_IMAGE_PENDING)" 
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              </div>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-serif text-[#0A3323] dark:text-[#B89D47] font-black tracking-tight max-w-2xl leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Small Acts. <span className="text-[#2E7D32] dark:text-[#839958]">Big Impact.</span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-[#0A3323]/85 dark:text-[#595F31]/90 max-w-2xl leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Discover volunteer opportunities, community events, donation drives, and verified organizations all in one warm, supportive platform. Join thousands creating change in their neighborhoods today.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                to="/register" 
                className="bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5] px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-0.5"
              >
                🌱 Become a Volunteer
              </Link>
              <Link 
                to="/profile" 
                className="bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5] px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-0.5"
              >
                🏢 Register Your Organization
              </Link>
            </motion.div>
          </div>
        </Background3DScene>
      </Surface>

      {/* 2. HOW GREENBRIDGE WORKS - PAIR B */}
      <Surface tone="pairB" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#105666] bg-[#105666]/10 px-3.5 py-1.5 rounded-full">Process</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#105666] font-bold mt-4 mb-5">How GreenBridge Works</h2>
            <p className="text-[#105666]/80 leading-relaxed">It takes just four simple steps to plug yourself into our community workspace and start creating local impact.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative">
            <div className="hidden lg:block absolute top-16 left-20 right-20 h-0.5 bg-[#105666]/15 z-0" />
            
            {[
              { step: '1', title: 'Create Account', desc: 'Register as a citizen, customize your illustrated avatar, and tell us your skills.', icon: Users },
              { step: '2', title: 'Discover Opportunities', desc: 'Browse our interactive map or use filters to find cleanups, tutoring, or drives.', icon: Search },
              { step: '3', title: 'Volunteer or Donate', desc: 'Join hands to participate in weekend campaigns, or share books, clothes, and tools.', icon: Heart },
              { step: '4', title: 'Track Your Impact', desc: 'Watch your visual Impact Tree grow, unlock badges, and earn certificates.', icon: Award },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="bg-white/80 border border-[#105666]/15 rounded-3xl p-8 flex flex-col items-center relative z-10 hover:shadow-2xl transition-all duration-300"
                whileHover={{ y: -8 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#105666] flex items-center justify-center text-[#F7F4D5] mb-6 relative">
                  <item.icon size={28} />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D3968C] text-[#0A3323] flex items-center justify-center text-xs font-bold">{item.step}</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-[#105666] mb-3">{item.title}</h4>
                <p className="text-sm text-[#105666]/75 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Surface>

      {/* 3. WRITE US A LETTER & COMMUNITY REEL - PAIR C */}
      <Surface tone="pairC" className="py-16">
        <EnvelopeSection />
      </Surface>

      {/* 4. EXPLORE IMPACT ZONES (MAP) - NO CHANGE (UNTOUCHED) */}
      <Surface tone="moss" className="py-20 px-6 border-y border-[#062015]/15">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#062015] bg-[#062015]/10 px-3.5 py-1.5 rounded-full">Interactive Geography</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#062015] font-bold leading-tight">Explore Impact Zones</h2>
            <p className="text-[#062015]/85 leading-relaxed">
              We are currently establishing deep roots in Dehradun and surrounding districts in Uttarakhand. Select a hotspot on our community vector map to see local volunteering drives.
            </p>
            
            <div className="space-y-4 mt-6">
              {mapHotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedMapPoint(spot.id)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all duration-200 ${
                    selectedMapPoint === spot.id
                      ? 'bg-[#062015] text-[#F7F4D5] border-[#062015] shadow-md'
                      : 'bg-white/80 text-[#062015] border-[#062015]/20 hover:border-[#062015]/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold flex items-center gap-2">
                      <MapPin size={16} />
                      {spot.name}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#062015]/15">
                      {spot.activeOpps} Drives
                    </span>
                  </div>
                  {selectedMapPoint === spot.id && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs opacity-90 mt-2 leading-relaxed"
                    >
                      {spot.desc}
                    </motion.p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[550px] aspect-[4/3] bg-white border border-[#062015]/20 rounded-[40px] p-6 shadow-xl relative overflow-hidden">
              <svg viewBox="0 0 100 80" className="w-full h-full">
                <path d="M10 20Q30 18 50 30T90 20" stroke="#839958" strokeWidth="0.5" fill="none" opacity="0.4" />
                <path d="M5 40Q40 38 60 55T95 50" stroke="#839958" strokeWidth="0.5" fill="none" opacity="0.4" />
                <path d="M15 65Q35 60 55 70T85 65" stroke="#839958" strokeWidth="0.5" fill="none" opacity="0.4" />
                
                <path 
                  d="M10 60C25 58 35 48 45 42C55 35 65 30 75 25C85 20 90 25 95 35V75H5V60H10Z" 
                  fill="#F8F7F2" 
                  stroke="#062015" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2" 
                />

                <path 
                  d="M5 75C25 72 40 76 60 70C75 66 85 73 95 72" 
                  stroke="#105666" 
                  strokeWidth="5" 
                  fill="none" 
                  opacity="0.6" 
                />

                {mapHotspots.map((spot) => (
                  <g 
                    key={spot.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedMapPoint(spot.id)}
                  >
                    <circle 
                      cx={spot.cx} 
                      cy={spot.cy} 
                      r={selectedMapPoint === spot.id ? 8 : 4} 
                      fill="#062015" 
                      opacity={selectedMapPoint === spot.id ? 0.3 : 0.15} 
                      className="transition-all duration-300"
                    />
                    <circle 
                      cx={spot.cx} 
                      cy={spot.cy} 
                      r={selectedMapPoint === spot.id ? 5 : 3.5} 
                      fill={selectedMapPoint === spot.id ? '#062015' : '#839958'} 
                      stroke="#FFF" 
                      strokeWidth="1"
                      className="transition-all duration-300 group-hover:scale-125"
                    />
                    <text 
                      x={spot.cx} 
                      y={spot.cy - 7} 
                      textAnchor="middle" 
                      fontSize="3.2" 
                      fontWeight="bold" 
                      fill="#062015"
                      className="select-none"
                    >
                      {spot.name.split(' ')[0]}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-[#062015]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#062015] uppercase tracking-widest block">Active Point</span>
                  <span className="font-serif font-bold text-[#062015] text-sm">
                    {mapHotspots.find(s => s.id === selectedMapPoint)?.name}
                  </span>
                </div>
                <Link 
                  to="/opportunities"
                  className="flex items-center gap-1 bg-[#062015] hover:bg-[#0A3323] text-[#F7F4D5] text-xs px-3.5 py-2 rounded-full font-bold transition-all"
                >
                  Browse Drives
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Surface>

      {/* 5. CAMPAIGNS / VOLUNTEER OPPORTUNITIES NEAR YOU - PAIR D */}
      <Surface tone="pairD" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0A3323] bg-[#0A3323]/10 px-3.5 py-1.5 rounded-full">Active Campaigns</span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#0A3323] font-bold mt-4">Volunteer Opportunities Near You</h2>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('opportunities')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'opportunities' 
                    ? 'bg-[#0A3323] text-[#F7F4D5] shadow-md' 
                    : 'bg-white text-[#0A3323] hover:bg-[#0A3323]/10'
                }`}
              >
                Opportunities
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'events' 
                    ? 'bg-[#0A3323] text-[#F7F4D5] shadow-md' 
                    : 'bg-white text-[#0A3323] hover:bg-[#0A3323]/10'
                }`}
              >
                Community Events
              </button>
              <button 
                onClick={() => setActiveTab('donations')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'donations' 
                    ? 'bg-[#0A3323] text-[#F7F4D5] shadow-md' 
                    : 'bg-white text-[#0A3323] hover:bg-[#0A3323]/10'
                }`}
              >
                Donations
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeTab === 'opportunities' && (
                opportunities.slice(0, 3).map((opp) => (
                  <div key={opp.id} className="bg-white border border-[#0A3323]/15 rounded-3xl flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={opp.coverImage} 
                        alt={opp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-[#0A3323] text-[#F7F4D5] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {opp.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        {opp.organizationLogo && (
                          <img 
                            src={opp.organizationLogo} 
                            alt={opp.organizationName}
                            className="w-7 h-7 rounded-full aspect-square overflow-hidden object-cover object-center border border-[#0A3323]/20 flex-shrink-0"
                          />
                        )}
                        <span className="text-xs font-bold text-[#0A3323]">{opp.organizationName}</span>
                        <span className="text-[10px] bg-[#0A3323]/10 text-[#0A3323] px-2 py-0.5 rounded-full font-bold">Verified</span>
                      </div>

                      <h4 className="font-serif text-xl font-bold text-[#0A3323] mb-2 leading-snug">
                        {opp.title}
                      </h4>
                      <p className="text-xs text-[#0A3323]/75 line-clamp-3 mb-6 leading-relaxed">
                        {opp.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-[#0A3323]/10 flex flex-col gap-3 text-xs text-[#0A3323]/80">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#105666]" />
                          <span>{opp.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#105666]" />
                            <span>{opp.date} • {opp.time}</span>
                          </div>
                          <span className="font-bold text-[#105666]">{opp.applicantsCount} Joined</span>
                        </div>
                        
                        <button
                          onClick={() => handleApply(opp.id)}
                          className="w-full mt-2 bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5] py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          Apply for Campaign
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {activeTab === 'events' && (
                events.map((evt) => (
                  <div key={evt.id} className="bg-white border border-[#0A3323]/15 rounded-3xl flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={evt.banner} 
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-[#105666] text-[#F7F4D5] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {evt.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <span className="text-[10px] font-bold text-[#105666] uppercase tracking-wider block mb-2">
                        Organizer: {evt.organizationName}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#0A3323] mb-2 leading-snug">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#0A3323]/75 line-clamp-3 mb-6 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-[#0A3323]/10 flex flex-col gap-3 text-xs text-[#0A3323]/80">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#105666]" />
                          <span>{evt.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#105666]" />
                          <span>{evt.date} • {evt.time}</span>
                        </div>
                        
                        <button
                          onClick={() => handleRegister(evt.id)}
                          className="w-full mt-2 bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5] py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          Register for Event
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {activeTab === 'donations' && (
                donations.map((don) => (
                  <div key={don.id} className="bg-white border border-[#0A3323]/15 rounded-3xl flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={don.images[0]} 
                        alt={don.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-[#D3968C] text-[#0A3323] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {don.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#0A3323]/80">From: {don.ownerName}</span>
                        <span className="text-[10px] bg-[#0A3323]/10 text-[#0A3323] px-2 py-0.5 rounded-full font-bold">
                          {don.condition}
                        </span>
                      </div>

                      <h4 className="font-serif text-xl font-bold text-[#0A3323] mb-2 leading-snug">
                        {don.title}
                      </h4>
                      <p className="text-xs text-[#0A3323]/75 line-clamp-3 mb-6 leading-relaxed">
                        {don.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-[#0A3323]/10 flex flex-col gap-3 text-xs text-[#0A3323]/80">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#105666]" />
                          <span>{don.location}</span>
                        </div>
                        
                        <button
                          onClick={() => handleClaimDonation(don.id)}
                          disabled={don.status !== 'AVAILABLE'}
                          className={`w-full mt-2 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                            don.status === 'AVAILABLE'
                              ? 'bg-[#0A3323] hover:bg-[#105666] text-[#F7F4D5]'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {don.status === 'AVAILABLE' ? 'Request Item 🎁' : 'Claimed'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Surface>

      {/* 6. VERIFIED ORGANIZATIONS - PAIR E */}
      <Surface tone="pairE" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0A3323] bg-[#0A3323]/10 px-3.5 py-1.5 rounded-full">Partners</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#0A3323] font-bold mt-4 mb-5">Verified Organizations</h2>
            <p className="text-[#0A3323]/80">We manually check registration documents of every club, foundation, and initiative to ensure high security and trust.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {organizations.filter(o => o.verificationStatus === 'APPROVED').map((org) => (
              <div key={org.id} className="bg-white border border-[#0A3323]/15 rounded-3xl p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 hover:shadow-xl transition-all duration-300">
                <img 
                  src={org.logo} 
                  alt={org.organizationName}
                  className="w-20 h-20 rounded-2xl aspect-square overflow-hidden object-cover object-center border border-[#0A3323]/15 flex-shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start">
                    <h4 className="font-serif text-lg font-bold text-[#0A3323] leading-none">{org.organizationName}</h4>
                    <span className="inline-flex justify-center items-center gap-0.5 bg-[#0A3323]/10 text-[#0A3323] text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={10} />
                      Verified
                    </span>
                  </div>
                  <span className="text-[10px] text-[#105666] uppercase tracking-wider font-extrabold block">
                    {org.category}
                  </span>
                  <p className="text-xs text-[#0A3323]/75 leading-relaxed">
                    {org.description}
                  </p>
                  <div className="pt-2 flex justify-center md:justify-start gap-4 text-[10px] text-[#0A3323]/60">
                    <span>Web: <a href={org.website} className="text-[#105666] hover:underline">{org.website.replace('https://', '')}</a></span>
                    <span>Tel: {org.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Surface>

      {/* 8. SUCCESS STORIES (TESTIMONIALS) - MOSS SURFACE */}
      <Surface tone="moss" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#062015] bg-[#062015]/10 px-3.5 py-1.5 rounded-full">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#062015] font-bold mt-4 mb-5">Stories of Change</h2>
            <p className="text-[#062015]/85 leading-relaxed">Real impact stories written by volunteers and organizations who have formed connections across GreenBridge.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "I joined my first plantation drive in Dehradun through GreenBridge. Not only did we plant native saplings, but I discovered a beautiful circle of friends who genuinely care about the valley. The visual impact tree is so motivating!",
                author: "Nikhil Rawat",
                role: "Student & Volunteer",
                avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60"
              },
              {
                quote: "As a small educational initiative, recruiting volunteers was always a struggle. GreenBridge connected us with over 15 verified tutors in just two weekends. The certificate issuing system makes acknowledging their help seamless.",
                author: "Mrs. Anjali Sen",
                role: "Director, Hope Foundation",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/90 border border-[#062015]/20 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <p className="font-serif italic text-[#062015] text-base leading-relaxed mb-6">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={item.avatar} 
                    alt={item.author} 
                    className="w-12 h-12 rounded-full aspect-square overflow-hidden object-cover object-center border border-[#062015]/20 flex-shrink-0"
                  />
                  <div>
                    <h5 className="font-serif font-bold text-[#062015] text-sm leading-none">{item.author}</h5>
                    <span className="text-[10px] text-[#062015]/75 font-semibold mt-1 block">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Surface>

      {/* 9. NEWSLETTER - MIDNIGHT SURFACE */}
      <Surface tone="midnight" className="py-16 px-6 text-center border-y border-[#F7F4D5]/15">
        <div className="max-w-2xl mx-auto space-y-6">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#F7F4D5] bg-[#062015]/15 px-3.5 py-1.5 rounded-full">Stay Connected</span>
          <h2 className="text-2xl md:text-4xl font-serif text-[#062015] font-bold mt-2">Subscribe to Weekly Impact Digests</h2>
          <p className="text-sm text-[#062015]/85 leading-relaxed max-w-md mx-auto">
            Get instant mail notifications when new volunteering campaigns, local events, or donation requests are posted in Dehradun.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you for subscribing! 💚");
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          >
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-1 px-5 py-3 border border-[#F7F4D5]/30 focus:border-[#F7F4D5] focus:outline-none rounded-full bg-[#0A3323] text-[#F7F4D5] text-sm"
            />
            <button 
              type="submit" 
              className="bg-[#D3968C] hover:bg-white text-[#0A3323] px-6 py-3 rounded-full font-bold text-sm transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </Surface>

      {/* 10. FINAL CTA - DEEP GREEN SURFACE */}
      <Surface tone="deep" className="py-24 px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 z-10 relative">
          <h2 className="text-4xl md:text-6xl font-serif text-[#062015] font-extrabold tracking-tight">Ready to Build a Better Tomorrow?</h2>
          <p className="text-lg text-[#062015]/85 max-w-xl mx-auto leading-relaxed">
            Volunteering doesn't mean changing the whole world. Just start by lending a helping hand in your local neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              to="/register" 
              className="bg-[#D3968C] hover:bg-white text-[#0A3323] px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg hover:-translate-y-0.5"
            >
              Join GreenBridge
            </Link>
            <Link 
              to="/login" 
              className="bg-[#D3968C] hover:bg-white text-[#0A3323] px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg hover:-translate-y-0.5"
            >
              Sign In to Your Workspace
            </Link>
          </div>
        </div>
      </Surface>
    </div>
  );
};

export default Landing;

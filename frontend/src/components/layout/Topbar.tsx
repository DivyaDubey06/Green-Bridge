import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Search, LogOut, User, Award, CheckCircle } from 'lucide-react';
import { useAuthStore, LEVEL_NAMES } from '../../store/useAuthStore';
import { Avatar } from '../common/Avatar';

interface TopbarProps {
  title: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    notifications, 
    markNotificationsAsRead, 
    logout,
    opportunities,
    events,
    donations
  } = useAuthStore();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    opportunities: typeof opportunities;
    events: typeof events;
    donations: typeof donations;
  }>({ opportunities: [], events: [], donations: [] });

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search Queries
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults({ opportunities: [], events: [], donations: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredOpps = opportunities.filter(o => 
      o.title.toLowerCase().includes(query) || o.category.toLowerCase().includes(query)
    ).slice(0, 3);

    const filteredEvents = events.filter(e => 
      e.title.toLowerCase().includes(query) || e.category.toLowerCase().includes(query)
    ).slice(0, 3);

    const filteredDonations = donations.filter(d => 
      d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query)
    ).slice(0, 3);

    setSearchResults({
      opportunities: filteredOpps,
      events: filteredEvents,
      donations: filteredDonations
    });
  }, [searchQuery, opportunities, events, donations]);

  if (!currentUser) return null;

  const unreadNotifications = notifications.filter(n => !n.read && n.userId === currentUser.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMarkAllRead = () => {
    markNotificationsAsRead();
  };

  const hasResults = 
    searchResults.opportunities.length > 0 || 
    searchResults.events.length > 0 || 
    searchResults.donations.length > 0;

  return (
    <header className="h-20 bg-white border-b border-[#CD9777]/20 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-dark-forest leading-none">{title}</h1>
        <p className="text-xs text-slate-text/50 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Global Search Bar */}
      <div ref={searchRef} className="relative w-96 hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search opportunities, events, donations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-warm-cream/50 hover:bg-warm-cream/80 focus:bg-white border border-[#CD9777]/20 focus:border-primary-green focus:outline-none rounded-full text-sm transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
        </div>

        {/* Search Results Dropdown */}
        {searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-[#CD9777]/20 shadow-xl max-h-96 overflow-y-auto z-50 p-4">
            {hasResults ? (
              <div className="space-y-4">
                {searchResults.opportunities.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-primary-green uppercase tracking-widest mb-1.5 px-2">Opportunities</h5>
                    {searchResults.opportunities.map(opp => (
                      <Link
                        key={opp.id}
                        to="/opportunities"
                        onClick={() => setSearchQuery('')}
                        className="block px-2 py-1.5 hover:bg-warm-cream rounded-xl text-sm text-slate-text transition-colors"
                      >
                        {opp.title} <span className="text-[10px] bg-soft-mint text-primary-green px-1.5 py-0.5 rounded-full ml-1">{opp.category}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.events.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-primary-green uppercase tracking-widest mb-1.5 px-2">Events</h5>
                    {searchResults.events.map(evt => (
                      <Link
                        key={evt.id}
                        to="/events"
                        onClick={() => setSearchQuery('')}
                        className="block px-2 py-1.5 hover:bg-warm-cream rounded-xl text-sm text-slate-text transition-colors"
                      >
                        {evt.title} <span className="text-[10px] bg-soft-sky text-blue-800 px-1.5 py-0.5 rounded-full ml-1">{evt.category}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.donations.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-primary-green uppercase tracking-widest mb-1.5 px-2">Donations</h5>
                    {searchResults.donations.map(don => (
                      <Link
                        key={don.id}
                        to="/donate"
                        onClick={() => setSearchQuery('')}
                        className="block px-2 py-1.5 hover:bg-warm-cream rounded-xl text-sm text-slate-text transition-colors"
                      >
                        {don.title} <span className="text-[10px] bg-watercolor-beige text-slate-700 px-1.5 py-0.5 rounded-full ml-1">{don.condition}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-slate-text/50">
                No matches found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Options */}
      <div className="flex items-center gap-6">
        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full border border-[#CD9777]/20 flex items-center justify-center text-slate-text/75 hover:bg-warm-cream hover:text-primary-green transition-all"
          >
            <Bell size={18} />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-leaf-green border-2 border-white rounded-full animate-pulse" />
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-[#CD9777]/20 shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-[#CD9777]/10 flex items-center justify-between">
                <span className="font-bold text-dark-forest">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-primary-green hover:text-dark-forest flex items-center gap-1"
                  >
                    <CheckCircle size={12} />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#CD9777]/5">
                {notifications.filter(n => n.userId === currentUser.id).length > 0 ? (
                  notifications
                    .filter(n => n.userId === currentUser.id)
                    .map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-4 transition-colors ${notif.read ? 'bg-white' : 'bg-soft-mint/10'}`}
                      >
                        <h6 className="text-xs font-bold text-dark-forest flex items-center justify-between">
                          {notif.title}
                          {!notif.read && <span className="w-1.5 h-1.5 bg-primary-green rounded-full" />}
                        </h6>
                        <p className="text-xs text-slate-text/80 mt-1">{notif.message}</p>
                        <span className="text-[9px] text-slate-text/45 mt-1 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-text/40">
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Avatar & Dropdown */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <Avatar config={currentUser.avatar} size={42} />
            <div className="text-left hidden lg:block">
              <span className="block text-sm font-bold text-dark-forest leading-tight hover:text-primary-green transition-colors">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-primary-green font-bold">
                Lvl {currentUser.level} • {LEVEL_NAMES[currentUser.level - 1] || 'Champion'}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-[#CD9777]/20 shadow-xl z-50 overflow-hidden">
              <div className="p-4 bg-warm-cream/50 border-b border-[#CD9777]/10 flex flex-col items-center text-center">
                <Avatar config={currentUser.avatar} size={64} className="mb-2" />
                <span className="font-bold text-dark-forest">{currentUser.name}</span>
                <span className="text-xs text-slate-text/60">{currentUser.email}</span>
                
                {/* Level Progress bar */}
                <div className="w-full mt-3">
                  <div className="flex justify-between text-[9px] font-bold text-slate-text/50 mb-1">
                    <span>Lvl {currentUser.level}</span>
                    <span>{currentUser.xp} / {currentUser.level * 500} XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#CD9777]/15 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-green transition-all duration-500"
                      style={{ width: `${(currentUser.xp / (currentUser.level * 500)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-2 space-y-0.5">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-text hover:bg-warm-cream hover:text-primary-green transition-colors"
                >
                  <User size={16} />
                  My Profile
                </Link>
                <Link
                  to="/my-impact"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-text hover:bg-warm-cream hover:text-primary-green transition-colors"
                >
                  <Award size={16} />
                  My Impact Dashboard
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Topbar;

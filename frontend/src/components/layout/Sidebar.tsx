import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Handshake, Calendar, Heart, Award, User, Settings, HelpCircle, LogOut, ShieldAlert, Building2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Logo } from '../common/Logo';

export const Sidebar: React.FC = () => {
  const { currentUser, currentOrg, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Opportunities', path: '/opportunities', icon: Handshake },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Donate', path: '/donate', icon: Heart },
    { name: 'My Impact', path: '/my-impact', icon: Award },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (!currentUser) return null;

  return (
    <aside className="w-64 bg-white dark:bg-[#1A211C] border-r border-[#CD9777]/20 dark:border-white/10 flex flex-col h-screen sticky top-0 z-20 transition-colors duration-300">
      {/* Sidebar Logo */}
      <div className="p-6 border-b border-[#CD9777]/10 dark:border-white/10 flex items-center justify-center">
        <NavLink to="/">
          <Logo size={36} showText={true} />
        </NavLink>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                isActive 
                  ? 'bg-soft-mint dark:bg-[#839958]/25 text-primary-green dark:text-[#F7F4D5] shadow-sm' 
                  : 'text-slate-text dark:text-[#F3F1E7]/80 hover:bg-warm-cream dark:hover:bg-[#222B24] hover:text-primary-green dark:hover:text-[#F7F4D5]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={18} 
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-primary-green dark:text-[#F7F4D5]' : 'text-slate-text/70 dark:text-[#F3F1E7]/60 group-hover:text-primary-green dark:group-hover:text-[#F7F4D5]'
                  }`} 
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Conditional Role-based Links (Admin and Org) */}
        {currentUser.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold border border-red-200/50 dark:border-red-900/40 mt-4 transition-all duration-200 group ${
                isActive 
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-[#D3968C] shadow-sm' 
                  : 'text-red-600 dark:text-[#D3968C]/80 hover:bg-red-50/50 dark:hover:bg-red-950/20'
              }`
            }
          >
            <ShieldAlert size={18} />
            <span>Admin Panel</span>
          </NavLink>
        )}

        {(currentUser.role === 'ORGANIZATION' || currentOrg?.verificationStatus === 'APPROVED') && (
          <NavLink
            to="/org-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold border border-primary-green/20 dark:border-[#839958]/30 mt-4 transition-all duration-200 group ${
                isActive 
                  ? 'bg-soft-mint dark:bg-[#839958]/25 text-primary-green dark:text-[#F7F4D5] shadow-sm' 
                  : 'text-primary-green dark:text-[#839958] hover:bg-soft-mint/30 dark:hover:bg-[#222B24]'
              }`
            }
          >
            <Building2 size={18} />
            <span>Org Dashboard</span>
          </NavLink>
        )}
      </nav>

      {/* Sidebar Footer Operations */}
      <div className="p-4 border-t border-[#CD9777]/10 dark:border-white/10 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
              isActive 
                ? 'bg-warm-cream dark:bg-[#222B24] text-primary-green dark:text-[#F7F4D5]' 
                : 'text-slate-text/70 dark:text-[#F3F1E7]/70 hover:bg-warm-cream/55 dark:hover:bg-[#222B24] hover:text-primary-green dark:hover:text-[#F7F4D5]'
            }`
          }
        >
          <Settings size={18} className="text-slate-text/50 dark:text-[#F3F1E7]/50 group-hover:text-primary-green dark:group-hover:text-[#F7F4D5]" />
          <span>Settings</span>
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
              isActive 
                ? 'bg-warm-cream dark:bg-[#222B24] text-primary-green dark:text-[#F7F4D5]' 
                : 'text-slate-text/70 dark:text-[#F3F1E7]/70 hover:bg-warm-cream/55 dark:hover:bg-[#222B24] hover:text-primary-green dark:hover:text-[#F7F4D5]'
            }`
          }
        >
          <HelpCircle size={18} className="text-slate-text/50 dark:text-[#F3F1E7]/50 group-hover:text-primary-green dark:group-hover:text-[#F7F4D5]" />
          <span>Help</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-semibold text-red-600 dark:text-[#D3968C] hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 group"
        >
          <LogOut size={18} className="text-red-400 group-hover:text-red-600 dark:group-hover:text-[#D3968C]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

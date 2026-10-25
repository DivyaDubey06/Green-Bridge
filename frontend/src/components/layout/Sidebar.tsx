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
    <aside className="w-64 bg-white border-r border-[#CD9777]/20 flex flex-col h-screen sticky top-0 z-20">
      {/* Sidebar Logo */}
      <div className="p-6 border-b border-[#CD9777]/10 flex items-center justify-center">
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
                  ? 'bg-soft-mint text-primary-green shadow-sm shadow-primary-green/5' 
                  : 'text-slate-text hover:bg-warm-cream hover:text-primary-green'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={18} 
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-primary-green' : 'text-slate-text/70 group-hover:text-primary-green'
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
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold border border-red-200/50 mt-4 transition-all duration-200 group ${
                isActive 
                  ? 'bg-red-50 text-red-700 shadow-sm' 
                  : 'text-red-600 hover:bg-red-50/50'
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
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold border border-primary-green/20 mt-4 transition-all duration-200 group ${
                isActive 
                  ? 'bg-soft-mint text-primary-green shadow-sm' 
                  : 'text-primary-green hover:bg-soft-mint/30'
              }`
            }
          >
            <Building2 size={18} />
            <span>Org Dashboard</span>
          </NavLink>
        )}
      </nav>

      {/* Sidebar Footer Operations */}
      <div className="p-4 border-t border-[#CD9777]/10 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
              isActive 
                ? 'bg-warm-cream text-primary-green' 
                : 'text-slate-text/70 hover:bg-warm-cream/55 hover:text-primary-green'
            }`
          }
        >
          <Settings size={18} className="text-slate-text/50 group-hover:text-primary-green" />
          <span>Settings</span>
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
              isActive 
                ? 'bg-warm-cream text-primary-green' 
                : 'text-slate-text/70 hover:bg-warm-cream/55 hover:text-primary-green'
            }`
          }
        >
          <HelpCircle size={18} className="text-slate-text/50 group-hover:text-primary-green" />
          <span>Help</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 group"
        >
          <LogOut size={18} className="text-red-400 group-hover:text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

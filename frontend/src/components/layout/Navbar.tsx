import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Logo } from '../common/Logo';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Events', path: '/events' },
    { name: 'Donate', path: '/donate' },
    { name: 'About', path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-warm-cream/90 backdrop-blur-md shadow-md shadow-dark-forest/5 py-3' 
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)}>
            <Logo size={isScrolled ? 36 : 42} />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group text-sm font-semibold tracking-wide transition-colors py-1"
                style={{ color: isActive(link.path) ? '#2E7D32' : '#2C2C2C' }}
              >
                {link.name}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary-green transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} 
                />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to={currentUser.role === 'ADMIN' ? '/admin' : currentUser.role === 'ORGANIZATION' ? '/org-dashboard' : '/dashboard'}
                  className="flex items-center gap-2 bg-primary-green hover:bg-dark-forest text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary-green/20 hover:-translate-y-0.5"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 border-2 border-[#CD9777]/30 hover:border-primary-green/50 text-slate-text hover:text-primary-green px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-text hover:text-primary-green font-semibold text-sm transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 bg-primary-green hover:bg-dark-forest text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary-green/20 hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-text p-2 hover:text-primary-green transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-[70px] bg-warm-cream z-40 flex flex-col md:hidden p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-5 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold tracking-wide py-2 border-b border-[#CD9777]/20"
                  style={{ color: isActive(link.path) ? '#2E7D32' : '#2C2C2C' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto mb-10 flex flex-col gap-4">
              {isAuthenticated && currentUser ? (
                <>
                  <Link
                    to={currentUser.role === 'ADMIN' ? '/admin' : currentUser.role === 'ORGANIZATION' ? '/org-dashboard' : '/dashboard'}
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center gap-2 bg-primary-green hover:bg-dark-forest text-white w-full py-4 rounded-2xl font-bold transition-all"
                  >
                    <LayoutDashboard size={20} />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex justify-center items-center gap-2 border-2 border-[#CD9777]/40 text-slate-text w-full py-3.5 rounded-2xl font-bold transition-all"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center border-2 border-primary-green/30 text-primary-green w-full py-3.5 rounded-2xl font-bold transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center gap-2 bg-primary-green text-white w-full py-4 rounded-2xl font-bold shadow-lg shadow-primary-green/10"
                  >
                    Get Started
                    <ArrowRight size={18} />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

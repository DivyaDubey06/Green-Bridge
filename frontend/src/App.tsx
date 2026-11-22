import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';

// Layouts
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

// Pages
import { Landing } from './pages/Landing/Landing';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Opportunities } from './pages/Opportunities/Opportunities';
import { Events } from './pages/Events/Events';
import { Donations } from './pages/Donations/Donations';
import { Impact } from './pages/Impact/Impact';
import { Profile } from './pages/Profile/Profile';
import { OrgDashboard } from './pages/Organization/OrgDashboard';
import { Admin } from './pages/Admin/Admin';
import { About } from './pages/About/About';
import { GreenCart } from './pages/Store/GreenCart';

// Common Animations
import { SplashScreen } from './components/common/SplashScreen';

// Public Layout wrapper (Navbar + Footer)
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Logged-in Dashboard Layout wrapper (Sidebar + Topbar)
const DashboardLayout: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading } = useAuthStore();
  const [pageTitle, setPageTitle] = useState('My Workspace');

  // Simple location-to-title mapping
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('my-impact')) setPageTitle('My Impact Tracker');
    else if (path.includes('profile')) setPageTitle('Citizen Profile');
    else if (path.includes('org-dashboard')) setPageTitle('Organization Workspace');
    else if (path.includes('admin')) setPageTitle('Admin Control Center');
    else setPageTitle('Dashboard');
  }, [window.location.pathname]);

  const token = localStorage.getItem('greenbridge_token') || sessionStorage.getItem('greenbridge_token');

  // If session verification is actively in progress and a token exists, display a graceful loading state
  if (isLoading && token && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--gb-bg-page)] text-[var(--gb-text-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold opacity-75">Verifying authentication session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--gb-bg-page)] text-[var(--gb-text-primary)] transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar />

      
      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={pageTitle} />
        <main className="flex-1 overflow-y-auto p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const initialize = useAuthStore(state => state.initialize);
  const refreshProfile = useAuthStore(state => state.refreshProfile);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const currentOrg = useAuthStore(state => state.currentOrg);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('greenbridge_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    initialize();
  }, [initialize]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const interval = setInterval(() => {
      refreshProfile();
    }, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshProfile]);

  const [showSplash, setShowSplash] = useState(() => {
    // Check if session splash already played
    const seen = sessionStorage.getItem('greenbridge_seen_splash');
    return !seen;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('greenbridge_seen_splash', 'true');
    setShowSplash(false);
  };

  return (
    <BrowserRouter>
      {/* Flash toast notifications wrapper */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'watercolor-card font-semibold text-xs',
          duration: 3500,
          style: {
            background: '#F8F7F2',
            color: '#2C2C2C',
            border: '1px solid rgba(205, 151, 119, 0.25)',
          },
        }}
      />
      
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <Routes>
          {/* Public Pages Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/events" element={<Events />} />
            <Route path="/donate" element={<Donations />} />
            <Route path="/store" element={<GreenCart />} />
            <Route path="/about" element={<About />} />
            {/* Fallbacks */}
            <Route path="/contact" element={<About />} />
            <Route path="/faqs" element={<About />} />
            <Route path="/privacy" element={<About />} />
            <Route path="/terms" element={<About />} />
          </Route>

          {/* Authentication Pages (Standalone) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Login />} />

          {/* Protected User Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-impact" element={<Impact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/org-dashboard" element={<OrgDashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="/help" element={<About />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;

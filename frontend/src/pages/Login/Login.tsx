import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dark mode hook
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      localStorage.getItem('greenbridge_theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('greenbridge_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('greenbridge_theme', 'light');
    }
  }, [isDark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 🌱`);
      
      setTimeout(() => {
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else if (user.role === 'ORGANIZATION') {
          navigate('/org-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Try sonaa@gmail.com / sonaa123');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* Left Pane: Branding & Illustration */}
      <div className="w-full lg:w-5/12 bg-[#FCDAB0] dark:bg-[#C29E75] flex flex-col items-center justify-center p-8 lg:p-16 transition-colors duration-300">
        <div className="max-w-sm flex flex-col items-center text-center">
          {/* Main Bridge Illustration */}
          <div className="w-full max-w-[280px] aspect-square flex items-center justify-center mb-6">
            <img 
              src="/assets/illustrations/bridge_hero.png" 
              alt="Green Bridge Illustration" 
              className="w-full h-full object-contain filter drop-shadow-xl"
            />
          </div>
          
          {/* Text labels (without hyphens) */}
          <h1 className="font-serif text-4xl font-extrabold text-[#0B2316] dark:text-[#0C1E16] tracking-wide">
            Green Bridge
          </h1>
          <p className="font-serif italic text-base text-[#0B2316]/90 dark:text-[#0C1E16]/85 mt-2 font-medium">
            Bring the change
          </p>
        </div>
      </div>

      {/* Right Pane: Soft Mint Green Watercolor Area */}
      <div className="w-full lg:w-7/12 bg-[#B8D8BE] dark:bg-[#0C1E16] flex flex-col justify-between p-8 relative transition-colors duration-300">
        
        {/* Top Header Controls (About, Contact Us, and Theme Toggle) */}
        <div className="flex justify-between items-center w-full mb-8">
          {/* Dark Mode toggle button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-full bg-white/20 dark:bg-white/5 hover:bg-white/40 dark:hover:bg-white/10 text-[#1C3E24] dark:text-[#A7F3D0] transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="flex items-center gap-8 text-xs font-bold tracking-wider text-[#1C3E24] dark:text-[#A7F3D0]">
            <Link to="/about" className="hover:opacity-80 transition-opacity">ABOUT US</Link>
            <Link to="/contact" className="hover:opacity-80 transition-opacity">CONTACT US</Link>
          </div>
        </div>

        {/* Center Card */}
        <div className="my-auto flex justify-center w-full px-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#132A1D] rounded-[32px] p-8 lg:p-10 shadow-2xl flex flex-col items-center border border-white/40 dark:border-white/5 transition-all">
            
            {/* Title */}
            <h2 className="font-serif text-3xl font-bold text-[#1C3E24] dark:text-[#A7F3D0] tracking-wide mb-8">
              USER LOGIN
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-5 flex flex-col items-center">
              
              {/* Username / Email field */}
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-center py-3.5 px-6 bg-[#8F995C] dark:bg-[#4C532F] placeholder-[#1C3E24]/60 dark:placeholder-[#A7F3D0]/50 text-[#1C3E24] dark:text-[#F8F7F2] font-semibold rounded-full outline-none border-none focus:ring-2 focus:ring-[#449D1E] transition-all text-sm shadow-inner"
                />
              </div>

              {/* Password field */}
              <div className="w-full">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-center py-3.5 px-6 bg-[#8F995C] dark:bg-[#4C532F] placeholder-[#1C3E24]/60 dark:placeholder-[#A7F3D0]/50 text-[#1C3E24] dark:text-[#F8F7F2] font-semibold rounded-full outline-none border-none focus:ring-2 focus:ring-[#449D1E] transition-all text-sm shadow-inner"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 text-xs text-[#1C3E24] dark:text-[#A7F3D0]/80 font-bold">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  className="rounded border-gray-300 dark:border-[#1B4332] text-[#449D1E] focus:ring-[#449D1E]"
                  defaultChecked 
                />
                <label htmlFor="rememberMe" className="cursor-pointer">Remember Me</label>
              </div>

              {/* Forgot Password */}
              <Link to="/forgot" className="text-xs font-extrabold text-[#1C3E24] dark:text-[#A7F3D0] hover:underline uppercase tracking-widest mt-1">
                FORGOT PASSWORD ?
              </Link>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-4/5 bg-[#449D1E] hover:bg-[#387F18] text-[#1C3E24] hover:text-white dark:text-[#0C1E16] dark:hover:text-white py-3.5 rounded-full font-bold text-base tracking-wider transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
              >
                {isSubmitting ? 'VERIFYING...' : 'LOGIN'}
              </button>

              {/* Create Account */}
              <Link 
                to="/register" 
                className="text-xs font-extrabold text-[#1C3E24] dark:text-[#A7F3D0] hover:underline mt-4 uppercase tracking-widest"
              >
                Create Account
              </Link>

            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs font-semibold text-white/95 dark:text-[#A7F3D0]/70 mt-8 tracking-wide">
          Connecting People Who Care.
        </div>
      </div>
    </div>
  );
};

export default Login;

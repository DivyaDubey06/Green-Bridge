import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Logo } from '../../components/common/Logo';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      // Play welcome transition
      setWelcomeUser(user.name);
      toast.success(`Welcome back, ${user.name}! 🌱`);
      
      setTimeout(() => {
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else if (user.role === 'ORGANIZATION') {
          navigate('/org-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Try sonaa@gmail.com / sonaa123');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-warm-cream">
      {/* Welcome Screen Overlay */}
      {welcomeUser && (
        <div className="fixed inset-0 bg-dark-forest/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center text-center p-6 text-white">
          <div className="w-28 h-28 mb-6 animate-float">
            <Logo size={80} showText={false} className="filter brightness-110" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            Welcome back, {welcomeUser} 🌱
          </h2>
          <p className="text-soft-mint text-sm tracking-widest uppercase font-semibold">
            Connecting People Who Care.
          </p>
        </div>
      )}

      {/* Left Side: Brand Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-forest text-warm-cream p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative SVG curves */}
        <div className="absolute inset-0 select-none pointer-events-none opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-warm-cream" strokeWidth="0.5">
            <path d="M-10 100C40 90 60 40 110 0" />
            <path d="M-10 80C30 75 50 35 110 -20" />
          </svg>
        </div>

        <Logo size={48} showText={true} className="filter brightness-110" />

        <div className="space-y-6 z-10 max-w-md my-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
            Bring the Change.
          </h2>
          <p className="text-sm text-warm-cream/70 leading-relaxed">
            Join a warm community of citizens, verified local clubs, and organizations working together to create visible positive changes in their neighborhoods.
          </p>
          
          <div className="pt-6 relative">
            <img 
              src="/assets/illustrations/nature_girl.jpg" 
              alt="Nature Illustration" 
              className="w-full rounded-[30px] border border-white/10 shadow-2xl shadow-black/40 object-cover aspect-[4/3]"
            />
          </div>
        </div>

        <div className="text-xs text-warm-cream/50 z-10">
          Connecting People Who Care.
        </div>
      </div>

      {/* Right Side: Centered Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md watercolor-card p-10 shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-dark-forest mb-2">USER LOGIN</h3>
            <p className="text-xs text-slate-text/60 leading-relaxed">
              Join thousands of volunteers creating change in their communities.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-dark-forest/70 block px-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-warm-cream/40 border border-[#CD9777]/25 focus:border-primary-green focus:bg-white focus:outline-none rounded-2xl text-sm transition-all"
                />
                <Mail size={16} className="absolute left-4 top-4 text-slate-text/45" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-dark-forest/70 block">Password</label>
                <Link to="/forgot" className="text-xs font-semibold text-primary-green hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-warm-cream/40 border border-[#CD9777]/25 focus:border-primary-green focus:bg-white focus:outline-none rounded-2xl text-sm transition-all"
                />
                <Lock size={16} className="absolute left-4 top-4 text-slate-text/45" />
              </div>
            </div>

            {/* Quick Demo Credentials Reminder */}
            <div className="p-3 bg-soft-mint/20 border border-primary-green/10 rounded-xl text-[10px] text-primary-green leading-relaxed">
              <strong>💡 Demo Logins:</strong><br />
              • Citizen: <code className="font-mono">sonaa@gmail.com</code> / <code className="font-mono">sonaa123</code><br />
              • Admin: <code className="font-mono">admin@greenbridge.org</code> / <code className="font-mono">admin123</code>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-green hover:bg-dark-forest text-white py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-8 pt-6 border-t border-[#CD9777]/10 text-xs">
            <span className="text-slate-text/50">New here?</span>{' '}
            <Link to="/register" className="font-bold text-primary-green hover:underline">
              Create your GreenBridge account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;

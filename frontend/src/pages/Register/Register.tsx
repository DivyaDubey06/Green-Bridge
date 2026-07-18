import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Sparkles, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../../components/common/Avatar';
import { AvatarConfig } from '../../types';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('Dehradun');
  const [state, setState] = useState('Uttarakhand');
  const [availability, setAvailability] = useState('Flexible');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Avatar Customizer State
  const [avatar, setAvatar] = useState<AvatarConfig>({
    hair: 'style-1',
    eyes: 'happy',
    skin: '#F5CBA7',
    clothing: '#2E7D32',
    accessory: 'none',
  });

  const interestOptions = [
    { label: '🌲 Environment', value: 'Environment' },
    { label: '📚 Education', value: 'Education' },
    { label: '🩸 Healthcare', value: 'Healthcare' },
    { label: '🐶 Animals', value: 'Animals' },
    { label: '🤝 Community Support', value: 'Community' },
  ];

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      toast.error('You must accept the Terms & Conditions.');
      return;
    }

    try {
      await register({
        name,
        email,
        city,
        state,
        avatar,
        interests: selectedInterests,
        availability,
      });

      toast.success('Account created successfully! Welcome! 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 flex items-center justify-center bg-warm-cream">
      <div className="w-full max-w-5xl watercolor-card p-8 md:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left 5 Columns: Avatar Customizer */}
        <div className="lg:col-span-5 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-[#CD9777]/25 pb-8 lg:pb-0 lg:pr-8">
          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl font-bold text-dark-forest flex items-center gap-1.5 justify-center">
              <Sparkles size={20} className="text-primary-green" />
              Customize Avatar
            </h3>
            <p className="text-xs text-slate-text/65 mt-1">Design your personal community profile identity</p>
          </div>

          {/* Avatar Preview */}
          <div className="relative p-6 bg-white/50 rounded-full border-2 border-[#CD9777]/20 shadow-inner mb-8">
            <Avatar config={avatar} size={150} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary-green text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
              Citizen Profile
            </span>
          </div>

          {/* Avatar Options panel */}
          <div className="w-full space-y-4 text-xs font-semibold">
            {/* Hair Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-text/50">Hair Style</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'style-1', label: 'Swept' },
                  { id: 'style-2', label: 'Wavy' },
                  { id: 'style-3', label: 'Bun' },
                  { id: 'style-4', label: 'Spiky' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, hair: item.id })}
                    className={`py-2 rounded-xl border text-center transition-all ${
                      avatar.hair === item.id 
                        ? 'bg-soft-mint text-primary-green border-primary-green font-bold' 
                        : 'bg-white border-[#CD9777]/20 hover:border-primary-green/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Eyes Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-text/50">Eyes Expression</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'happy', label: '😊 Happy' },
                  { id: 'neutral', label: '😐 Dot' },
                  { id: 'sparkle', label: '✨ Spark' },
                  { id: 'glasses', label: '👓 Glass' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, eyes: item.id })}
                    className={`py-2 rounded-xl border text-center transition-all ${
                      avatar.eyes === item.id 
                        ? 'bg-soft-mint text-primary-green border-primary-green font-bold' 
                        : 'bg-white border-[#CD9777]/20 hover:border-primary-green/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Colors */}
            <div className="space-y-1.5">
              <label className="text-slate-text/50">Skin Tone</label>
              <div className="flex gap-3 justify-between">
                {[
                  { color: '#F5CBA7', name: 'Fair' },
                  { color: '#FAD7A0', name: 'Cream' },
                  { color: '#F5B041', name: 'Tan' },
                  { color: '#D35400', name: 'Brown' },
                ].map(item => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, skin: item.color })}
                    className="flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all text-[10px]"
                    style={{ 
                      backgroundColor: item.color,
                      borderColor: avatar.skin === item.color ? '#1B4332' : 'transparent',
                      borderWidth: avatar.skin === item.color ? '2px' : '1px',
                      color: item.color === '#D35400' ? '#FFF' : '#2C2C2C'
                    }}
                  >
                    {avatar.skin === item.color && <Check size={10} />}
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Shirt Colors */}
            <div className="space-y-1.5">
              <label className="text-slate-text/50">Clothing Color</label>
              <div className="flex gap-3 justify-between">
                {[
                  { color: '#2E7D32', name: 'Green' },
                  { color: '#1A5276', name: 'Blue' },
                  { color: '#E67E22', name: 'Orange' },
                  { color: '#7D3C98', name: 'Purple' },
                ].map(item => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, clothing: item.color })}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer"
                    style={{ 
                      backgroundColor: item.color,
                      borderColor: avatar.clothing === item.color ? '#FFF' : 'transparent',
                      boxShadow: avatar.clothing === item.color ? '0 0 0 2px #1B4332' : 'none'
                    }}
                  >
                    {avatar.clothing === item.color && <Check size={12} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div className="space-y-1.5">
              <label className="text-slate-text/50">Accessory Items</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'cap', label: 'Cap' },
                  { id: 'backpack', label: 'Bag' },
                  { id: 'plant-leaf', label: 'Leaf' },
                  { id: 'tshirt-badge', label: 'Badge' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, accessory: item.id })}
                    className={`py-2 rounded-lg border text-center transition-all text-[10px] ${
                      avatar.accessory === item.id 
                        ? 'bg-soft-mint text-primary-green border-primary-green font-bold' 
                        : 'bg-white border-[#CD9777]/20 hover:border-primary-green/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Columns: Registration Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-dark-forest">Create Account</h3>
            <p className="text-xs text-slate-text/60 mt-1">Register once and join active volunteering campaigns, local events, or donation loops.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#CD9777]/20 focus:border-primary-green focus:outline-none rounded-xl text-sm transition-all"
                  />
                  <User size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#CD9777]/20 focus:border-primary-green focus:outline-none rounded-xl text-sm transition-all"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
                </div>
              </div>
            </div>

            {/* Password and Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Password (6+ chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#CD9777]/20 focus:border-primary-green focus:outline-none rounded-xl text-sm transition-all"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#CD9777]/20 focus:border-primary-green focus:outline-none rounded-xl text-sm transition-all"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
                </div>
              </div>
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">City</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dehradun"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#CD9777]/20 focus:border-primary-green focus:outline-none rounded-xl text-sm transition-all"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/75 block">State</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uttarakhand"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#CD9777]/20 focus:border-primary-green focus:outline-none rounded-xl text-sm transition-all"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-text/40" />
                </div>
              </div>
            </div>

            {/* Availability & Interests */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-text/75 block">Weekly Availability</label>
                <div className="flex gap-4">
                  {['Weekends', 'Weekdays', 'Flexible'].map(item => (
                    <label key={item} className="flex items-center gap-2 text-xs font-semibold text-slate-text cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value={item}
                        checked={availability === item}
                        onChange={() => setAvailability(item)}
                        className="text-primary-green focus:ring-primary-green h-4.5 w-4.5 rounded-full border-gray-300"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-text/75 block">Causes You Support</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((item) => {
                    const isSelected = selectedInterests.includes(item.value);
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => handleInterestToggle(item.value)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-primary-green text-white shadow-sm'
                            : 'bg-white text-slate-text/80 border border-[#CD9777]/20 hover:border-primary-green/30'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-text/70 leading-relaxed cursor-pointer">
                I accept the <a href="/terms" className="text-primary-green font-semibold hover:underline">Terms & Conditions</a> and declare that my contributions will represent helpful, peace-focused intentions.
              </label>
            </div>

            {/* Register button */}
            <button
              type="submit"
              className="w-full bg-primary-green hover:bg-dark-forest text-white py-4 rounded-2xl font-bold transition-all hover:shadow-lg shadow-primary-green/10 flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            >
              Create Account
              <Sparkles size={16} />
            </button>
          </form>

          <div className="text-center pt-4 border-t border-[#CD9777]/10 text-xs">
            <span className="text-slate-text/50">Already have an account?</span>{' '}
            <Link to="/login" className="font-bold text-primary-green hover:underline">
              Sign In &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Register;

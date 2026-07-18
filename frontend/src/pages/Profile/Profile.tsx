import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, MapPin, Calendar, Heart, ShieldAlert, Sparkles, Building2, CheckCircle2, ChevronRight, Upload, Globe, FileText 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../../components/common/Avatar';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentOrg, registerOrganization, updateProfile, organizations } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState('Passionate about clean rivers and helping local schools.');
  const [city, setCity] = useState(currentUser?.city || '');
  const [state, setState] = useState(currentUser?.state || '');
  const [skills, setSkills] = useState<string[]>(['Gardening', 'Social Media', 'Communication']);

  // Org registration modal states
  const [showOrgReg, setShowOrgReg] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [orgForm, setOrgForm] = useState({
    name: '',
    description: '',
    mission: '',
    category: 'Environment',
    website: '',
    phone: '',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60',
    govRegNo: '',
    registrationCertificate: 'cert.pdf',
  });

  if (!currentUser) return null;

  // Retrieve user org if any
  const userOrg = organizations.find(o => o.ownerId === currentUser.id);

  const handleSaveProfile = () => {
    updateProfile({ name, city, state });
    setIsEditing(false);
    toast.success('Profile updated successfully! 🌱');
  };

  const handleOrgRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerOrganization({
        organizationName: orgForm.name,
        description: orgForm.description,
        mission: orgForm.mission,
        category: orgForm.category,
        website: orgForm.website,
        phone: orgForm.phone,
        logo: orgForm.logo,
        registrationCertificate: orgForm.registrationCertificate,
      });
      toast.success('Organization application submitted! Pending verification. 🏢');
      setShowOrgReg(false);
      setRegStep(1);
      // Reset form
      setOrgForm({
        name: '',
        description: '',
        mission: '',
        category: 'Environment',
        website: '',
        phone: '',
        logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60',
        govRegNo: '',
        registrationCertificate: 'cert.pdf',
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application.');
    }
  };

  const handleAddSkill = () => {
    const s = prompt('Enter a new skill (e.g. Cooking, First Aid):');
    if (s && s.trim().length > 0) {
      setSkills([...skills, s.trim()]);
    }
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-dark-forest">Profile Settings</h2>
        <p className="text-xs text-slate-text/60 mt-1">Manage your identity and organization connections on GreenBridge.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 4 Columns: Identity Overview */}
        <div className="lg:col-span-4 bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm flex flex-col items-center text-center">
          <Avatar config={currentUser.avatar} size={110} className="mb-4" />
          <h3 className="font-serif text-xl font-bold text-dark-forest">{currentUser.name}</h3>
          <span className="text-xs font-semibold text-slate-text/50">{currentUser.email}</span>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-[10px] bg-soft-mint text-primary-green px-2.5 py-1 rounded-full font-bold">
              Level {currentUser.level} Contributor
            </span>
            <span className="text-[10px] bg-[#F5DFC0]/45 text-amber-800 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>

          <div className="w-full border-t border-[#CD9777]/10 pt-6 mt-6 space-y-4 text-left text-xs">
            <div className="flex items-center gap-2 text-slate-text/75">
              <MapPin size={14} className="text-primary-green" />
              <span>{currentUser.city}, {currentUser.state}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-text/75">
              <Calendar size={14} className="text-primary-green" />
              <span>Availability: <strong className="font-semibold text-dark-forest">{currentUser.availability}</strong></span>
            </div>
          </div>
        </div>

        {/* Right 8 Columns: Info Forms & Org Manager */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* User profile form card */}
          <div className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#CD9777]/10 pb-4">
              <h4 className="font-serif text-lg font-bold text-dark-forest">Personal Information</h4>
              <button
                onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                className="bg-primary-green hover:bg-dark-forest text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
              >
                {isEditing ? 'Save Details' : 'Edit Details'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/60">Display Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm disabled:opacity-60 focus:border-primary-green focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/60">Email Address</label>
                <input
                  type="email"
                  disabled={true}
                  value={currentUser.email}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm opacity-60 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/60">City</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm disabled:opacity-60 focus:border-primary-green focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-text/60">State</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm disabled:opacity-60 focus:border-primary-green focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold text-slate-text/60">Short Bio</label>
              <textarea
                disabled={!isEditing}
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm disabled:opacity-60 focus:border-primary-green focus:outline-none resize-none"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-text/60 block">My Volunteer Skills</label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-[#CD9777]/10 text-slate-text px-3 py-1.5 rounded-full font-bold">
                    {skill}
                  </span>
                ))}
                {isEditing && (
                  <button 
                    onClick={handleAddSkill}
                    className="text-xs border border-dashed border-primary-green/50 text-primary-green px-3 py-1 rounded-full font-bold hover:bg-soft-mint/10 transition-colors"
                  >
                    + Add Skill
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Organization manager card */}
          <div className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
            <div className="border-b border-[#CD9777]/10 pb-4 flex justify-between items-center">
              <div>
                <h4 className="font-serif text-lg font-bold text-dark-forest">Organization Verification</h4>
                <p className="text-[10px] text-slate-text/60 mt-0.5">Apply to publish volunteering opportunities and issue certificates.</p>
              </div>
              <Building2 size={24} className="text-[#CD9777]" />
            </div>

            {userOrg ? (
              <div className="p-5 bg-warm-cream/35 border border-[#CD9777]/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={userOrg.logo} 
                    alt={userOrg.organizationName} 
                    className="w-12 h-12 object-cover rounded-xl border border-[#CD9777]/20"
                  />
                  <div>
                    <h5 className="font-bold text-dark-forest text-sm">{userOrg.organizationName}</h5>
                    <span className="text-[10px] text-[#CD9777] block">{userOrg.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {userOrg.verificationStatus === 'APPROVED' ? (
                    <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200 shadow-sm">
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                  ) : userOrg.verificationStatus === 'PENDING' ? (
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
                      Pending Review
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                      Declined
                    </span>
                  )}
                  {userOrg.verificationStatus === 'APPROVED' && (
                    <button
                      onClick={() => navigate('/org-dashboard')}
                      className="bg-primary-green hover:bg-dark-forest text-white text-xs font-bold px-4 py-2 rounded-full transition-all"
                    >
                      Dashboard
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-warm-cream/25 border border-dashed border-[#CD9777]/20 rounded-3xl text-center space-y-4">
                <p className="text-xs text-slate-text/75 leading-relaxed max-w-md mx-auto">
                  Are you representing a verified NGO, community club, or social initiative? Apply today to list volunteer drives and events on GreenBridge.
                </p>
                <button
                  onClick={() => setShowOrgReg(true)}
                  className="bg-primary-green hover:bg-dark-forest text-white text-xs font-bold px-6 py-3 rounded-full transition-all flex items-center gap-1.5 mx-auto shadow-sm"
                >
                  Register Your Organization
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Multi-step Registration Modal */}
      {showOrgReg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border border-[#CD9777]/20 rounded-[36px] shadow-2xl p-8 relative flex flex-col max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowOrgReg(false);
                setRegStep(1);
              }}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-warm-cream text-slate-text hover:text-primary-green flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-[10px] text-primary-green font-extrabold uppercase tracking-widest block mb-1">
                Step {regStep} of 4
              </span>
              <h3 className="font-serif text-xl font-bold text-dark-forest leading-none">
                {regStep === 1 && 'Basic Information'}
                {regStep === 2 && 'Government Verification'}
                {regStep === 3 && 'Details & Mission'}
                {regStep === 4 && 'Declaration & Submission'}
              </h3>
            </div>

            {/* Steps Form */}
            <form onSubmit={handleOrgRegSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              {/* Step 1: Basic Info */}
              {regStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-text/70 block">Organization Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Care & Share Foundation"
                      value={orgForm.name}
                      onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-text/70 block">Category</label>
                    <select
                      value={orgForm.category}
                      onChange={(e) => setOrgForm({ ...orgForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                    >
                      <option value="Environment">🌲 Environment</option>
                      <option value="Education">📚 Education</option>
                      <option value="Healthcare">🩸 Healthcare</option>
                      <option value="Animals">🐶 Animals</option>
                      <option value="Community">🤝 Community</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-text/70 block">Phone Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 9876543210"
                        value={orgForm.phone}
                        onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-text/70 block">Website URL</label>
                      <input
                        type="url"
                        placeholder="e.g. https://myorg.org"
                        value={orgForm.website}
                        onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                        className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Verification Details */}
              {regStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-text/70 block">Government Registration Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DDN/NGO/10294-2025"
                      value={orgForm.govRegNo}
                      onChange={(e) => setOrgForm({ ...orgForm, govRegNo: e.target.value })}
                      className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none"
                    />
                  </div>

                  {/* Dummy Certificate Upload layout */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-text/70 block">Registration Certificate (PDF Upload)</label>
                    <div className="border-2 border-dashed border-[#CD9777]/20 hover:border-primary-green/40 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer bg-warm-cream/10 transition-colors">
                      <Upload size={24} className="text-[#CD9777] mb-2" />
                      <span className="text-xs font-bold text-slate-text">Drag and drop file here, or click to upload</span>
                      <span className="text-[10px] text-slate-text/50 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Mission Statement */}
              {regStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-text/70 block">About Organization</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="A short overview of what your organization does."
                      value={orgForm.description}
                      onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-text/70 block">Mission Statement</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Providing emergency relief and plantation cover in local hills."
                      value={orgForm.mission}
                      onChange={(e) => setOrgForm({ ...orgForm, mission: e.target.value })}
                      className="w-full px-4 py-2.5 bg-warm-cream/35 border border-[#CD9777]/20 rounded-xl text-sm focus:border-primary-green focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review Declaration */}
              {regStep === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-soft-mint/20 border border-primary-green/10 rounded-2xl space-y-2 text-xs">
                    <span className="font-bold text-primary-green block">Review Summary:</span>
                    <p className="text-slate-text/70">
                      <strong>Name:</strong> {orgForm.name}<br />
                      <strong>Category:</strong> {orgForm.category}<br />
                      <strong>Reg No:</strong> {orgForm.govRegNo || 'Mock-Registration-001'}<br />
                      <strong>Contact:</strong> {orgForm.phone}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#F5DFC0]/20 border border-[#CD9777]/10 rounded-2xl text-xs space-y-3">
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <ShieldAlert size={14} />
                      Declaration:
                    </span>
                    <p className="text-[10px] text-slate-text/70 leading-relaxed">
                      I hereby declare that this organization is legally registered, conducts peace-oriented community service, and that all uploaded documentation is authentic. I agree to GreenBridge manual moderator checks.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation buttons inside footer */}
              <div className="flex gap-4 pt-4 border-t border-[#CD9777]/10">
                {regStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setRegStep(regStep - 1)}
                    className="flex-1 py-3 border border-[#CD9777]/30 hover:border-primary-green text-xs font-bold rounded-2xl text-slate-text transition-colors"
                  >
                    Previous
                  </button>
                )}
                {regStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (regStep === 1 && !orgForm.name) {
                        toast.error('Organization Name is required.');
                        return;
                      }
                      if (regStep === 2 && !orgForm.govRegNo) {
                        toast.error('Gov Registration Number is required.');
                        return;
                      }
                      if (regStep === 3 && (!orgForm.description || !orgForm.mission)) {
                        toast.error('Description and Mission are required.');
                        return;
                      }
                      setRegStep(regStep + 1);
                    }}
                    className="flex-1 py-3 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1"
                  >
                    Submit Application
                    <CheckCircle2 size={14} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Profile;

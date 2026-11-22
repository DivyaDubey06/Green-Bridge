import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Building2, Check, X, Trash2, Heart, ShieldAlert, FileSpreadsheet, Globe, MapPin, Store, Camera, Mail,
  TrendingUp, Sparkles, Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const Admin: React.FC = () => {
  const [filterType, setFilterType] = useState<'ALL' | 'ORG' | 'DON' | 'VENDOR' | 'EXPERIENCE' | 'LETTER'>('ALL');
  const { 
    currentUser, 
    isLoading,
    organizations, 
    donations, 
    users,
    vendors,
    experiences,
    letters, 
    adminApproveOrg, 
    adminRejectOrg, 
    adminDeleteDonation,
    adminApproveVendor,
    adminRejectVendor,
    adminApproveExperience,
    adminRejectExperience,
    adminApproveLetter,
    adminRejectLetter,
    adminAnalytics,
    fetchAdminAnalytics
  } = useAuthStore();

  useEffect(() => {
    fetchAdminAnalytics();
  }, [fetchAdminAnalytics]);

  const token = localStorage.getItem('greenbridge_token') || sessionStorage.getItem('greenbridge_token');

  if (isLoading && token && (!currentUser || currentUser.role !== 'ADMIN')) {
    return (
      <div className="text-center py-20 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 rounded-[40px] max-w-xl mx-auto space-y-4 animate-pulse">
        <ShieldCheck size={48} className="text-primary-green mx-auto animate-bounce" />
        <h3 className="font-serif text-2xl font-bold text-dark-forest dark:text-[#F7F4D5]">Verifying Administrator Session...</h3>
        <p className="text-sm text-slate-text/75 dark:text-[#F7F4D5]/70 max-w-sm mx-auto">
          Please wait while administrative privileges and security credentials are confirmed.
        </p>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="text-center py-20 bg-white dark:bg-[#1A211C] border border-red-200/20 rounded-[40px] max-w-xl mx-auto space-y-4">
        <ShieldAlert size={48} className="text-red-500 mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-dark-forest dark:text-[#F7F4D5]">Access Restricted</h3>
        <p className="text-sm text-slate-text/75 dark:text-[#F7F4D5]/70 max-w-sm mx-auto">
          This portal is reserved for site moderators and system administrators. Please log in with admin credentials to continue.
        </p>
      </div>
    );
  }

  // Filter collections
  const pendingOrgs = organizations.filter(o => o.verificationStatus === 'PENDING');
  const approvedOrgsCount = organizations.filter(o => o.verificationStatus === 'APPROVED').length;
  const pendingVendors = vendors.filter(v => v.verificationStatus === 'PENDING');
  const pendingExperiences = experiences.filter(e => e.status === 'PENDING');
  const pendingLetters = letters.filter(l => l.status === 'PENDING');

  const handleApproveOrg = (orgId: string) => {
    adminApproveOrg(orgId);
    toast.success('Organization approved! 🏢');
    fetchAdminAnalytics();
  };

  const handleRejectOrg = (orgId: string) => {
    adminRejectOrg(orgId);
    toast.error('Organization application declined.');
    fetchAdminAnalytics();
  };

  const handleApproveVendor = (vendorId: string) => {
    adminApproveVendor(vendorId);
    toast.success('Small Business Vendor approved for GreenCart! 🛍️');
    fetchAdminAnalytics();
  };

  const handleRejectVendor = (vendorId: string) => {
    adminRejectVendor(vendorId);
    toast.error('Vendor application declined.');
    fetchAdminAnalytics();
  };

  const handleApproveExperience = (expId: string) => {
    adminApproveExperience(expId);
    toast.success('Event experience approved for Photobooth Gallery! 📸');
    fetchAdminAnalytics();
  };

  const handleRejectExperience = (expId: string) => {
    adminRejectExperience(expId);
    toast.error('Event experience declined.');
    fetchAdminAnalytics();
  };

  const handleApproveLetter = (letterId: string) => {
    adminApproveLetter(letterId);
    toast.success('Community letter approved! 💌');
    fetchAdminAnalytics();
  };

  const handleRejectLetter = (letterId: string) => {
    adminRejectLetter(letterId);
    toast.error('Letter declined.');
    fetchAdminAnalytics();
  };

  const handleDeleteDonation = (donationId: string) => {
    if (window.confirm('Are you sure you want to delete this donation listing as inappropriate?')) {
      adminDeleteDonation(donationId);
      toast.success('Donation listing deleted.');
      fetchAdminAnalytics();
    }
  };

  return (
    <div className="space-y-8 p-1">
      {/* 1. ADMIN HEADER */}
      <div className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-8 rounded-[36px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="font-serif text-3xl font-bold text-dark-forest dark:text-[#F7F4D5] flex items-center gap-2">
            <ShieldCheck className="text-primary-green dark:text-[#839958]" size={32} />
            Administrator Control Center
          </h2>
          <p className="text-xs text-slate-text/60 dark:text-[#F3F1E7]/60 mt-1">
            System moderation, organization verifications, small business onboarding, and community impact telemetry.
          </p>
        </div>
        <span className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-[#D3968C] px-4 py-1.5 rounded-full text-xs font-bold border border-red-200 dark:border-red-900/40">
          Admin Privilege Level 10
        </span>
      </div>

      {/* 2. PLATFORM IMPACT TELEMETRY & RECHARTS GROWTH CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-primary-green dark:text-[#839958]">
                <TrendingUp size={12} />
                Platform Growth Telemetry
              </div>
              <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5]">
                Monthly Active Citizens & Community Campaigns
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-primary-green dark:text-[#839958]">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-green inline-block" />
                Active Citizens
              </span>
              <span className="flex items-center gap-1 text-[#105666] dark:text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#105666] inline-block" />
                Campaigns
              </span>
            </div>
          </div>

          <div className="h-60 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminAnalytics?.monthlyPlatformGrowth || [
                { month: 'Nov', users: 20, opportunities: 3 },
                { month: 'Dec', users: 35, opportunities: 6 },
                { month: 'Jan', users: 52, opportunities: 9 },
                { month: 'Feb', users: 70, opportunities: 13 },
                { month: 'Mar', users: 95, opportunities: 18 },
                { month: 'Apr', users: 128, opportunities: 24 }
              ]}>
                <defs>
                  <linearGradient id="colorAdminUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#839958" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,51,35,0.08)" />
                <XAxis dataKey="month" stroke="#738075" fontSize={11} tickLine={false} />
                <YAxis stroke="#738075" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A211C', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    color: '#F7F4D5',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="users" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminUsers)" name="Registered Citizens" />
                <Area type="monotone" dataKey="opportunities" stroke="#105666" strokeWidth={2} fillOpacity={0} name="Active Campaigns" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[#CD9777]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-text/50 dark:text-[#F3F1E7]/50 text-[11px]">System Status:</span>
            <span className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Database Engine Operational • File-Backed JSON Mode Active
            </span>
          </div>
        </div>

        {/* Right 4 Columns: Verified Platform Totals */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-6 rounded-[36px] shadow-sm flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#839958]">
              <Sparkles size={12} />
              Aggregated Impact
            </div>
            <h4 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5]">
              Society Impact Metrics
            </h4>

            <div className="space-y-3 pt-2">
              {[
                { label: 'Estimated Volunteer Hours', value: `${adminAnalytics?.impactMetrics.estimatedVolunteerHours || 480} hrs`, icon: Activity, color: 'text-primary-green dark:text-[#839958]' },
                { label: 'Native Trees Planted', value: `${adminAnalytics?.impactMetrics.treesPlanted || 210}`, icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Items Re-donated', value: `${adminAnalytics?.impactMetrics.itemsDonated || donations.length + 15}`, icon: Heart, color: 'text-rose-600 dark:text-[#D3968C]' },
                { label: 'Active Valley Cities', value: `${adminAnalytics?.impactMetrics.activeCities || 6}`, icon: MapPin, color: 'text-blue-600 dark:text-cyan-400' },
              ].map((m, idx) => (
                <div key={idx} className="p-3.5 bg-warm-cream/40 dark:bg-[#121713] rounded-2xl border border-[#CD9777]/10 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <m.icon size={16} className={m.color} />
                    <span className="text-xs font-semibold text-slate-text/70 dark:text-[#F3F1E7]/70">{m.label}</span>
                  </div>
                  <span className="font-bold text-dark-forest dark:text-[#F7F4D5] text-sm">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#CD9777]/10 dark:border-white/10 text-center">
            <span className="text-[11px] text-slate-text/50 dark:text-[#F3F1E7]/50">
              Verified by GreenBridge Auditing Engine
            </span>
          </div>
        </div>
      </div>

      {/* FILTER DROPDOWN */}
      <div className="flex items-center gap-3 mt-4 bg-warm-cream/50 dark:bg-[#1A211C] p-4 rounded-2xl border border-[#CD9777]/20 dark:border-white/10 transition-colors">
        <label htmlFor="admin-filter" className="font-bold text-xs uppercase tracking-wider text-dark-forest dark:text-[#F7F4D5]">Filter Queue Type:</label>
        <select
          id="admin-filter"
          value={filterType}
          onChange={e => setFilterType(e.target.value as any)}
          className="rounded-xl border border-[#CD9777]/30 dark:border-white/10 bg-white dark:bg-[#121713] px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-green text-dark-forest dark:text-[#F7F4D5]"
        >
          <option value="ALL">All Queue Types</option>
          <option value="ORG">Organization Reviews ({pendingOrgs.length})</option>
          <option value="DON">Donation Moderation ({donations.length})</option>
          <option value="VENDOR">Small Business Vendors ({pendingVendors.length})</option>
          <option value="EXPERIENCE">Event Experiences ({pendingExperiences.length})</option>
          <option value="LETTER">Community Letters ({pendingLetters.length})</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Registered Citizens', value: users.length, icon: Users, color: 'text-primary-green bg-green-50 dark:bg-green-950/30' },
          { label: 'Verified Organizations', value: approvedOrgsCount, icon: Building2, color: 'text-blue-700 bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Pending Vendors', value: pendingVendors.length, icon: Store, color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Pending Experiences', value: pendingExperiences.length, icon: Camera, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/30' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-5 rounded-3xl shadow-sm flex items-center gap-4 transition-colors">
            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0`}>
              <item.icon size={22} />
            </div>
            <div>
              <span className="text-2xl font-black text-dark-forest dark:text-[#F7F4D5] leading-none block">{item.value}</span>
              <span className="text-xs font-semibold text-slate-text/50 dark:text-[#839958] mt-1 block">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 1. ORGANIZATION REVIEWS */}
      {(filterType === 'ALL' || filterType === 'ORG') && (
        <section className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] border-b border-[#CD9777]/10 dark:border-white/10 pb-4 flex items-center justify-between">
            <span>Pending Organization Reviews ({pendingOrgs.length})</span>
            <span className="text-xs font-sans text-slate-text/50 dark:text-[#F3F1E7]/50 font-normal">Type: ORG</span>
          </h3>
          {pendingOrgs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingOrgs.map((org) => {
                const ownerName = users.find(u => u.id === org.ownerId)?.name || 'Unknown User';
                return (
                  <div
                    key={org.id}
                    className="p-6 border border-[#CD9777]/25 dark:border-white/10 rounded-3xl flex flex-col justify-between gap-4 bg-white dark:bg-[#121713] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={org.logo}
                        alt={org.organizationName}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#CD9777]/20 dark:border-white/10"
                      />
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-bold text-dark-forest dark:text-[#F7F4D5] text-sm truncate">{org.organizationName}</h4>
                        <span className="text-[9px] font-extrabold bg-[#F5DFC0] dark:bg-amber-950/70 text-slate-800 dark:text-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-300/30">
                          {org.category}
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-[#FAF9F0]/80">Owner: <strong className="text-dark-forest dark:text-[#F7F4D5]">{ownerName}</strong></p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-[#FAF9F0]/90 leading-relaxed">
                      <strong className="text-dark-forest dark:text-[#F7F4D5]">Mission:</strong> "{org.mission}"
                    </p>
                    <div className="p-3 bg-warm-cream/50 dark:bg-[#1A211C] rounded-xl space-y-1.5 text-xs border border-[#CD9777]/15 dark:border-white/10">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-[#FAF9F0]/85">
                        <Globe size={12} className="text-primary-green dark:text-[#A4C270]" />
                        <a href={org.website} target="_blank" rel="noreferrer" className="text-primary-green dark:text-[#A4C270] hover:underline truncate font-medium">{org.website}</a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-[#FAF9F0]/85">
                        <ShieldAlert size={12} className="text-[#CD9777]" />
                        <span>Cert ID: <strong className="text-dark-forest dark:text-[#F7F4D5]">{org.registrationCertificate}</strong></span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleApproveOrg(org.id)}
                        className="flex-1 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check size={14} />
                        Approve NGO
                      </button>
                      <button
                        onClick={() => handleRejectOrg(org.id)}
                        className="flex-1 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-text/50 dark:text-[#FAF9F0]/60 border border-dashed border-[#CD9777]/20 dark:border-white/10 rounded-3xl">
              No pending organization verification requests.
            </div>
          )}
        </section>
      )}

      {/* 2. SMALL BUSINESS VENDORS */}
      {(filterType === 'ALL' || filterType === 'VENDOR') && (
        <section className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] border-b border-[#CD9777]/10 dark:border-white/10 pb-4 flex items-center justify-between">
            <span>Pending Small Business Vendors ({pendingVendors.length})</span>
            <span className="text-xs font-sans text-slate-text/50 dark:text-[#F3F1E7]/50 font-normal">Type: VENDOR</span>
          </h3>
          {pendingVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingVendors.map((v) => (
                <div key={v.id} className="p-6 border border-[#CD9777]/25 dark:border-white/10 rounded-3xl space-y-3 bg-white dark:bg-[#121713] transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-dark-forest dark:text-[#F7F4D5] text-sm">{v.businessName}</h4>
                      <span className="text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-300/30">
                        {v.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-[#FAF9F0]/70 font-semibold">WhatsApp: {v.whatsapp}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-[#FAF9F0]/90 italic font-medium leading-relaxed">
                    "{v.ecoPracticeStatement}"
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleApproveVendor(v.id)}
                      className="flex-1 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check size={14} />
                      Approve GreenCart Partner
                    </button>
                    <button
                      onClick={() => handleRejectVendor(v.id)}
                      className="flex-1 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X size={14} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-text/50 dark:text-[#FAF9F0]/60 border border-dashed border-[#CD9777]/20 dark:border-white/10 rounded-3xl">
              No pending small business vendor applications.
            </div>
          )}
        </section>
      )}

      {/* 3. EVENT EXPERIENCES PHOTOBOOTH */}
      {(filterType === 'ALL' || filterType === 'EXPERIENCE') && (
        <section className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] border-b border-[#CD9777]/10 dark:border-white/10 pb-4 flex items-center justify-between">
            <span>Pending Event Experiences ({pendingExperiences.length})</span>
            <span className="text-xs font-sans text-slate-text/50 dark:text-[#F3F1E7]/50 font-normal">Type: EXPERIENCE</span>
          </h3>
          {pendingExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pendingExperiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl border border-[#CD9777]/25 dark:border-white/10 space-y-3 bg-white dark:bg-[#121713] transition-colors">
                  {exp.images.length > 0 && (
                    <img src={exp.images[0]} alt={exp.eventTitle} className="w-full h-32 object-cover rounded-xl" />
                  )}
                  <span className="text-[10px] font-bold text-primary-green dark:text-[#A4C270]">Event: {exp.eventTitle}</span>
                  <p className="text-xs font-serif italic text-slate-800 dark:text-[#FAF9F0] leading-relaxed font-medium">
                    "{exp.reflection}"
                  </p>
                  <span className="text-[10px] text-slate-600 dark:text-[#FAF9F0]/70 font-semibold block">By: {exp.userName}</span>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleApproveExperience(exp.id)}
                      className="flex-1 bg-primary-green text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check size={14} />
                      Approve Note
                    </button>
                    <button
                      onClick={() => handleRejectExperience(exp.id)}
                      className="flex-1 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X size={14} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-text/50 dark:text-[#FAF9F0]/60 border border-dashed border-[#CD9777]/20 dark:border-white/10 rounded-3xl">
              No pending event experience notes to review.
            </div>
          )}
        </section>
      )}

      {/* 4. DONATION LISTINGS MODERATION */}
      {(filterType === 'ALL' || filterType === 'DON') && (
        <section className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] border-b border-[#CD9777]/10 dark:border-white/10 pb-4 flex items-center justify-between">
            <span>Community Donation Moderation ({donations.length})</span>
            <span className="text-xs font-sans text-slate-text/50 dark:text-[#F3F1E7]/50 font-normal">Type: DON</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((don) => (
              <div
                key={don.id}
                className="p-4 rounded-2xl flex flex-col justify-between gap-4 border border-[#CD9777]/25 dark:border-white/10 bg-white dark:bg-[#121713] transition-colors"
              >
                <div>
                  <div className="h-32 rounded-xl overflow-hidden relative mb-3">
                    <img
                      src={don.images[0]}
                      alt={don.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDeleteDonation(don.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                      title="Delete Inappropriate Donation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-bold border border-amber-300/30">
                      {don.category}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-[#FAF9F0]/75 font-semibold">Owner: {don.ownerName}</span>
                  </div>
                  <h4 className="font-bold text-dark-forest dark:text-[#F7F4D5] text-sm truncate leading-snug">{don.title}</h4>
                  <p className="text-xs text-slate-700 dark:text-[#FAF9F0]/85 line-clamp-2 mt-1 font-medium">{don.description}</p>
                </div>
                <div className="pt-2 border-t border-[#CD9777]/10 dark:border-white/10 flex items-center gap-1 text-[10px] text-slate-600 dark:text-[#FAF9F0]/75 font-semibold">
                  <MapPin size={10} />
                  <span>{don.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. COMMUNITY LETTERS MODERATION */}
      {(filterType === 'ALL' || filterType === 'LETTER') && (
        <section className="bg-white dark:bg-[#1A211C] border border-[#CD9777]/20 dark:border-white/10 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-[#F7F4D5] border-b border-[#CD9777]/10 dark:border-white/10 pb-4 flex items-center justify-between">
            <span>Community Letters ({letters.length})</span>
            <span className="text-xs font-sans text-slate-text/50 dark:text-[#F3F1E7]/50 font-normal">Type: LETTER</span>
          </h3>
          {letters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {letters.map((ltr) => (
                <div key={ltr.id} className="p-5 rounded-2xl border border-[#CD9777]/25 dark:border-white/10 space-y-3 bg-white dark:bg-[#121713] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-dark-forest dark:text-[#F7F4D5]">{ltr.userName}</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300/30">{ltr.status}</span>
                  </div>
                  <p className="text-xs font-serif italic text-slate-800 dark:text-[#FAF9F0] leading-relaxed font-medium">"{ltr.text}"</p>
                  {ltr.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleApproveLetter(ltr.id)}
                        className="flex-1 bg-primary-green text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check size={14} />
                        Approve Letter
                      </button>
                      <button
                        onClick={() => handleRejectLetter(ltr.id)}
                        className="flex-1 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <X size={14} />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-text/50 dark:text-[#FAF9F0]/60 border border-dashed border-[#CD9777]/20 dark:border-white/10 rounded-3xl">
              No community letters submitted.
            </div>
          )}
        </section>
      )}

    </div>
  );
};
export default Admin;

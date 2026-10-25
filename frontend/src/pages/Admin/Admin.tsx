import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Building2, Check, X, Trash2, Heart, ShieldAlert, FileSpreadsheet, Globe, MapPin, Store, Camera, Mail 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const Admin: React.FC = () => {
  const [filterType, setFilterType] = useState<'ALL' | 'ORG' | 'DON' | 'VENDOR' | 'EXPERIENCE' | 'LETTER'>('ALL');
  const { 
    currentUser, 
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
    adminRejectLetter
  } = useAuthStore();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="text-center py-20 bg-white dark:bg-dark-forest border border-red-200/20 rounded-[40px] max-w-xl mx-auto space-y-4">
        <ShieldAlert size={48} className="text-red-500 mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-dark-forest dark:text-beige">Access Restricted</h3>
        <p className="text-sm text-slate-text/75 dark:text-moss max-w-sm mx-auto">
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
  };

  const handleRejectOrg = (orgId: string) => {
    adminRejectOrg(orgId);
    toast.error('Organization application declined.');
  };

  const handleApproveVendor = (vendorId: string) => {
    adminApproveVendor(vendorId);
    toast.success('Small Business Vendor approved for GreenCart! 🛍️');
  };

  const handleRejectVendor = (vendorId: string) => {
    adminRejectVendor(vendorId);
    toast.error('Vendor application declined.');
  };

  const handleApproveExperience = (expId: string) => {
    adminApproveExperience(expId);
    toast.success('Event experience approved for Photobooth Gallery! 📸');
  };

  const handleRejectExperience = (expId: string) => {
    adminRejectExperience(expId);
    toast.error('Event experience declined.');
  };

  const handleApproveLetter = (letterId: string) => {
    adminApproveLetter(letterId);
    toast.success('Community letter approved! 💌');
  };

  const handleRejectLetter = (letterId: string) => {
    adminRejectLetter(letterId);
    toast.error('Letter declined.');
  };

  const handleDeleteDonation = (donationId: string) => {
    if (window.confirm('Are you sure you want to delete this donation listing as inappropriate?')) {
      adminDeleteDonation(donationId);
      toast.success('Donation listing deleted.');
    }
  };

  return (
    <div className="space-y-8 p-1">
      {/* 1. ADMIN HEADER */}
      <div className="bg-white dark:bg-dark-forest border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-dark-forest dark:text-beige flex items-center gap-2">
            <ShieldCheck className="text-primary-green" size={32} />
            Administrator Control Center
          </h2>
          <p className="text-xs text-slate-text/60 dark:text-moss mt-1">Review pending organizations, small business vendors, event photobooth notes, and moderate content.</p>
        </div>
        <span className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold border border-red-200">
          Admin Mode
        </span>
      </div>

      {/* FILTER DROPDOWN */}
      <div className="flex items-center gap-3 mt-4 bg-warm-cream/50 dark:bg-white/5 p-4 rounded-2xl border border-[#CD9777]/20">
        <label htmlFor="admin-filter" className="font-bold text-xs uppercase tracking-wider text-dark-forest dark:text-beige">Filter Queue Type:</label>
        <select
          id="admin-filter"
          value={filterType}
          onChange={e => setFilterType(e.target.value as any)}
          className="rounded-xl border border-[#CD9777]/30 bg-white dark:bg-black/30 px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-green text-dark-forest dark:text-beige"
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
          { label: 'Total Registered Citizens', value: users.length, icon: Users, color: 'text-primary-green bg-green-50' },
          { label: 'Verified Organizations', value: approvedOrgsCount, icon: Building2, color: 'text-blue-700 bg-blue-50' },
          { label: 'Pending Vendors', value: pendingVendors.length, icon: Store, color: 'text-emerald-700 bg-emerald-50' },
          { label: 'Pending Experiences', value: pendingExperiences.length, icon: Camera, color: 'text-amber-700 bg-amber-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-dark-forest border border-[#CD9777]/20 p-5 rounded-3xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0`}>
              <item.icon size={22} />
            </div>
            <div>
              <span className="text-2xl font-black text-dark-forest dark:text-beige leading-none block">{item.value}</span>
              <span className="text-xs font-semibold text-slate-text/50 dark:text-moss mt-1 block">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 1. ORGANIZATION REVIEWS */}
      {(filterType === 'ALL' || filterType === 'ORG') && (
        <section className="bg-white dark:bg-dark-forest border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-beige border-b border-[#CD9777]/10 pb-4 flex items-center justify-between">
            <span>Pending Organization Reviews ({pendingOrgs.length})</span>
            <span className="text-xs font-sans text-slate-text/50 font-normal">Type: ORG</span>
          </h3>
          {pendingOrgs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingOrgs.map((org) => {
                const ownerName = users.find(u => u.id === org.ownerId)?.name || 'Unknown User';
                return (
                  <div
                    key={org.id}
                    className="watercolor-card p-6 border border-[#CD9777]/25 rounded-3xl flex flex-col justify-between gap-4 dark:bg-white/5"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={org.logo}
                        alt={org.organizationName}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#CD9777]/20"
                      />
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-bold text-dark-forest dark:text-beige text-sm truncate">{org.organizationName}</h4>
                        <span className="text-[9px] font-extrabold bg-[#F5DFC0] text-slate-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {org.category}
                        </span>
                        <p className="text-[11px] text-slate-text/50 dark:text-moss">Owner: <strong>{ownerName}</strong></p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-text/75 dark:text-moss leading-relaxed">
                      <strong>Mission:</strong> "{org.mission}"
                    </p>
                    <div className="p-3 bg-warm-cream/40 dark:bg-black/20 rounded-xl space-y-1 text-xs border border-[#CD9777]/10">
                      <div className="flex items-center gap-1.5 text-slate-text/70 dark:text-moss">
                        <Globe size={12} className="text-primary-green" />
                        <a href={org.website} target="_blank" rel="noreferrer" className="hover:underline truncate">{org.website}</a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-text/70 dark:text-moss">
                        <ShieldAlert size={12} className="text-[#CD9777]" />
                        <span>Cert ID: <strong>{org.registrationCertificate}</strong></span>
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
                        className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
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
            <div className="text-center py-10 text-xs text-slate-text/40 dark:text-moss/60 border border-dashed border-[#CD9777]/20 rounded-3xl">
              No pending organization verification requests.
            </div>
          )}
        </section>
      )}

      {/* 2. SMALL BUSINESS VENDORS */}
      {(filterType === 'ALL' || filterType === 'VENDOR') && (
        <section className="bg-white dark:bg-dark-forest border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-beige border-b border-[#CD9777]/10 pb-4 flex items-center justify-between">
            <span>Pending Small Business Vendors ({pendingVendors.length})</span>
            <span className="text-xs font-sans text-slate-text/50 font-normal">Type: VENDOR</span>
          </h3>
          {pendingVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingVendors.map((v) => (
                <div key={v.id} className="watercolor-card p-6 border border-[#CD9777]/25 rounded-3xl space-y-3 dark:bg-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-dark-forest dark:text-beige text-sm">{v.businessName}</h4>
                      <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {v.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-text/50">WhatsApp: {v.whatsapp}</span>
                  </div>
                  <p className="text-xs text-slate-text/75 dark:text-moss italic">
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
                      className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X size={14} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-text/40 dark:text-moss/60 border border-dashed border-[#CD9777]/20 rounded-3xl">
              No pending small business vendor applications.
            </div>
          )}
        </section>
      )}

      {/* 3. EVENT EXPERIENCES PHOTOBOOTH */}
      {(filterType === 'ALL' || filterType === 'EXPERIENCE') && (
        <section className="bg-white dark:bg-dark-forest border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-beige border-b border-[#CD9777]/10 pb-4 flex items-center justify-between">
            <span>Pending Event Experiences ({pendingExperiences.length})</span>
            <span className="text-xs font-sans text-slate-text/50 font-normal">Type: EXPERIENCE</span>
          </h3>
          {pendingExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pendingExperiences.map((exp) => (
                <div key={exp.id} className="watercolor-card p-4 rounded-2xl border border-[#CD9777]/25 space-y-3 dark:bg-white/5">
                  {exp.images.length > 0 && (
                    <img src={exp.images[0]} alt={exp.eventTitle} className="w-full h-32 object-cover rounded-xl" />
                  )}
                  <span className="text-[10px] font-bold text-primary-green">Event: {exp.eventTitle}</span>
                  <p className="text-xs font-serif italic text-dark-forest dark:text-beige leading-relaxed">
                    "{exp.reflection}"
                  </p>
                  <span className="text-[10px] text-slate-text/50 block">By: {exp.userName}</span>
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
                      className="flex-1 border border-red-200 text-red-600 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X size={14} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-text/40 dark:text-moss/60 border border-dashed border-[#CD9777]/20 rounded-3xl">
              No pending event experience notes to review.
            </div>
          )}
        </section>
      )}

      {/* 4. DONATION LISTINGS MODERATION */}
      {(filterType === 'ALL' || filterType === 'DON') && (
        <section className="bg-white dark:bg-dark-forest border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-beige border-b border-[#CD9777]/10 pb-4 flex items-center justify-between">
            <span>Community Donation Moderation ({donations.length})</span>
            <span className="text-xs font-sans text-slate-text/50 font-normal">Type: DON</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((don) => (
              <div
                key={don.id}
                className="watercolor-card p-4 rounded-2xl flex flex-col justify-between gap-4 dark:bg-white/5"
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
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                      title="Delete Inappropriate Donation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {don.category}
                    </span>
                    <span className="text-[10px] text-slate-text/50 dark:text-moss">Owner: {don.ownerName}</span>
                  </div>
                  <h4 className="font-bold text-dark-forest dark:text-beige text-sm truncate leading-snug">{don.title}</h4>
                  <p className="text-xs text-slate-text/60 dark:text-moss line-clamp-2 mt-1">{don.description}</p>
                </div>
                <div className="pt-2 border-t border-[#CD9777]/10 flex items-center gap-1 text-[10px] text-slate-text/50 dark:text-moss">
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
        <section className="bg-white dark:bg-dark-forest border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-dark-forest dark:text-beige border-b border-[#CD9777]/10 pb-4 flex items-center justify-between">
            <span>Community Letters ({letters.length})</span>
            <span className="text-xs font-sans text-slate-text/50 font-normal">Type: LETTER</span>
          </h3>
          {letters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {letters.map((ltr) => (
                <div key={ltr.id} className="watercolor-card p-5 rounded-2xl border border-[#CD9777]/25 space-y-3 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-dark-forest dark:text-beige">{ltr.userName}</span>
                    <span className="text-[10px] bg-soft-mint text-primary-green px-2 py-0.5 rounded-full font-bold">{ltr.status}</span>
                  </div>
                  <p className="text-xs font-serif italic text-slate-700 dark:text-moss">"{ltr.text}"</p>
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
                        className="flex-1 border border-red-200 text-red-600 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
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
            <div className="text-center py-10 text-xs text-slate-text/40 dark:text-moss/60 border border-dashed border-[#CD9777]/20 rounded-3xl">
              No community letters submitted.
            </div>
          )}
        </section>
      )}

    </div>
  );
};
export default Admin;

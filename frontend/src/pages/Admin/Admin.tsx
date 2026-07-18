import React from 'react';
import { 
  ShieldCheck, Users, Building2, Check, X, Trash2, Heart, ShieldAlert, Award, FileSpreadsheet, Globe, MapPin 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const Admin: React.FC = () => {
  const { 
    currentUser, 
    organizations, 
    donations, 
    users, 
    adminApproveOrg, 
    adminRejectOrg, 
    adminDeleteDonation 
  } = useAuthStore();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="text-center py-20 bg-white border border-red-200/20 rounded-[40px] max-w-xl mx-auto space-y-4">
        <ShieldAlert size={48} className="text-red-500 mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-dark-forest">Access Restricted</h3>
        <p className="text-sm text-slate-text/75 max-w-sm mx-auto">
          This portal is reserved for site moderators and system administrators. Please log in with admin credentials to continue.
        </p>
      </div>
    );
  }

  // Filter pending organizations
  const pendingOrgs = organizations.filter(o => o.verificationStatus === 'PENDING');
  const approvedOrgsCount = organizations.filter(o => o.verificationStatus === 'APPROVED').length;

  const handleApprove = (orgId: string) => {
    adminApproveOrg(orgId);
    toast.success('Organization approved! Notification sent to owner. 🏢');
  };

  const handleReject = (orgId: string) => {
    adminRejectOrg(orgId);
    toast.error('Organization application declined.');
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
      <div className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold text-dark-forest flex items-center gap-2">
            <ShieldCheck className="text-primary-green" size={32} />
            Administrator Panel
          </h2>
          <p className="text-xs text-slate-text/60 mt-1">Review pending organizations, moderate donations, and monitor community outreach.</p>
        </div>
        <span className="bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-xs font-bold border border-red-200">
          Admin Mode
        </span>
      </div>

      {/* 2. STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Citizens Registered', value: users.length, icon: Users, color: 'text-primary-green bg-green-50' },
          { label: 'Verified Organizations', value: approvedOrgsCount, icon: Building2, color: 'text-blue-700 bg-blue-50' },
          { label: 'Pending Applications', value: pendingOrgs.length, icon: FileSpreadsheet, color: 'text-amber-700 bg-amber-50' },
          { label: 'Donation Items', value: donations.length, icon: Heart, color: 'text-red-700 bg-red-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#CD9777]/20 p-5 rounded-3xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0`}>
              <item.icon size={22} />
            </div>
            <div>
              <span className="text-2xl font-black text-dark-forest leading-none block">{item.value}</span>
              <span className="text-xs font-semibold text-slate-text/50 mt-1 block">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. PENDING ORGANIZATIONS REVIEW */}
      <section className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
        <h3 className="font-serif text-xl font-bold text-dark-forest border-b border-[#CD9777]/10 pb-4">
          Pending Organization Reviews ({pendingOrgs.length})
        </h3>

        {pendingOrgs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingOrgs.map((org) => {
              const ownerName = users.find(u => u.id === org.ownerId)?.name || 'Unknown User';
              return (
                <div 
                  key={org.id}
                  className="watercolor-card p-6 border border-[#CD9777]/25 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={org.logo} 
                      alt={org.organizationName} 
                      className="w-14 h-14 rounded-2xl object-cover border border-[#CD9777]/20"
                    />
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-dark-forest text-sm truncate">{org.organizationName}</h4>
                      <span className="text-[9px] font-extrabold bg-[#F5DFC0] text-slate-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {org.category}
                      </span>
                      <p className="text-[11px] text-slate-text/50">Requested by: <strong>{ownerName}</strong></p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-text/75 leading-relaxed">
                    <strong>Mission:</strong> "{org.mission}"
                  </p>

                  <div className="p-3 bg-warm-cream/40 rounded-xl space-y-1 text-xs border border-[#CD9777]/10">
                    <div className="flex items-center gap-1.5 text-slate-text/70">
                      <Globe size={12} className="text-primary-green" />
                      <a href={org.website} target="_blank" rel="noreferrer" className="hover:underline truncate">{org.website}</a>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-text/70">
                      <ShieldAlert size={12} className="text-[#CD9777]" />
                      <span>Gov Cert: <strong className="font-semibold text-dark-forest">{org.registrationCertificate}</strong></span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleApprove(org.id)}
                      className="flex-1 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check size={14} />
                      Approve Partner
                    </button>
                    <button
                      onClick={() => handleReject(org.id)}
                      className="flex-1 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
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
          <div className="text-center py-12 text-xs text-slate-text/40 border border-dashed border-[#CD9777]/20 rounded-3xl">
            No pending organization verification requests at this time.
          </div>
        )}
      </section>

      {/* 4. DONATION LISTINGS MODERATOR */}
      <section className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm space-y-6">
        <h3 className="font-serif text-xl font-bold text-dark-forest border-b border-[#CD9777]/10 pb-4">
          Community Donation Moderation ({donations.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((don) => (
            <div 
              key={don.id}
              className="watercolor-card p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all gap-4 group"
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
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105"
                    title="Delete Inappropriate Donation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    {don.category}
                  </span>
                  <span className="text-[10px] text-slate-text/50">Owner: {don.ownerName}</span>
                </div>
                <h4 className="font-bold text-dark-forest text-sm truncate leading-snug">{don.title}</h4>
                <p className="text-xs text-slate-text/60 line-clamp-2 mt-1">{don.description}</p>
              </div>
              <div className="pt-2 border-t border-[#CD9777]/10 flex items-center gap-1 text-[10px] text-slate-text/50">
                <MapPin size={10} />
                <span>{don.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Admin;

import React, { useState } from 'react';
import { Award, Calendar, Download, Eye, Heart, Layers, Lock, Clock, Flame, Trophy } from 'lucide-react';
import { useAuthStore, LEVEL_NAMES } from '../../store/useAuthStore';
import { ImpactTree } from '../../components/dashboard/ImpactTree';
import { Logo } from '../../components/common/Logo';
import toast from 'react-hot-toast';

export const Impact: React.FC = () => {
  const { currentUser, certificates, badges, notifications } = useAuthStore();
  const [selectedCert, setSelectedCert] = useState<typeof certificates[0] | null>(null);

  if (!currentUser) return null;

  // Calculate simulated statistics based on user's XP and activities
  const volunteerHours = currentUser.level * 12 + Math.floor(currentUser.xp / 40);
  const communitiesHelped = Math.max(1, Math.floor(currentUser.level / 2));
  const eventsJoinedCount = currentUser.level + 1;
  const treesPlanted = currentUser.level * 5 + 3;

  // Generate GitHub-style heatmap values (simulating the last 150 days)
  const heatmapTiles = Array.from({ length: 154 }, (_, i) => {
    // Determine color density based on pseudo-random distribution
    let density = 0;
    if (i % 7 === 0 && i % 3 === 0) density = 3; // Active day (dark green)
    else if (i % 11 === 0) density = 2;          // Medium day (leaf green)
    else if (i % 17 === 0) density = 1;          // Low day (light mint)
    return density;
  });

  const handleDownloadCert = () => {
    toast.success('Certificate download started! (PDF generated) 📄');
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header info */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-dark-forest">My Impact</h2>
        <p className="text-xs text-slate-text/60 mt-1">Every small action you take makes our local communities stronger.</p>
      </div>

      {/* 1. LEVEL & TREE GROW ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Tree */}
        <div className="lg:col-span-5 bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden">
          <span className="text-xs font-bold text-slate-text/50 self-start">Visual Ecosystem</span>
          
          <ImpactTree level={currentUser.level} />
          
          <div className="mt-6">
            <h3 className="font-serif text-2xl font-bold text-dark-forest">
              {LEVEL_NAMES[currentUser.level - 1] || 'Bridge Builder'}
            </h3>
            <p className="text-xs text-slate-text/60 mt-1 max-w-xs">
              Watch your tree grow from a seedling into a full ecosystem with birds and flowers by earning XP points.
            </p>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="lg:col-span-7 bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-text/50">Simulated Impact Numbers</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 my-6">
            {[
              { label: 'Volunteer Hours', value: `${volunteerHours}h`, icon: Clock, color: 'text-primary-green bg-green-50' },
              { label: 'Trees Planted', value: `${treesPlanted}`, icon: Layers, color: 'text-emerald-700 bg-emerald-50' },
              { label: 'Events Joined', value: `${eventsJoinedCount}`, icon: Calendar, color: 'text-blue-700 bg-blue-50' },
              { label: 'XP Points Earned', value: `${currentUser.xp + (currentUser.level - 1) * 500}`, icon: Flame, color: 'text-amber-700 bg-amber-50' },
              { label: 'Communities Helped', value: `${communitiesHelped}`, icon: Heart, color: 'text-red-700 bg-red-50' },
              { label: 'Achievements Unlocked', value: `${currentUser.badges.length} Badges`, icon: Trophy, color: 'text-purple-700 bg-purple-50' },
            ].map((stat, idx) => (
              <div key={idx} className="p-4 bg-warm-cream/35 border border-[#CD9777]/10 rounded-2xl flex flex-col gap-2">
                <div className={`w-8 h-8 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={16} />
                </div>
                <div>
                  <span className="text-2xl font-black text-dark-forest leading-none block">{stat.value}</span>
                  <span className="text-[10px] font-semibold text-slate-text/50 mt-1 block">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Goal progress sliders */}
          <div className="space-y-3 border-t border-[#CD9777]/10 pt-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-green block">Monthly Targets</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-text mb-1">
                  <span>Volunteer twice this month</span>
                  <span>1 / 2</span>
                </div>
                <div className="w-full h-2 bg-warm-cream border border-[#CD9777]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-green" style={{ width: '50%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-text mb-1">
                  <span>Plant 10 native trees</span>
                  <span>6 / 10</span>
                </div>
                <div className="w-full h-2 bg-warm-cream border border-[#CD9777]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-green" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GITHUB-STYLE CONTRIBUTION CALENDAR */}
      <section className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm">
        <h3 className="font-serif text-xl font-bold text-dark-forest mb-4">Contribution Calendar</h3>
        <p className="text-xs text-slate-text/60 mb-6">Track your daily impacts throughout the seasons. Darker green blocks represent active volunteering days.</p>
        
        {/* Heatmap Grid */}
        <div className="flex flex-col overflow-x-auto pb-2">
          <div className="flex gap-[3px] min-w-[700px]">
            {/* Days labels */}
            <div className="flex flex-col justify-between text-[9px] font-bold text-slate-text/40 pr-2 pb-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            
            {/* Heat Tiles */}
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] flex-1">
              {heatmapTiles.map((density, idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-[3px] border border-black/5 transition-all ${
                    density === 0 ? 'bg-warm-cream/55' :
                    density === 1 ? 'bg-soft-mint' :
                    density === 2 ? 'bg-leaf-green' :
                    'bg-primary-green'
                  }`}
                  title={`${density > 0 ? `${density} contributions` : 'No activity'} on this day`}
                />
              ))}
            </div>
          </div>
          
          {/* Months labels */}
          <div className="flex justify-between text-[9px] font-bold text-slate-text/40 pl-8 pt-2">
            <span>February</span>
            <span>March</span>
            <span>April</span>
            <span>May</span>
            <span>June</span>
            <span>July</span>
          </div>
        </div>
      </section>

      {/* 3. ACHIEVEMENTS & BADGES */}
      <section className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm">
        <h3 className="font-serif text-xl font-bold text-dark-forest mb-6">Unlocked Badges</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge) => {
            const isUnlocked = currentUser.badges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`p-5 rounded-3xl border text-center flex flex-col items-center relative transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-[#F5DFC0]/10 to-[#F5DFC0]/35 border-[#CD9777]/40 shadow-sm scale-100'
                    : 'bg-white border-dashed border-[#CD9777]/15 opacity-50'
                }`}
              >
                {!isUnlocked && (
                  <span className="absolute top-3 right-3 text-slate-text/40">
                    <Lock size={12} />
                  </span>
                )}
                
                {/* Badge Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 ${
                  isUnlocked ? 'bg-white shadow-md' : 'bg-warm-cream/40'
                }`}>
                  {badge.icon}
                </div>

                <h4 className="font-serif font-bold text-dark-forest text-sm">{badge.name}</h4>
                <p className="text-[10px] text-slate-text/60 mt-1 leading-relaxed line-clamp-2">{badge.description}</p>
                {isUnlocked ? (
                  <span className="text-[9px] font-bold text-primary-green bg-soft-mint px-2 py-0.5 rounded-full mt-3">
                    +{badge.xpReward} XP
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-text/50 mt-3">Locked</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CERTIFICATES GALLERY */}
      <section className="bg-white border border-[#CD9777]/20 p-8 rounded-[36px] shadow-sm">
        <h3 className="font-serif text-xl font-bold text-dark-forest mb-6">Service Certificates</h3>
        
        {certificates.filter(c => c.userId === currentUser.id).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates
              .filter(c => c.userId === currentUser.id)
              .map((cert) => (
                <div 
                  key={cert.id}
                  className="watercolor-card p-6 border border-[#CD9777]/20 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green">
                      <Award size={20} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-text/55 bg-warm-cream border border-[#CD9777]/10 px-2.5 py-1 rounded-full">
                      {cert.issueDate}
                    </span>
                  </div>

                  <div className="my-6">
                    <span className="text-[10px] text-primary-green uppercase tracking-wider font-extrabold block">
                      {cert.organizationName}
                    </span>
                    <h4 className="font-serif font-bold text-dark-forest text-sm mt-1 leading-snug group-hover:text-primary-green transition-colors">
                      {cert.title}
                    </h4>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 border border-primary-green/30 hover:border-primary-green text-primary-green text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye size={12} />
                      Preview
                    </button>
                    <button
                      onClick={handleDownloadCert}
                      className="flex-1 bg-primary-green hover:bg-dark-forest text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download size={12} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-text/40 border border-dashed border-[#CD9777]/20 rounded-3xl">
            Complete volunteer applications to receive verified community certificates.
          </div>
        )}
      </section>

      {/* 5. CERTIFICATE PREVIEW MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white border border-[#CD9777]/20 rounded-[40px] shadow-2xl p-10 relative text-center space-y-8 select-none">
            {/* Close button */}
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-warm-cream text-slate-text hover:text-primary-green transition-colors font-bold text-sm"
            >
              ✕
            </button>
            
            {/* Cert Template Illustration */}
            <div className="border-[12px] border-double border-[#CD9777]/40 p-8 rounded-2xl bg-warm-cream/35 relative">
              {/* Sprout Watermarks */}
              <div className="absolute top-4 left-4 text-3xl opacity-20">🍃</div>
              <div className="absolute bottom-4 right-4 text-3xl opacity-20">🌱</div>
              
              <div className="space-y-4">
                <Logo size={42} showText={false} className="mx-auto" />
                <span className="text-[10px] tracking-widest text-[#CD9777] uppercase font-bold block">
                  Certificate of Appreciation
                </span>
                
                <h4 className="font-serif text-3xl font-bold text-dark-forest pt-4">GreenBridge Impact Award</h4>
                <p className="text-xs text-slate-text/60 italic">This is proudly presented to</p>
                
                <h3 className="font-serif text-2xl font-black text-primary-green underline decoration-[#CD9777] decoration-2 underline-offset-4">
                  {currentUser.name}
                </h3>
                
                <p className="text-xs text-slate-text/75 max-w-md mx-auto leading-relaxed pt-2">
                  for outstanding service and dedicated volunteering participation in connection with <br />
                  <strong>"{selectedCert.title.replace('Volunteer Service Certificate - ', '')}"</strong><br />
                  conducted in alignment with the certified host <strong>"{selectedCert.organizationName}"</strong>.
                </p>
                
                <div className="grid grid-cols-2 pt-8 text-[9px] text-[#CD9777] font-bold">
                  <div>
                    <span className="block border-b border-[#CD9777]/25 w-24 mx-auto pb-1 mb-1">
                      {selectedCert.issueDate}
                    </span>
                    DATE ISSUED
                  </div>
                  <div>
                    <span className="block border-b border-[#CD9777]/25 w-24 mx-auto pb-1 mb-1 font-serif italic text-dark-forest">
                      GreenBridge Team
                    </span>
                    VERIFIED SIGNATURE
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-2.5 rounded-full border border-[#CD9777]/30 hover:border-primary-green text-xs font-bold transition-all text-slate-text hover:text-primary-green"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownloadCert();
                  setSelectedCert(null);
                }}
                className="bg-primary-green hover:bg-dark-forest text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md shadow-primary-green/10"
              >
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Impact;

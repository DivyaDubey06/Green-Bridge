import React from 'react';
import { Logo } from '../../components/common/Logo';
import { Heart, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { Background3DScene } from '../../components/common/Background3DScene';
import { Surface } from '../../components/common/Surface';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
      
      {/* 1. HERO STORY WITH 3D ABOUT SCENE */}
      <Surface tone="deep" className="p-10 md:p-14 rounded-[36px] shadow-xl text-center space-y-6 relative overflow-hidden">
        <Background3DScene tab="about" className="w-full">
          <div className="w-24 h-24 mx-auto animate-float bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center mb-4">
            <Logo size={70} showText={false} />
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-[#F7F4D5]">Our Mission</h2>
          <h4 className="font-serif text-xl md:text-2xl text-[#D3968C] italic mt-2">"Connecting People Who Care."</h4>
          <p className="text-base md:text-lg text-[#F7F4D5]/85 max-w-2xl mx-auto leading-relaxed pt-3">
            GreenBridge exists because in today's fast paced world, many people genuinely want to contribute to society but don't know where to begin. We don't ask you to permanently dedicate your life to an NGO. Instead, GreenBridge allows anyone to volunteer whenever they are free, discover nearby opportunities, participate in local events, donate useful items, and watch their visual social impact grow.
          </p>
        </Background3DScene>
      </Surface>

      {/* 2. VALUES */}
      <section className="space-y-8">
        <h3 className="font-serif text-3xl font-bold text-center text-dark-forest">Our Core Values</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { title: '🌱 Hope & Growth', desc: 'We believe that tiny deeds grow into major changes. That is why our visual impact tree sprouts leaf by leaf as you do good.', icon: Sparkles },
            { title: '❤️ Belonging & Safety', desc: 'This is a warm community space. We manually verify all organization registrations to ensure high security and trust.', icon: ShieldCheck },
            { title: '🤝 Community Cohesion', desc: 'Connecting neighbours, verified charity groups, and local clubs directly to coordinate help close to home.', icon: Users },
            { title: '🌍 Purpose & Action', desc: 'volunteering should feel easy, rewarding, and enjoyable. Get active in plantation drives, tutoring, and cleans.', icon: Heart },
          ].map((item, idx) => (
            <div key={idx} className="watercolor-card p-6 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-soft-mint text-primary-green flex items-center justify-center flex-shrink-0">
                <item.icon size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-dark-forest leading-none">{item.title}</h4>
                <p className="text-xs text-slate-text/70 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FAQS SECTION */}
      <section className="bg-white border border-[#CD9777]/20 p-8 rounded-[40px] shadow-sm space-y-6">
        <h3 className="font-serif text-3xl font-bold text-center text-dark-forest">Frequently Asked Questions</h3>
        
        <div className="space-y-6 divide-y divide-[#CD9777]/10">
          {[
            {
              q: "Is GreenBridge a registered NGO or donation site?",
              a: "No, GreenBridge is a Community Impact Platform. We do not manage funds or collect money. Instead, we connect citizens directly to volunteering campaigns, localized events, and verified organizations."
            },
            {
              q: "Who verifies the organizations on the platform?",
              a: "GreenBridge administrators manually review government registration credentials and certificates submitted by any group before promoting them to an ORGANIZATION role, maintaining safety."
            },
            {
              q: "How does the Impact Tree XP system work?",
              a: "When you participate in events (+100 XP), complete volunteer drives (+150 XP), or upload donations (+75 XP), you receive Experience Points. As you earn XP, your contributor level rises, and your visual seedling grows branches, leaves, and eventually spawns flowers, butterflies, and birds!"
            },
            {
              q: "Can I receive certificates for my contributions?",
              a: "Yes! When an organization accepts and completes your volunteer application, a digital certificate of service is issued and saved to your 'My Impact' vault for PDF printouts."
            }
          ].map((faq, idx) => (
            <div key={idx} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} space-y-2`}>
              <h5 className="font-serif font-bold text-dark-forest text-base">Q: {faq.q}</h5>
              <p className="text-xs text-slate-text/75 leading-relaxed pl-4 border-l-2 border-primary-green/40">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Font & Design Credits */}
        <div className="text-center text-xs text-slate-text/50 pt-8 border-t border-[#0A3323]/10">

        </div>
      </section>
    </div>
  );
};
export default About;

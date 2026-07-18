import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Mail, Instagram, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-forest text-warm-cream pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-warm-cream/10 pb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Logo showText={true} size={40} className="filter brightness-110" />
          <p className="text-warm-cream/70 text-sm mt-2 max-w-xs leading-relaxed">
            Connecting volunteers, verified organizations, events, and donation drives to build stronger, warmer local communities.
          </p>
        </div>

        {/* Community Column */}
        <div>
          <h4 className="font-serif text-lg font-bold text-soft-mint mb-5">Community</h4>
          <ul className="flex flex-col gap-3 text-sm text-warm-cream/80">
            <li>
              <Link to="/opportunities" className="hover:text-soft-mint transition-colors">
                Volunteer Opportunities
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-soft-mint transition-colors">
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-soft-mint transition-colors">
                Donation Drive
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-soft-mint transition-colors">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="font-serif text-lg font-bold text-soft-mint mb-5">Support</h4>
          <ul className="flex flex-col gap-3 text-sm text-warm-cream/80">
            <li>
              <Link to="/contact" className="hover:text-soft-mint transition-colors">
                Contact Support
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:text-soft-mint transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-soft-mint transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-soft-mint transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials Column */}
        <div>
          <h4 className="font-serif text-lg font-bold text-soft-mint mb-5">Connect</h4>
          <p className="text-sm text-warm-cream/70 mb-4">Stay updated with volunteer drives near you.</p>
          <div className="flex items-center gap-3">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-green hover:text-white transition-all hover:-translate-y-1"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-green hover:text-white transition-all hover:-translate-y-1"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-green hover:text-white transition-all hover:-translate-y-1"
            >
              <Github size={18} />
            </a>
            <a 
              href="mailto:contact@greenbridge.org" 
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-green hover:text-white transition-all hover:-translate-y-1"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-warm-cream/50 gap-4">
        <div className="flex items-center gap-4">
          <span className="font-serif font-semibold text-soft-mint">GreenBridge</span>
          <span>•</span>
          <span className="italic">Bring the Change.</span>
          <span>•</span>
          <span>Connecting People Who Care.</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} GreenBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

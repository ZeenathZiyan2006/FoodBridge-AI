import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#123C2D] text-[#E8F5ED]/80 text-sm mt-auto border-t border-[#16865B]/20 relative overflow-hidden">
      {/* Subtle organic light accent in the background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#16865B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#42B883]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand & Project Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#16865B] text-white flex items-center justify-center shadow-md shadow-[#16865B]/20">
                <Leaf className="w-5 h-5 text-[#E8F5ED]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-extrabold text-white tracking-tight">
                  FoodBridge AI
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#16865B]/40 text-[#42B883] px-2 py-0.5 rounded-full border border-[#42B883]/30">
                  Smart Surplus
                </span>
              </div>
            </div>

            <p className="text-xs text-[#E8F5ED]/70 max-w-sm leading-relaxed">
              Empowering commercial kitchens, hostels, restaurants, and caterers to seamlessly redirect edible surplus meals to orphanages and community shelters through intelligent, explainable AI matchmaking.
            </p>

            {/* GitHub Project Showcase Pill */}
            <div className="pt-2">
              <a
                href="https://github.com/ZeenathZiyan2006/FoodBridge-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-heading font-bold border border-white/15 transition-all duration-200 group shadow-xs hover:border-[#42B883]/50 cursor-pointer"
              >
                {/* Official GitHub SVG Icon */}
                <svg className="w-4 h-4 fill-current text-white group-hover:text-[#42B883] transition-colors" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#E8F5ED]/60 group-hover:text-[#42B883] group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </div>

          {/* Platform Exploration */}
          <div>
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42B883]" />
              <span>Platform Modules</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/available-food" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  <span>Available Food Feed</span>
                </Link>
              </li>
              <li>
                <Link to="/matching" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  <span>AI Matching Engine</span>
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  <span>Sustainability Impact</span>
                </Link>
              </li>
              <li>
                <Link to="/hotspots" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  <span>Waste Hotspot Intelligence</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* User Dashboards */}
          <div>
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9A23B]" />
              <span>Portals & Workflows</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/donor-dashboard" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  <span>Food Donor Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/receiver-dashboard" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  <span>Receiver Shelter Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/add-donation" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  <span>List Surplus Batch</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  <span>Account Authentication</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Sustainability Framework */}
          <div>
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16865B]" />
              <span>UN SDGs Aligned</span>
            </h4>
            <div className="space-y-2 text-xs text-[#E8F5ED]/70 leading-relaxed">
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#E9A23B] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                <span>Zero Hunger (SDG 2)</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">12</span>
                <span>Responsible Consumption (SDG 12)</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#16865B] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">13</span>
                <span>Climate Action (SDG 13)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8F5ED]/60 gap-4">
          <p>© 2026 FoodBridge AI. Powered by Intelligent Algorithmic Redistribution.</p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="https://github.com/ZeenathZiyan2006/FoodBridge-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#42B883] hover:underline font-semibold flex items-center gap-1"
            >
              <span>ZeenathZiyan2006/FoodBridge-AI</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="text-[#E8F5ED]/80 font-medium">FSSAI Hygiene Compliant</span>
            <span>•</span>
            <span className="text-[#E8F5ED]/80 font-medium">Zero Waste Mission</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

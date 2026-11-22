import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1F2937] text-gray-400 text-sm mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#14532D] text-white flex items-center justify-center font-bold">
                <Leaf className="w-4 h-4 text-[#ECFDF5]" />
              </div>
              <span className="font-heading text-lg font-bold text-white tracking-tight">FoodBridge AI</span>
            </div>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              An intelligent, full-stack food surplus redistribution platform developed for the <strong>College Innovation Project Exhibition</strong> under the category <strong>Sustainability & Environment</strong>.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800/90 border border-gray-700 text-emerald-300 text-xs font-medium">
              <Leaf className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Theme: "Technology for a Sustainable and Smarter Future"</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="font-heading text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/available-food" className="hover:text-white transition">Available Food Feed</Link>
              </li>
              <li>
                <Link to="/matching" className="hover:text-white transition">AI Matching Engine</Link>
              </li>
              <li>
                <Link to="/hotspots" className="hover:text-white transition">Food Waste Hotspots</Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition">Impact Tracker</Link>
              </li>
            </ul>
          </div>

          {/* Exhibition & Tech Info */}
          <div>
            <h4 className="font-heading text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">
              Technical Architecture
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-2.5">
              Python FastAPI backend with SQLite ORM, React Vite frontend, Tailwind CSS, and a 4-factor recommendation algorithm.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>100% Free & Locally Runnable</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 FoodBridge AI. Smart Food Redistribution Platform.</p>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-semibold">Manipal & Udupi Regional Pilot</span>
            <span>•</span>
            <Link to="/impact" className="hover:text-gray-300">UN SDG 2, 12 & 13</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

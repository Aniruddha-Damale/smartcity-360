import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Shield, HeartHandshake, Sparkles, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800">
      {/* Emergency Banner */}
      <div className="bg-rose-950/40 border-b border-rose-900/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-rose-200">
              Metropolitan 24/7 Emergency Response Helpline:
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-900/60 text-white font-mono text-xs font-bold border border-rose-700/50">
              112 / 108
            </span>
          </div>
          <Link
            to="/safety"
            className="text-xs font-semibold text-rose-300 hover:text-white underline underline-offset-4 flex items-center gap-1"
          >
            Access Emergency Services Directory →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-900/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">SmartCity </span>
                <span className="font-extrabold text-xl text-brand-400">360</span>
                <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
                  Integrated Urban Management Platform
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering citizens and municipal directorates with AI-driven grievance dispatch, real-time IoT infrastructure telemetry, and transparent civic governance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-3 py-1.5 rounded-lg w-fit">
              <Sparkles className="w-4 h-4" />
              <span>AI Auto-Triage & Geospatial Triangulation Active</span>
            </div>
          </div>

          {/* Quick Civic Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Civic Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/report" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Report Civic Problem
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-white transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  Interactive City Map
                </Link>
              </li>
              <li>
                <Link to="/officer" className="hover:text-white transition-colors">
                  Officer Redressal Queue
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Command & Control
                </Link>
              </li>
            </ul>
          </div>

          {/* Infrastructure Modules */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              IoT Modules
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/traffic" className="hover:text-white transition-colors">
                  Traffic & Urban Transit
                </Link>
              </li>
              <li>
                <Link to="/water" className="hover:text-white transition-colors">
                  Water Supply & Leaks
                </Link>
              </li>
              <li>
                <Link to="/waste" className="hover:text-white transition-colors">
                  Smart Waste & Bins
                </Link>
              </li>
              <li>
                <Link to="/energy" className="hover:text-white transition-colors">
                  Streetlights & Energy
                </Link>
              </li>
              <li>
                <Link to="/drainage" className="hover:text-white transition-colors">
                  Drainage & Flood Alerts
                </Link>
              </li>
              <li>
                <Link to="/environment" className="hover:text-white transition-colors">
                  AQI & Environment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Municipal Helpdesk
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Central Civic Secretariat, Metropolitan City Hall</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll-Free: 1800-360-CITY</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@smartcity360.gov</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ISO 27001 Certified Security</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SmartCity 360 Metropolitan Authority. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Citizen Rights SLA</span>
            <span className="hover:text-slate-400 cursor-pointer">Open Data API</span>
            <span className="text-slate-600 font-mono">v1.0.0-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

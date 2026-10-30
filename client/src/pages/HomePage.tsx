import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, PlusCircle, ArrowRight, ShieldCheck, 
  MapPin, Clock, CheckCircle2, AlertTriangle, 
  Droplets, Trash2, Zap, Car, Wind, Waves, 
  Sparkles, Radio, ChevronRight, BarChart3, Users, Eye
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { CityMap } from '../components/CityMap';
import { Complaint } from '../types';

interface HomePageProps {
  onSelectComplaint?: (c: Complaint) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectComplaint }) => {
  const { complaints, summary, announcements, departments } = useCityData();

  const totalReports = complaints.length;
  const resolvedReports = complaints.filter(c => c.status === 'resolved').length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 88;
  const criticalCount = complaints.filter(c => c.priority === 'critical' && c.status !== 'resolved').length;

  const serviceModules = [
    {
      title: 'Roads & Potholes',
      desc: 'Report cratered roads, damaged pavements, broken curbs, and bridge maintenance.',
      icon: Car,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
      link: '/report?cat=roads',
      sla: '36h SLA'
    },
    {
      title: 'Water Supply & Leaks',
      desc: 'Pipeline bursts, dirty water telemetry, low pressure, and sewage overflows.',
      icon: Droplets,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
      link: '/water',
      sla: '24h SLA'
    },
    {
      title: 'Smart Waste & Bins',
      desc: 'Overflowing public dumpsters, missed collection routes, and hazardous waste.',
      icon: Trash2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      link: '/waste',
      sla: '18h SLA'
    },
    {
      title: 'Streetlights & Energy',
      desc: 'Dark streets, faulty solar streetlamps, sparking transformers, and live wires.',
      icon: Zap,
      color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
      link: '/energy',
      sla: '24h SLA'
    },
    {
      title: 'Traffic & Urban Mobility',
      desc: 'Signal malfunctions, congestion hotspots, blocked lanes, and illegal parking.',
      icon: Car,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      link: '/traffic',
      sla: '12h SLA'
    },
    {
      title: 'Drainage & Flood Alerts',
      desc: 'Monsoon waterlogging, choked stormwater canals, and drainage telemetry.',
      icon: Waves,
      color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
      link: '/drainage',
      sla: '12h SLA'
    },
    {
      title: 'Air Quality & Environment',
      desc: 'Industrial smoke, noise pollution, garbage burning, and public park upkeep.',
      icon: Wind,
      color: 'bg-teal-500/10 text-teal-600 border-teal-200',
      link: '/environment',
      sla: '48h SLA'
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Ambient Grid Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Live City Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
              <span>SmartCity 360 AI-Powered Urban Management Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              One Platform. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-teal-300 to-emerald-400">
                Every Civic Problem.
              </span>{' '}
              Smarter Solutions.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Empowering citizens, municipal field squads, and city leaders with instantaneous grievance dispatch, geospatial AI triage, and real-time infrastructure telemetry.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/report"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Report a Civic Problem
              </Link>
              <Link
                to="/citizen"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/20 backdrop-blur-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-5 h-5 text-brand-300" />
                Explore City Dashboard
              </Link>
            </div>

            {/* Quick Live Counters from DB */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalReports}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Total Civic Issues</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{resolvedReports}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Successfully Resolved</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-400">{resolutionRate}%</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Resolution Rate SLA</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">7</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Active Municipal Boards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              Municipal Directorates
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Integrated Civic Services & Telemetry
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select any municipal department to report problems, view live sensor feeds, or track active maintenance.
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800"
          >
            Universal Report Form →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serviceModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.link}
                className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {item.sla}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600 group-hover:text-brand-700">
                  <span>Access Module</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Live Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4" />
                Geospatial Incident Triangulation
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Live Metropolitan Incident Map
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time tracking of active civic reports, IoT threshold triggers, and resolved infrastructure works.
              </p>
            </div>
            <Link
              to="/map"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
            >
              <Eye className="w-4 h-4" />
              Open Fullscreen City Map
            </Link>
          </div>

          <CityMap
            complaints={complaints}
            height="440px"
            onSelectComplaint={onSelectComplaint}
          />
        </div>
      </section>

      {/* How It Works: 3 Steps */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Transparent Redressal
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              How SmartCity 360 Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              From submission to ground dispatch and civic audit in three streamlined steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 font-bold text-lg flex items-center justify-center mb-5 border border-brand-100">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                1. Citizen Reports with Photo & GPS
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log any civic problem in 60 seconds with camera evidence, geolocation pin, and landmark details. Manual location supported.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 font-bold text-lg flex items-center justify-center mb-5 border border-purple-100">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                2. AI Triages & Dispatches Squad
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                CityAssist AI predicts severity, filters duplicates, categorizes the grievance, and assigns the correct municipal department instantly.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-lg flex items-center justify-center mb-5 border border-emerald-100">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                3. On-Ground Resolution & Feedback
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Municipal squads fix the issue, upload resolution photographs, and citizens verify the work with ratings or 1-click reopen audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Announcements & Alerts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Official Bulletins
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
              Municipal Notices & Public Advisories
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-brand-100 text-brand-700'
                  }`}>
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(ann.published_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{ann.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {ann.content}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>By {ann.author_name}</span>
                <span className="text-brand-600 font-semibold cursor-pointer">Read advisory</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Emergency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-brand-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 inline-block">
              Immediate Civic Assistance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Notice a dangerous urban hazard right now?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Open live wires, flooding mainlines, and road sinkholes receive automated top-tier priority dispatch across municipal emergency command.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/report"
              className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold text-center shadow-lg transition-all"
            >
              Report Emergency Hazard
            </Link>
            <Link
              to="/safety"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold text-center border border-white/20 transition-all"
            >
              Emergency Directory (112)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, Search, Filter, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, MapPin, Building2, 
  RotateCcw, Sparkles, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCityData } from '../context/CityDataContext';
import { Complaint, ComplaintStatus } from '../types';

interface CitizenDashboardPageProps {
  onSelectComplaint: (c: Complaint) => void;
}

export const CitizenDashboardPage: React.FC<CitizenDashboardPageProps> = ({ onSelectComplaint }) => {
  const { user } = useAuth();
  const { complaints } = useCityData();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints for this citizen (or demo complaints)
  const myComplaints = complaints; // In demo mode, shows registered citizen reports

  const total = myComplaints.length;
  const pending = myComplaints.filter(c => ['submitted', 'under_review', 'verified', 'assigned'].includes(c.status)).length;
  const inProgress = myComplaints.filter(c => c.status === 'in_progress').length;
  const resolved = myComplaints.filter(c => c.status === 'resolved').length;
  const reopened = myComplaints.filter(c => c.status === 'reopened').length;

  const filtered = myComplaints.filter(c => {
    if (activeFilter !== 'all' && c.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.reference_number.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusColor = (s: ComplaintStatus) => {
    switch (s) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reopened':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'rejected':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'high':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Citizen Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
              CITIZEN PORTAL
            </span>
            <span className="text-xs text-slate-400">Ward 4 - Downtown Central</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {user?.full_name || 'Citizen'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Track your civic reports, inspect audit resolution timelines, and submit feedback on completed municipal repairs.
          </p>
        </div>

        <Link
          to="/report"
          className="px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          Report New Problem
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Logged</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{total}</p>
          <p className="text-[11px] text-slate-400 mt-1">Submitted grievances</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>In Review & Assigned</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{pending}</p>
          <p className="text-[11px] text-slate-400 mt-1">Dispatched to squad</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>In Progress</span>
            <RotateCcw className="w-4 h-4 text-blue-500 animate-spin" />
          </div>
          <p className="text-3xl font-extrabold text-blue-600">{inProgress}</p>
          <p className="text-[11px] text-slate-400 mt-1">Field squad working</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{resolved}</p>
          <p className="text-[11px] text-slate-400 mt-1">Repairs completed</p>
        </div>
      </div>

      {/* Main Complaints List & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-6 border-b border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Issues' },
              { id: 'submitted', label: 'Submitted' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'resolved', label: 'Resolved' },
              { id: 'reopened', label: 'Reopened' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, ref #, or ward..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Complaints Items */}
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No Complaints in this view</h3>
              <p className="text-xs text-slate-500">
                You currently have no issues matching the filter criteria.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="p-5 sm:p-6 hover:bg-slate-50/80 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {item.image_urls && item.image_urls[0] ? (
                    <img
                      src={item.image_urls[0]}
                      alt="Thumbnail"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500">
                        #{item.reference_number}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityBadge(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {item.ward}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-brand-500" />
                        {item.assigned_department_name}
                      </span>
                      <span>&bull;</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-bold text-brand-600 group-hover:underline">
                    Inspect Timeline
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-brand-600 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

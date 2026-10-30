import React, { useState } from 'react';
import { 
  Building2, CheckCircle2, Clock, AlertTriangle, 
  Search, Filter, ChevronRight, UserCheck, Shield, 
  MapPin, AlertCircle, Wrench, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCityData } from '../context/CityDataContext';
import { Complaint, ComplaintStatus } from '../types';

interface OfficerDashboardPageProps {
  onSelectComplaint: (c: Complaint) => void;
}

export const OfficerDashboardPage: React.FC<OfficerDashboardPageProps> = ({ onSelectComplaint }) => {
  const { user } = useAuth();
  const { complaints, departments } = useCityData();

  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    user?.department_id || 'dept-roads'
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentDept = departments.find(d => d.id === selectedDeptId);

  // Department complaints
  const deptComplaints = complaints.filter(c => c.assigned_department_id === selectedDeptId);

  const pendingCount = deptComplaints.filter(c => ['submitted', 'under_review', 'verified', 'assigned'].includes(c.status)).length;
  const inProgressCount = deptComplaints.filter(c => c.status === 'in_progress').length;
  const resolvedCount = deptComplaints.filter(c => c.status === 'resolved').length;
  const criticalCount = deptComplaints.filter(c => c.priority === 'critical' && c.status !== 'resolved').length;

  const filtered = deptComplaints.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
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

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical':
        return 'text-rose-700 bg-rose-100 border-rose-300 font-bold';
      case 'high':
        return 'text-amber-700 bg-amber-100 border-amber-300 font-bold';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getStatusBadge = (s: ComplaintStatus) => {
    switch (s) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reopened':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
              OFFICER DISPATCH CONSOLE
            </span>
            <span className="text-xs text-slate-400">
              {currentDept?.name || 'Department of Roads & Infrastructure'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Department Triage Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Review reported grievances, dispatch field repair squads, update lifecycle statuses, and manage departmental SLA compliance ({currentDept?.sla_hours || 36}h).
          </p>
        </div>

        {/* Switch Department Dropdown */}
        <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md self-stretch md:self-auto">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
            Active Department Queue
          </label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full text-xs font-bold bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} (SLA: {d.sla_hours}h)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Critical Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600">{criticalCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Requires immediate dispatch</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Awaiting Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{pendingCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">In triage queue</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Squads On-Ground</span>
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-blue-600">{inProgressCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Repairs in progress</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Resolved (30d)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{resolvedCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Inspected & cleared</p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="reopened">Reopened</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ref #, title, or ward..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-6">Ref ID</th>
                <th className="py-3.5 px-6">Problem Title & Ward</th>
                <th className="py-3.5 px-6">Priority</th>
                <th className="py-3.5 px-6">Lifecycle Status</th>
                <th className="py-3.5 px-6">SLA Due</th>
                <th className="py-3.5 px-6 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No department complaints matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onSelectComplaint(item)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-slate-700">
                      #{item.reference_number}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {item.ward} &bull; {item.address_text}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase border ${getPriorityBadge(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                      {item.sla_due_at ? new Date(item.sla_due_at).toLocaleDateString() : '36h'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint(item);
                        }}
                        className="px-3.5 py-1.5 bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-600 font-bold rounded-lg border border-brand-200 transition-all text-xs"
                      >
                        Update / Dispatch →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

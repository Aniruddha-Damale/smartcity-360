import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { 
  Building2, Shield, Users, Clock, AlertTriangle, 
  CheckCircle2, TrendingUp, Search, Filter, 
  ArrowUpRight, ArrowDownRight, Layers, FileText
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { Complaint } from '../types';

interface AdminDashboardPageProps {
  onSelectComplaint: (c: Complaint) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onSelectComplaint }) => {
  const { complaints, departments, summary } = useCityData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Analytics Calculations
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const critical = complaints.filter(c => c.priority === 'critical' && c.status !== 'resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 88;

  // Category chart data
  const categoryCounts: Record<string, number> = {};
  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryCounts).map(k => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    count: categoryCounts[k]
  }));

  // Status donut data
  const statusData = [
    { name: 'Resolved', value: resolved, color: '#10b981' },
    { name: 'In Progress', value: inProgress, color: '#3b82f6' },
    { name: 'Submitted / Review', value: complaints.filter(c => ['submitted', 'under_review'].includes(c.status)).length, color: '#f59e0b' },
    { name: 'Assigned', value: complaints.filter(c => c.status === 'assigned').length, color: '#8b5cf6' },
    { name: 'Reopened', value: complaints.filter(c => c.status === 'reopened').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Weekly Trend Data
  const weeklyTrends = [
    { day: 'Mon', reported: 12, resolved: 9 },
    { day: 'Tue', reported: 18, resolved: 14 },
    { day: 'Wed', reported: 22, resolved: 19 },
    { day: 'Thu', reported: 17, resolved: 16 },
    { day: 'Fri', reported: 25, resolved: 21 },
    { day: 'Sat', reported: 14, resolved: 12 },
    { day: 'Sun', reported: 9, resolved: 8 },
  ];

  const filteredComplaints = complaints.filter(c => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.reference_number.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.assigned_department_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Command Center Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
              METROPOLITAN COMMAND
            </span>
            <span className="text-xs text-slate-400">City Executive Central Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Smart City Operations & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Live telemetry, inter-departmental grievance dispatch analytics, automated SLA performance tracking, and municipal resource allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md text-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Avg SLA Response
            </span>
            <span className="text-lg font-mono font-extrabold text-emerald-400">21.4 hrs</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md text-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Satisfaction
            </span>
            <span className="text-lg font-mono font-extrabold text-brand-300">4.7 / 5.0</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Total Grievances</span>
            <Layers className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{total}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14% vs last week</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>SLA Resolution Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{resolutionRate}%</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-2">
            <span>Target: &gt;85% compliance</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Field Work In Progress</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-blue-600">{inProgress}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-2">
            <span>7 active field squads</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Critical Severity Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600">{critical}</p>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-2">
            <span>Emergency priority</span>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Trend Line Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Weekly Grievance Inflow vs Resolution SLA
              </h3>
              <p className="text-xs text-slate-500">7-day rolling incident progression</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Telemetry
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="reported"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  name="Reports Logged"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  name="Resolved"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Lifecycle Status Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution across active complaints</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="truncate">{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Complaints by Civic Category</h3>
          <p className="text-xs text-slate-500">Aggregated complaints across municipal service sectors</p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Master Complaints & Audit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Master Metropolitan Audit Log
            </h3>
            <p className="text-xs text-slate-500">Complete database records with full audit trail</p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference #, title, or ward..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Title & Location</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.slice(0, 10).map((comp) => (
                <tr
                  key={comp.id}
                  onClick={() => onSelectComplaint(comp)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    #{comp.reference_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {comp.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{comp.ward}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {comp.assigned_department_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      comp.priority === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {comp.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                      {comp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {new Date(comp.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComplaint(comp);
                      }}
                      className="px-2.5 py-1 text-brand-600 hover:text-brand-800 font-bold text-xs"
                    >
                      Audit →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

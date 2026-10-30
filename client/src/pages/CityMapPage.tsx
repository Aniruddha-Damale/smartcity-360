import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Filter, Search, PlusCircle, Layers, 
  Eye, CheckCircle2, AlertTriangle, Compass
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { CityMap } from '../components/CityMap';
import { Complaint } from '../types';

interface CityMapPageProps {
  onSelectComplaint: (c: Complaint) => void;
}

export const CityMapPage: React.FC<CityMapPageProps> = ({ onSelectComplaint }) => {
  const { complaints } = useCityData();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');

  const filtered = complaints.filter(c => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    if (wardFilter !== 'all' && c.ward !== wardFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Map Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            Geospatial Urban Visualization
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interactive City Incident Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Displaying {filtered.length} geolocated municipal incidents and infrastructure alerts.
          </p>
        </div>

        <Link
          to="/report"
          className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report Problem Here
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters:</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="roads">Roads & Potholes</option>
          <option value="water">Water & Leaks</option>
          <option value="waste">Waste & Sanitation</option>
          <option value="energy">Streetlights & Energy</option>
          <option value="traffic">Traffic & Signals</option>
          <option value="drainage">Drainage & Floods</option>
          <option value="env">Environment & AQI</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
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
          <option value="critical">Critical (!)</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
        >
          <option value="all">All Wards</option>
          <option value="Ward 1 - North Riverside">Ward 1 - North Riverside</option>
          <option value="Ward 2 - East Harbor">Ward 2 - East Harbor</option>
          <option value="Ward 3 - West End District">Ward 3 - West End District</option>
          <option value="Ward 4 - Downtown Central">Ward 4 - Downtown Central</option>
          <option value="Ward 5 - South Metropolis">Ward 5 - South Metropolis</option>
        </select>

        {(categoryFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || wardFilter !== 'all') && (
          <button
            onClick={() => {
              setCategoryFilter('all');
              setStatusFilter('all');
              setPriorityFilter('all');
              setWardFilter('all');
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Map Box */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-sm">
        <CityMap
          complaints={filtered}
          height="620px"
          onSelectComplaint={onSelectComplaint}
        />
      </div>
    </div>
  );
};

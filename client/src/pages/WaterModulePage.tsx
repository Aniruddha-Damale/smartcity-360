import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, AlertTriangle, Clock, CheckCircle2, 
  MapPin, PlusCircle, Gauge, Activity, Waves
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

export const WaterModulePage: React.FC = () => {
  const { sensors, complaints } = useCityData();
  const waterSensors = sensors.filter(s => s.module_type === 'water');
  const waterComplaints = complaints.filter(c => c.category === 'water');

  const schedules = [
    { zone: 'Ward 1 & 2 (North & East)', morning: '06:00 AM - 09:30 AM', evening: '05:30 PM - 08:30 PM', status: 'Normal Pressure' },
    { zone: 'Ward 3 (West End)', morning: '06:30 AM - 10:00 AM', evening: '06:00 PM - 09:00 PM', status: 'Normal Pressure' },
    { zone: 'Ward 4 (Downtown Central)', morning: '05:30 AM - 09:00 AM', evening: '05:00 PM - 08:00 PM', status: 'Maintenance Pipeline Detour' },
    { zone: 'Ward 5 (South Metropolis)', morning: '07:00 AM - 10:30 AM', evening: '06:30 PM - 09:30 PM', status: 'Normal Pressure' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold">
              IOT HYDRO METRICS
            </span>
            <span className="text-xs text-slate-400">Potable Water & Sewerage Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Smart Water Supply & Leakage Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time pipeline acoustic telemetry, reservoir storage monitoring, supply scheduling, and rapid pipeline burst mitigation.
          </p>
        </div>

        <Link
          to="/report?cat=water"
          className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          Report Water Leak / Burst
        </Link>
      </div>

      {/* IoT Sensors Dashboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Municipal Reservoir & Feeder Sensors</h2>
            <p className="text-xs text-slate-500">Live pressure, water level %, and flow rate telemetry</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            Simulated IoT Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {waterSensors.map((sensor) => (
            <div
              key={sensor.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                  <Droplets className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                  {sensor.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{sensor.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  {sensor.ward} &bull; {sensor.location_name}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-3 gap-2 text-xs text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Level</span>
                  <span className="font-extrabold text-sky-600 font-mono text-base">
                    {sensor.last_telemetry?.tank_level_percent || 78}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pressure</span>
                  <span className="font-extrabold text-slate-800 font-mono text-base">
                    {sensor.last_telemetry?.pressure_bar || 4.2} bar
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Flow</span>
                  <span className="font-extrabold text-slate-800 font-mono text-base">
                    {sensor.last_telemetry?.flow_rate_lps || 120} L/s
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-2">
                <span>Alert: No anomaly</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Municipal Water Supply Schedules */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Official Municipal Potable Supply Schedule</h2>
          <p className="text-xs text-slate-500">Timed pressurized drinking water supply distribution across metropolitan zones</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Distribution Zone</th>
                <th className="py-3 px-4">Morning Cycle</th>
                <th className="py-3 px-4">Evening Cycle</th>
                <th className="py-3 px-4">Grid Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.zone}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{row.morning}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{row.evening}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status.includes('Maintenance') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {row.status}
                    </span>
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

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Waves, AlertTriangle, CloudRain, Shield, 
  MapPin, PlusCircle, ArrowUpRight, Gauge
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

export const DrainageModulePage: React.FC = () => {
  const { sensors, complaints } = useCityData();
  const drainageSensors = sensors.filter(s => s.module_type === 'drainage');

  const floodHotspots = [
    { zone: 'Underpass - Central Metro Link', risk: 'High', level: '1.4m clearance', status: 'Pump Station Active' },
    { zone: 'Riverside Boulevard (Ward 1)', risk: 'Moderate', level: '2.1m clearance', status: 'Normal Inflow' },
    { zone: 'Industrial Canal West (Ward 3)', risk: 'Low', level: '3.0m clearance', status: 'De-silted' },
    { zone: 'Harbor Lowlands (Ward 2)', risk: 'Moderate', level: '1.8m clearance', status: 'Sluice Gates Open' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
              STORMWATER & FLOOD CONTROL
            </span>
            <span className="text-xs text-slate-400">Emergency Canal Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Smart Drainage & Flood Mitigation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Live ultrasonic canal water-level telemetry, monsoon waterlogging alerts, pump station automated dispatch, and storm drain clearing.
          </p>
        </div>

        <Link
          to="/report?cat=drainage"
          className="px-6 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          Report Blocked Drain / Flood
        </Link>
      </div>

      {/* Weather & Rainfall Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Precipitation Telemetry</span>
            <CloudRain className="w-5 h-5 text-cyan-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">18.4 mm/hr</p>
          <span className="text-[11px] text-slate-500 block">Metropolitan Doppler Weather Radar</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Sump Pump Stations</span>
            <Gauge className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono">14 / 14 Operational</p>
          <span className="text-[11px] text-slate-500 block">Automated backup diesel generators active</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Canal Sluice Gates</span>
            <Waves className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-600 font-mono">4 Gates Open (65%)</p>
          <span className="text-[11px] text-slate-500 block">Gravity flow diversion to tidal bay</span>
        </div>
      </div>

      {/* Flood Hotspots Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Monsoon Vulnerability & Waterlogging Hotspots</h2>
          <p className="text-xs text-slate-500">Continuous ultrasonic water depth sensors at low-lying arterial underpasses</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Canal / Underpass Location</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">Depth Clearance</th>
                <th className="py-3 px-4">Sump System State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {floodHotspots.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{h.zone}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      h.risk === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {h.risk} Risk
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{h.level}</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold">{h.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

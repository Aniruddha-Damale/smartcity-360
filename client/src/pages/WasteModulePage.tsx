import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, AlertTriangle, CheckCircle2, Clock, 
  MapPin, PlusCircle, RefreshCw, Sparkles, Recycle
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

export const WasteModulePage: React.FC = () => {
  const { sensors, complaints } = useCityData();
  const wasteSensors = sensors.filter(s => s.module_type === 'waste');
  const wasteComplaints = complaints.filter(c => c.category === 'waste');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              IOT SANITATION & BINS
            </span>
            <span className="text-xs text-slate-400">Waste Management Directorate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Smart Waste & Sanitation Directorate
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Ultrasonic smart dustbin fill level telemetry, dynamic truck routing, garbage overflow redressal, and civic recycling initiatives.
          </p>
        </div>

        <Link
          to="/report?cat=waste"
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          Report Overflowing Bin / Dump
        </Link>
      </div>

      {/* Smart Dustbins Telemetry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ultrasonic Smart Bin Telemetry</h2>
            <p className="text-xs text-slate-500">Live fill level % with automatic alert when threshold exceeds 80%</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            Automated Alert Threshold: 80%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wasteSensors.map((sensor) => {
            const fill = sensor.last_telemetry?.fill_level_percent || 65;
            const isHigh = fill >= 80;
            return (
              <div
                key={sensor.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm space-y-4 ${
                  isHigh ? 'border-rose-300 ring-2 ring-rose-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isHigh ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    isHigh ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isHigh ? 'Threshold Exceeded' : 'Normal'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{sensor.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {sensor.ward} &bull; {sensor.location_name}
                  </p>
                </div>

                {/* Fill Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Fill Level</span>
                    <span className={isHigh ? 'text-rose-600' : 'text-emerald-600'}>
                      {fill}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHigh ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-2">
                  <span>Battery: {sensor.last_telemetry?.battery_percent || 92}%</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Segregation & Recycling Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50/80 rounded-3xl p-6 border border-emerald-200 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="text-sm font-bold text-emerald-950">Green Bin: Wet Organic Waste</h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Kitchen scraps, vegetable peels, leftover food, and garden leaves. Processed into municipal biogas and compost.
          </p>
        </div>

        <div className="bg-blue-50/80 rounded-3xl p-6 border border-blue-200 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="text-sm font-bold text-blue-950">Blue Bin: Dry Recyclables</h3>
          <p className="text-xs text-blue-800 leading-relaxed">
            Paper, cardboard cartons, plastics, metal cans, and rinsed glass bottles. Redirected to automated recovery hubs.
          </p>
        </div>

        <div className="bg-rose-50/80 rounded-3xl p-6 border border-rose-200 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="text-sm font-bold text-rose-950">Red Bin: Hazardous & E-Waste</h3>
          <p className="text-xs text-rose-800 leading-relaxed">
            Expired medications, batteries, aerosol cans, paint, CFL bulbs, and electronic circuit boards. Special disposal required.
          </p>
        </div>
      </div>
    </div>
  );
};

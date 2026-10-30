import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, AlertTriangle, Clock, Navigation, 
  MapPin, CheckCircle2, PlusCircle, Radio, ArrowRight
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

export const TrafficModulePage: React.FC = () => {
  const { sensors, complaints } = useCityData();
  const trafficSensors = sensors.filter(s => s.module_type === 'traffic');

  const trafficComplaints = complaints.filter(c => c.category === 'traffic');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              IOT MOBILITY & TRANSIT
            </span>
            <span className="text-xs text-slate-400">12 Arterial Corridors Monitored</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Smart Traffic & Mobility Directorate
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time arterial congestion telemetry, automated traffic signal cycle optimization, road detour advisories, and public transit tracking.
          </p>
        </div>

        <Link
          to="/report?cat=traffic"
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          Report Traffic Hazard
        </Link>
      </div>

      {/* Traffic Sensors Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Arterial Intersection Sensors</h2>
            <p className="text-xs text-slate-500">Live IoT telemetry for vehicle velocity and congestion density</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            Simulated Sensor Feeds Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trafficSensors.map((sensor) => (
            <div
              key={sensor.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Car className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  sensor.status === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
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

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Density</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">
                    {sensor.last_telemetry?.density || 'Moderate'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Speed</span>
                  <span className="font-bold text-indigo-600 font-mono text-sm">
                    {sensor.last_telemetry?.avg_speed || '24'} km/h
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 block text-right font-mono">
                Updated {new Date(sensor.last_telemetry?.timestamp || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Road Closures & Active Reports */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Transit & Congestion Grievances</h2>
            <p className="text-xs text-slate-500">Citizen reported and officer verified traffic incidents</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {trafficComplaints.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">No active traffic complaints reported.</p>
          ) : (
            trafficComplaints.map((c) => (
              <div key={c.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-500">#{c.reference_number}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-500">{c.ward} &bull; {c.address_text}</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

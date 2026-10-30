import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, AlertTriangle, Moon, Sun, PlusCircle, 
  Lightbulb, Activity, CheckCircle2, ShieldAlert, Sparkles
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

export const EnergyModulePage: React.FC = () => {
  const { complaints } = useCityData();
  const energyComplaints = complaints.filter(c => c.category === 'energy');

  // Simulated Streetlight Controls State
  const [ambientLight, setAmbientLight] = useState<'day' | 'dusk' | 'night'>('night');
  const [motionDetected, setMotionDetected] = useState(false);
  const [overridePower, setOverridePower] = useState(true);

  // Compute simulated streetlight brightness
  let simulatedBrightness = 0;
  if (!overridePower) {
    simulatedBrightness = 0;
  } else if (ambientLight === 'day') {
    simulatedBrightness = 0;
  } else if (ambientLight === 'dusk') {
    simulatedBrightness = motionDetected ? 80 : 30;
  } else {
    // night
    simulatedBrightness = motionDetected ? 100 : 40;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              SMART ILLUMINATION & GRID
            </span>
            <span className="text-xs text-slate-400">Electrical & Streetlight Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Smart Streetlights & Energy Grid
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Adaptive LED street illumination, solar micro-grid telemetry, broken lamp reporting, and energy conservation algorithms.
          </p>
        </div>

        <Link
          to="/report?cat=streetlights"
          className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          Report Broken Light / Wire
        </Link>
      </div>

      {/* Streetlight Simulation Console */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Interactive Civic Demo
            </div>
            <h2 className="text-lg font-bold text-slate-900">Adaptive Smart Streetlight Simulator</h2>
            <p className="text-xs text-slate-500">
              Demonstrates automatic illumination scaling based on ambient lux sensors and pedestrian motion.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 self-start sm:self-auto">
            Simulated Controls (Safe)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 text-white p-6 sm:p-8 rounded-3xl">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Simulated Ambient Sky Condition
              </label>
              <div className="flex gap-2">
                {(['day', 'dusk', 'night'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAmbientLight(mode)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                      ambientLight === mode
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Pedestrian / Vehicle Radar Detection
              </label>
              <button
                onClick={() => setMotionDetected(!motionDetected)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                  motionDetected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {motionDetected ? '⚡ Motion Detected (Boost to Full Brightness)' : '○ No Movement Detected (Idle Dimmed Mode)'}
              </button>
            </div>
          </div>

          {/* Visualization Output */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800 text-center space-y-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl"
              style={{
                backgroundColor: simulatedBrightness > 0 ? '#f59e0b' : '#334155',
                boxShadow: simulatedBrightness > 0 ? `0 0 ${simulatedBrightness * 0.6}px rgba(245,158,11,0.8)` : 'none',
                opacity: Math.max(0.2, simulatedBrightness / 100),
              }}
            >
              <Lightbulb className="w-10 h-10 text-white" />
            </div>

            <div>
              <span className="text-3xl font-extrabold text-amber-400 font-mono">
                {simulatedBrightness}%
              </span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Calculated LED Output Power
              </p>
            </div>

            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              Conserves up to 64% energy across municipal arterial roads by dimming fixtures during late hours until radar motion is triggered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

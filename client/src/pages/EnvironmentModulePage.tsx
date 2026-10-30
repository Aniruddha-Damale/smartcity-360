import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wind, Thermometer, Volume2, TreePine, 
  MapPin, PlusCircle, AlertTriangle, ShieldCheck, Activity
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';

export const EnvironmentModulePage: React.FC = () => {
  const { sensors, complaints } = useCityData();

  const aqiValue = 68; // Moderate / Good
  const aqiCategory = 'Moderate (Acceptable)';

  const environmentalMetrics = [
    { name: 'PM2.5 Concentration', value: '24.2 µg/m³', status: 'Good', icon: Wind },
    { name: 'PM10 Concentration', value: '48.6 µg/m³', status: 'Moderate', icon: Wind },
    { name: 'Ambient Temperature', value: '28.4 °C', status: 'Normal', icon: Thermometer },
    { name: 'Average Noise Decibel', value: '58.2 dB', status: 'Safe', icon: Volume2 },
    { name: 'Urban Green Canopy', value: '32.4%', status: 'Target Met', icon: TreePine },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
              METROPOLITAN ECO TELEMETRY
            </span>
            <span className="text-xs text-slate-400">Environmental Protection Directorate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Air Quality & Environmental Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time Air Quality Index (AQI) sensor feeds, particulate matter tracking, noise pollution reporting, and urban forestry telemetry.
          </p>
        </div>

        <Link
          to="/report?cat=pollution"
          className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          Report Pollution Hazard
        </Link>
      </div>

      {/* AQI Master Gauge */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Current Metropolitan Ambient Air Status
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Air Quality Index: <span className="text-teal-600">{aqiValue} AQI</span>
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Air quality is generally acceptable for most individuals. Sensitive groups with respiratory conditions should limit prolonged outdoor exertion during peak traffic hours.
          </p>
        </div>

        <div className="p-6 bg-teal-50 rounded-3xl border border-teal-200 flex flex-col items-center justify-center text-center w-full md:w-64">
          <div className="w-24 h-24 rounded-full bg-teal-600 text-white flex flex-col items-center justify-center shadow-lg shadow-teal-600/30 font-mono">
            <span className="text-3xl font-extrabold">{aqiValue}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">US-AQI</span>
          </div>
          <span className="text-xs font-bold text-teal-900 mt-3">{aqiCategory}</span>
        </div>
      </div>

      {/* Environmental Sensor Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {environmentalMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {metric.name}
                </span>
                <span className="text-lg font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {metric.value}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-block">
                {metric.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Phone, Ambulance, Flame, Shield, 
  MapPin, AlertTriangle, PlusCircle, HeartPulse, Hospital
} from 'lucide-react';

export const PublicSafetyPage: React.FC = () => {
  const emergencyNumbers = [
    { name: 'Unified National Emergency (Police / Fire / EMS)', number: '112', desc: 'Single number for all immediate life-safety emergencies', color: 'bg-rose-500 text-white' },
    { name: 'Medical Emergency & Trauma Ambulance', number: '108', desc: 'Advanced life support ambulances & paramedic response', color: 'bg-emerald-600 text-white' },
    { name: 'Fire & Rescue Disaster Service', number: '101', desc: 'Structural fires, chemical spills, and high-angle rescue', color: 'bg-orange-600 text-white' },
    { name: 'Women & Child Safety Helpline', number: '1091', desc: 'Dedicated 24/7 security dispatch & counseling support', color: 'bg-purple-600 text-white' },
    { name: 'Disaster Management & Flood Relief Hub', number: '1077', desc: 'Civil defense, storm rescue squads, and evacuation points', color: 'bg-blue-600 text-white' },
  ];

  const nearbyFacilities = [
    { name: 'Metropolitan General Hospital (Trauma Center Level 1)', ward: 'Ward 4 - Downtown Central', distance: '0.8 km', type: 'Hospital', phone: '+1-555-019-1100' },
    { name: 'Central Police Headquarters (Precinct 1)', ward: 'Ward 4 - Downtown Central', distance: '1.2 km', type: 'Police', phone: '+1-555-019-2200' },
    { name: 'Fire Station Engine Company 4', ward: 'Ward 4 - Downtown Central', distance: '1.5 km', type: 'Fire', phone: '+1-555-019-3300' },
    { name: 'Riverside Community Hospital', ward: 'Ward 1 - North Riverside', distance: '3.4 km', type: 'Hospital', phone: '+1-555-019-4400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Safety Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
              24/7 EMERGENCY RESPONSE DIRECTORY
            </span>
            <span className="text-xs text-slate-400">Metropolitan Public Safety Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Emergency Contacts & Civic Safety Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Verified emergency contact numbers, nearby trauma medical centers, fire and rescue squads, and disaster management guidelines.
          </p>
        </div>

        <Link
          to="/report?cat=safety"
          className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <ShieldAlert className="w-4 h-4" />
          Report Immediate Public Hazard
        </Link>
      </div>

      {/* Emergency Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyNumbers.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xl font-extrabold px-3 py-1 rounded-xl font-mono shadow-sm ${item.color}`}>
                  {item.number}
                </span>
                <Phone className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
            </div>
            <a
              href={`tel:${item.number}`}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center block"
            >
              Dial Now ({item.number})
            </a>
          </div>
        ))}
      </div>

      {/* Nearby Emergency Facilities */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Metropolitan Emergency Stations</h2>
          <p className="text-xs text-slate-500">Nearest police stations, hospital trauma centers, and fire brigades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyFacilities.map((fac, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                    {fac.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{fac.distance} away</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {fac.ward}
                </p>
              </div>
              <a
                href={`tel:${fac.phone}`}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-xs font-semibold shrink-0"
              >
                Call Station
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

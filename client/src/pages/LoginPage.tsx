import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Shield, User, Lock, Mail, 
  ArrowRight, CheckCircle2, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { switchRole, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'citizen@smartcity360.gov', selectedRole, fullName || 'Citizen User');
    if (selectedRole === 'admin') navigate('/admin');
    else if (selectedRole === 'officer') navigate('/officer');
    else navigate('/citizen');
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'officer') navigate('/officer');
    else navigate('/citizen');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-navy-900 flex items-center justify-center text-white mx-auto shadow-md">
            <Building2 className="w-7 h-7 text-brand-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            SmartCity 360 Authentication
          </h2>
          <p className="text-xs text-slate-500">
            Unified citizen redressal and municipal officer portal
          </p>
        </div>

        {/* 1-Click Test Presets */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Instant 1-Click Role Presets (Testing)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('citizen')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all"
            >
              Citizen
            </button>
            <button
              onClick={() => handleQuickLogin('officer')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all"
            >
              Officer
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@smartcity360.gov"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Access Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="citizen">Citizen User</option>
              <option value="officer">Municipal Officer</option>
              <option value="admin">Metropolitan Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

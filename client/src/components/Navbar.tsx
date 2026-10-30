import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, PlusCircle, Bell, MapPin, 
  Menu, X, Shield, Check, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);
    if (newRole === 'citizen') navigate('/citizen');
    else if (newRole === 'officer') navigate('/officer');
    else if (newRole === 'admin') navigate('/admin');
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'officer') return '/officer';
    return '/citizen';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Top Civic Alert Banner for Demo Mode & Role Switcher */}
      <div className="bg-navy-950 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            LIVE PLATFORM
          </span>
          <span className="hidden sm:inline text-slate-400">
            Unified Metropolitan Operations & Citizen Redressal System
          </span>
        </div>

        {/* 1-Click Interactive Role Switcher */}
        <div className="flex items-center gap-1.5 relative">
          <span className="text-slate-400 hidden sm:inline mr-1 text-[11px]">Testing Mode:</span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => handleRoleChange('citizen')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                role === 'citizen' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => handleRoleChange('officer')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                role === 'officer' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Officer
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                role === 'admin' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Command
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">SmartCity</span>
                <span className="font-extrabold text-lg text-brand-600">360</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-1 hidden sm:block">
                Urban Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to={getDashboardPath()}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname.includes('dashboard') || location.pathname === getDashboardPath()
                  ? 'text-brand-600 bg-brand-50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {role === 'admin' ? 'Admin Command' : role === 'officer' ? 'Officer Queue' : 'My Dashboard'}
            </Link>
            <Link
              to="/map"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/map') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              City Map
            </Link>
            <Link
              to="/safety"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/safety') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-600" />
              Emergency & Safety
            </Link>
          </nav>

          {/* Right Action Icons: Notification Bell + Quick Report Button + User Profile */}
          <div className="flex items-center gap-3">
            {/* Report Problem CTA Button */}
            <Link
              to="/report"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Report Problem
            </Link>

            {/* Notification Bell with Badge & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                      <p className="text-xs text-slate-500">{unreadCount} unread civic alerts</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No notifications currently.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.complaint_id) navigate(`/complaints/${n.complaint_id}`);
                            setShowNotifs(false);
                          }}
                          className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                            !n.is_read ? 'bg-brand-50/40' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? 'bg-brand-600' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifs(false)}
                      className="text-xs font-medium text-brand-600 hover:text-brand-800"
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Button / Role Display */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user.full_name}</p>
                  <p className="text-[10px] text-brand-600 font-semibold uppercase tracking-wider">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 md:hidden hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to={getDashboardPath()}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            {role === 'admin' ? 'Admin Command' : role === 'officer' ? 'Officer Queue' : 'My Dashboard'}
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-white bg-brand-600 text-center"
          >
            Report Problem
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
          >
            City Problem Map
          </Link>
          <Link
            to="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
          >
            Emergency & Safety Hotline
          </Link>
        </div>
      )}
    </header>
  );
};

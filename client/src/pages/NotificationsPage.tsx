import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, Clock, AlertTriangle, 
  Trash2, Check, ArrowRight, Filter, Shield
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useCityData } from '../context/CityDataContext';
import { Complaint } from '../types';

interface NotificationsPageProps {
  onSelectComplaint?: (c: Complaint) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onSelectComplaint }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { complaints } = useCityData();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const handleNotificationClick = (complaintId?: string, notifId?: string) => {
    if (notifId) markAsRead(notifId);
    if (complaintId && onSelectComplaint) {
      const found = complaints.find(c => c.id === complaintId);
      if (found) onSelectComplaint(found);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            Civic Alert Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications & Status Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time updates on your submitted reports, municipal notices, and field squad activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filter === 'unread'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Notifications</h3>
            <p className="text-xs text-slate-400">You are completely up to date with municipal alerts.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item.complaint_id, item.id)}
              className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-4 ${
                !item.is_read ? 'bg-brand-50/30' : ''
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                !item.is_read ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-transparent'
              }`} />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(item.created_at).toLocaleDateString()} &bull; {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                {item.complaint_id && (
                  <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1 mt-1">
                    Inspect Complaint Timeline →
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

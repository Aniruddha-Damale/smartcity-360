import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Clock, AlertCircle, 
  CheckCircle2, RefreshCw, Send, Star, Shield, 
  Building2, UserCheck, MessageSquare, ArrowRight, CornerDownRight
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCityData } from '../context/CityDataContext';

interface ComplaintModalProps {
  complaint: Complaint | null;
  onClose: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ complaint, onClose }) => {
  const { user, role } = useAuth();
  const { updateComplaintStatus, assignComplaint, reopenComplaint, submitFeedback, departments } = useCityData();

  const [activeTab, setActiveTab] = useState<'timeline' | 'action' | 'feedback'>('timeline');
  const [submitting, setSubmitting] = useState(false);

  // Officer Update Status Form State
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint?.status || 'in_progress');
  const [statusComment, setStatusComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Reassign Form State
  const [selectedDept, setSelectedDept] = useState(complaint?.assigned_department_id || '');
  const [reassignNotes, setReassignNotes] = useState('');

  // Citizen Reopen Form State
  const [reopenReason, setReopenReason] = useState('');

  // Citizen Feedback State
  const [rating, setRating] = useState(5);
  const [satisfaction, setSatisfaction] = useState<'very_satisfied' | 'satisfied' | 'neutral' | 'dissatisfied'>('very_satisfied');
  const [feedbackComment, setFeedbackComment] = useState('');

  if (!complaint) return null;

  const isOfficerOrAdmin = role === 'officer' || role === 'admin';
  const isCitizen = role === 'citizen';

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateComplaintStatus(complaint.id, {
        status: newStatus,
        updated_by_name: user?.full_name || 'Municipal Officer',
        updated_by_role: role,
        comment: statusComment || `Status officially advanced to ${newStatus.replace('_', ' ').toUpperCase()}`,
        resolution_notes: resolutionNotes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;
    setSubmitting(true);
    try {
      await assignComplaint(complaint.id, {
        department_id: selectedDept,
        assigned_by_name: user?.full_name || 'Admin',
        assigned_by_role: role,
        notes: reassignNotes || 'Reassigned for departmental dispatch.',
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    setSubmitting(true);
    try {
      await reopenComplaint(complaint.id, reopenReason);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitFeedback(complaint.id, {
        rating,
        satisfaction_level: satisfaction,
        comment: feedbackComment,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reopened':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'rejected':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-scale-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/10 text-brand-300 font-bold border border-white/10">
              #{complaint.reference_number}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getStatusBadge(complaint.status)}`}>
              {complaint.status.replace('_', ' ')}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getPriorityBadge(complaint.priority)}`}>
              {complaint.priority} priority
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white mb-2">
            {complaint.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {complaint.ward} &bull; {complaint.address_text}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              {complaint.assigned_department_name}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            Audit Timeline & Info
          </button>

          {isOfficerOrAdmin && (
            <button
              onClick={() => setActiveTab('action')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'action'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Officer Resolution Action
            </button>
          )}

          {isCitizen && (
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'feedback'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Star className="w-4 h-4" />
              Citizen Feedback / Reopen
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Description & Photo */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Problem Description
                </h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 leading-relaxed">
                  {complaint.description}
                </p>

                {complaint.image_urls && complaint.image_urls.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Photographic Evidence
                    </h4>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {complaint.image_urls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Evidence"
                          className="w-36 h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status History Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Full Resolution Lifecycle
                </h4>
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {complaint.history && complaint.history.length > 0 ? (
                    complaint.history.map((h) => (
                      <div key={h.id} className="relative">
                        <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-sm" />
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-800 capitalize">
                              {h.new_status.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(h.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-1.5">{h.comment}</p>
                          <span className="text-[10px] text-brand-700 font-medium bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                            Updated by {h.updated_by_name} ({h.updated_by_role})
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No recorded transitions yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Officer Action Tab */}
          {activeTab === 'action' && isOfficerOrAdmin && (
            <div className="space-y-6">
              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  Advance Lifecycle Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="under_review">Under Review</option>
                      <option value="verified">Verified</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Resolution Photo URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Officer Comment / Action Note
                  </label>
                  <textarea
                    rows={2}
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="E.g., Squad dispatched with hot-mix asphalt. Work completed."
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? 'Updating Municipal Records...' : 'Save Status Update & Notify Citizen'}
                </button>
              </form>

              {/* Department Reassign Form */}
              <form onSubmit={handleAssign} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  Reassign Responsible Department
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Target Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} (SLA: {d.sla_hours}h)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reassignment Rationale
                  </label>
                  <input
                    type="text"
                    value={reassignNotes}
                    onChange={(e) => setReassignNotes(e.target.value)}
                    placeholder="E.g., Leak is caused by broken main line, requires water board squad."
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  Confirm Reassignment
                </button>
              </form>
            </div>
          )}

          {/* Citizen Feedback / Reopen Tab */}
          {activeTab === 'feedback' && isCitizen && (
            <div className="space-y-6">
              {/* Feedback Form */}
              <form onSubmit={handleFeedback} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Rate Municipal Resolution
                </h4>
                <p className="text-xs text-slate-600">
                  Your feedback helps optimize municipal department response times and SLA metrics.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                          rating >= star ? 'text-amber-500' : 'text-slate-300'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Feedback Details
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Tell us about the speed and quality of the repair..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  Submit Citizen Feedback
                </button>
              </form>

              {/* Reopen Form if unsatisfied */}
              <form onSubmit={handleReopen} className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 space-y-3">
                <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Reopen Issue (Unsatisfied with resolution)
                </h4>
                <p className="text-xs text-rose-700">
                  If the problem was marked resolved prematurely or the issue recurred, submit a re-inspection request.
                </p>

                <textarea
                  rows={2}
                  required
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="Explain why the problem is still unresolved..."
                  className="w-full text-xs bg-white border border-rose-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />

                <button
                  type="submit"
                  disabled={submitting || !reopenReason.trim()}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  Flag Grievance as Reopened
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Submitted on {new Date(complaint.created_at).toLocaleDateString()}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

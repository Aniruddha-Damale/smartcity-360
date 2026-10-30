import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Complaint, Department, SensorDevice, Announcement, DashboardSummary } from '../types';
import { api } from '../services/api';
import { useNotifications } from './NotificationContext';

interface CityDataContextType {
  complaints: Complaint[];
  departments: Department[];
  summary: DashboardSummary | null;
  announcements: Announcement[];
  sensors: SensorDevice[];
  loading: boolean;
  refreshData: () => Promise<void>;
  createComplaint: (data: any) => Promise<Complaint>;
  updateComplaintStatus: (id: string, payload: any) => Promise<Complaint>;
  assignComplaint: (id: string, payload: any) => Promise<Complaint>;
  reopenComplaint: (id: string, reason: string) => Promise<Complaint>;
  submitFeedback: (id: string, payload: any) => Promise<Complaint>;
}

const CityDataContext = createContext<CityDataContextType | undefined>(undefined);

export const CityDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useNotifications();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [sensors, setSensors] = useState<SensorDevice[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [comps, depts, summ, anns, sens] = await Promise.all([
        api.getComplaints(),
        api.getDepartments(),
        api.getDashboardSummary(),
        api.getAnnouncements(),
        api.getSensors(),
      ]);
      setComplaints(comps);
      setDepartments(depts);
      setSummary(summ);
      setAnnouncements(anns);
      setSensors(sens);
    } catch (e) {
      console.error('Failed to load city data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createComplaint = async (data: any): Promise<Complaint> => {
    try {
      const res = await api.createComplaint(data);
      await refreshData();
      addToast({
        type: 'success',
        title: 'Report Submitted Successfully',
        message: `Reference #${res.data.reference_number} generated. Tracking is active.`
      });
      if (res.duplicateWarning) {
        addToast({
          type: 'warning',
          title: 'Possible Duplicate Detected',
          message: res.duplicateWarning.message
        });
      }
      return res.data;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: err.message || 'Unable to submit report.'
      });
      throw err;
    }
  };

  const updateComplaintStatus = async (id: string, payload: any): Promise<Complaint> => {
    try {
      const updated = await api.updateComplaintStatus(id, payload);
      await refreshData();
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Complaint #${updated.reference_number} moved to ${payload.status.replace('_', ' ').toUpperCase()}.`
      });
      return updated;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Unable to update status.'
      });
      throw err;
    }
  };

  const assignComplaint = async (id: string, payload: any): Promise<Complaint> => {
    try {
      const updated = await api.assignComplaint(id, payload);
      await refreshData();
      addToast({
        type: 'success',
        title: 'Department Assigned',
        message: `Complaint #${updated.reference_number} assigned to department.`
      });
      return updated;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Assignment Failed',
        message: err.message || 'Unable to assign.'
      });
      throw err;
    }
  };

  const reopenComplaint = async (id: string, reason: string): Promise<Complaint> => {
    try {
      const updated = await api.reopenComplaint(id, { reason });
      await refreshData();
      addToast({
        type: 'warning',
        title: 'Complaint Reopened',
        message: `Complaint #${updated.reference_number} is flagged for re-inspection.`
      });
      return updated;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Reopen Failed',
        message: err.message || 'Unable to reopen complaint.'
      });
      throw err;
    }
  };

  const submitFeedback = async (id: string, payload: any): Promise<Complaint> => {
    try {
      const updated = await api.submitFeedback(id, payload);
      await refreshData();
      addToast({
        type: 'success',
        title: 'Feedback Recorded',
        message: 'Thank you for rating your municipal resolution experience!'
      });
      return updated;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Feedback Failed',
        message: err.message || 'Unable to save feedback.'
      });
      throw err;
    }
  };

  return (
    <CityDataContext.Provider
      value={{
        complaints,
        departments,
        summary,
        announcements,
        sensors,
        loading,
        refreshData,
        createComplaint,
        updateComplaintStatus,
        assignComplaint,
        reopenComplaint,
        submitFeedback,
      }}
    >
      {children}
    </CityDataContext.Provider>
  );
};

export const useCityData = () => {
  const context = useContext(CityDataContext);
  if (!context) throw new Error('useCityData must be used within a CityDataProvider');
  return context;
};

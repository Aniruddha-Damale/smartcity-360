import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { AIService } from '../services/aiService.js';
import { ComplaintStatus, ComplaintPriority } from '../types.js';

const router = Router();

// GET /api/complaints
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, category, priority, department_id, citizen_id, search } = req.query;
    const complaints = store.getComplaints({
      status: status as string,
      category: category as string,
      priority: priority as string,
      department_id: department_id as string,
      citizen_id: citizen_id as string,
      search: search as string,
    });
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/complaints/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const complaint = store.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, data: complaint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/complaints
router.post('/', async (req: Request, res: Response) => {
  try {
    const { 
      title, description, category, priority, location_name, 
      landmark, latitude, longitude, ward, images, citizen_id, 
      citizen_name, citizen_email, citizen_phone 
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    // Run AI Intelligence
    const aiAnalysis = await AIService.classifyComplaint(title, description);
    const duplicateCheck = AIService.detectDuplicates(
      title, 
      description, 
      latitude || 19.0760, 
      longitude || 72.8777, 
      category || aiAnalysis.suggestedCategory
    );

    const departments = store.getDepartments();
    const matchedDept = departments.find(d => 
      d.name.toLowerCase().includes(aiAnalysis.suggestedDepartment.toLowerCase()) || 
      aiAnalysis.suggestedDepartment.toLowerCase().includes(d.code.toLowerCase())
    );

    const newComplaint = store.createComplaint({
      title,
      description,
      category: category || aiAnalysis.suggestedCategory,
      priority: (priority || aiAnalysis.suggestedPriority) as ComplaintPriority,
      location_name: location_name || 'City Metropolitan Area',
      landmark,
      latitude: latitude ? parseFloat(latitude) : 19.0760,
      longitude: longitude ? parseFloat(longitude) : 72.8777,
      ward: ward || 'Ward 4',
      images: images || [],
      citizen_id: citizen_id || 'user-citizen',
      citizen_name: citizen_name || 'Aarav Mehta',
      citizen_email: citizen_email || 'citizen@smartcity360.gov',
      citizen_phone: citizen_phone || '+1-555-019-2831',
      assigned_department_id: matchedDept?.id,
      assigned_department_name: matchedDept?.name,
      ai_category_suggestion: aiAnalysis.suggestedCategory,
      ai_priority_suggestion: aiAnalysis.suggestedPriority,
      ai_summary: aiAnalysis.summary,
      ai_duplicate_risk: duplicateCheck.isDuplicateLikely,
      ai_recommended_department: aiAnalysis.suggestedDepartment,
      is_public: true
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      data: newComplaint,
      duplicateWarning: duplicateCheck.isDuplicateLikely ? {
        message: `Potential duplicate complaint detected: #${duplicateCheck.matchingComplaintReference}`,
        details: duplicateCheck
      } : null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/complaints/:id/status
router.post('/:id/status', (req: Request, res: Response) => {
  try {
    const { status, updated_by_name, updated_by_role, updated_by_id, comment, resolution_notes, resolution_image_url } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required.' });
    }

    const updated = store.updateComplaintStatus(
      req.params.id,
      status as ComplaintStatus,
      {
        name: updated_by_name || 'Municipal Officer',
        role: updated_by_role || 'officer',
        id: updated_by_id
      },
      comment,
      resolution_notes,
      resolution_image_url
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({ success: true, message: `Status updated to ${status}.`, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/complaints/:id/assign
router.post('/:id/assign', (req: Request, res: Response) => {
  try {
    const { department_id, officer_id, assigned_by_name, assigned_by_role, notes } = req.body;
    
    if (!department_id) {
      return res.status(400).json({ success: false, message: 'Department ID is required.' });
    }

    const updated = store.assignComplaint(
      req.params.id,
      department_id,
      officer_id,
      {
        name: assigned_by_name || 'Director Sarah Jenkins',
        role: assigned_by_role || 'admin'
      }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({ success: true, message: 'Complaint successfully assigned.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/complaints/:id/reopen
router.post('/:id/reopen', (req: Request, res: Response) => {
  try {
    const { reason, citizen_id } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason for reopening is required.' });
    }

    const updated = store.reopenComplaint(req.params.id, reason, citizen_id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({ success: true, message: 'Complaint successfully reopened.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/complaints/:id/feedback
router.post('/:id/feedback', (req: Request, res: Response) => {
  try {
    const { rating, satisfaction_level, comment, citizen_id } = req.body;
    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating is required.' });
    }

    const updated = store.addFeedback(req.params.id, {
      rating: parseInt(rating, 10),
      satisfaction_level: satisfaction_level || 'satisfied',
      comment,
      citizen_id
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    res.json({ success: true, message: 'Feedback recorded successfully.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

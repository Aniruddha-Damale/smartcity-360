import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/map/complaints
router.get('/complaints', (req: Request, res: Response) => {
  try {
    const { category, priority, status } = req.query;
    let complaints = store.getComplaints({
      category: category as string,
      priority: priority as string,
      status: status as string
    });

    // Strip sensitive PII for public map safety
    const publicMarkers = complaints
      .filter(c => c.is_public && c.latitude && c.longitude)
      .map(c => ({
        id: c.id,
        reference_number: c.reference_number,
        title: c.title,
        category: c.category,
        priority: c.priority,
        status: c.status,
        location_name: c.location_name,
        latitude: c.latitude,
        longitude: c.longitude,
        ward: c.ward,
        created_at: c.created_at,
        assigned_department_name: c.assigned_department_name,
        thumbnail: c.images && c.images.length > 0 ? c.images[0] : null
      }));

    res.json({ success: true, count: publicMarkers.length, data: publicMarkers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

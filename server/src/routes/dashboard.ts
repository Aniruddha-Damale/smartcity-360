import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/dashboard/summary
router.get('/summary', (_req: Request, res: Response) => {
  try {
    const summary = store.getDashboardSummary();
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/dashboard/analytics
router.get('/analytics', (_req: Request, res: Response) => {
  try {
    const analytics = store.getDashboardAnalytics();
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

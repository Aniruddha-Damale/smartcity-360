import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/departments
router.get('/', (_req: Request, res: Response) => {
  try {
    const departments = store.getDepartments();
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

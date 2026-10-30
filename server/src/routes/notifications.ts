import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/notifications
router.get('/', (req: Request, res: Response) => {
  try {
    const { userId, role } = req.query;
    const notifications = store.getNotifications(userId as string, role as string);
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req: Request, res: Response) => {
  try {
    const ok = store.markNotificationRead(req.params.id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/notifications/read-all
router.post('/read-all', (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const count = store.markAllNotificationsRead(userId);
    res.json({ success: true, count, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

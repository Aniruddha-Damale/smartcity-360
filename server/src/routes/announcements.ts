import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/announcements
router.get('/', (_req: Request, res: Response) => {
  try {
    const announcements = store.getAnnouncements();
    res.json({ success: true, count: announcements.length, data: announcements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/announcements
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, content, category, priority, author_name, expires_at } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const item = store.createAnnouncement({
      title,
      content,
      category,
      priority,
      author_name,
      expires_at
    });

    res.status(201).json({ success: true, message: 'Announcement published.', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

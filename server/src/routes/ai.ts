import { Router, Request, Response } from 'express';
import { AIService } from '../services/aiService.js';

const router = Router();

// POST /api/ai/classify-complaint
router.post('/classify-complaint', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title && !description) {
      return res.status(400).json({ success: false, message: 'Title or description required.' });
    }

    const result = await AIService.classifyComplaint(title || '', description || '');
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/summarize-complaint
router.post('/summarize-complaint', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const result = await AIService.classifyComplaint(title || '', description || '');
    res.json({ success: true, summary: result.summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/detect-duplicates
router.post('/detect-duplicates', (req: Request, res: Response) => {
  try {
    const { title, description, latitude, longitude, category } = req.body;
    const result = AIService.detectDuplicates(
      title || '',
      description || '',
      latitude ? parseFloat(latitude) : 19.0760,
      longitude ? parseFloat(longitude) : 72.8777,
      category || 'Other civic issues'
    );
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/chat (CityAssist AI)
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, user } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const reply = await AIService.chatWithCityAssist(message, user);
    res.json({ success: true, reply, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

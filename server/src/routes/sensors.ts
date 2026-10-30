import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// GET /api/sensors
router.get('/', (req: Request, res: Response) => {
  try {
    const { module_type } = req.query;
    const sensors = store.getSensors(module_type as string);
    res.json({ success: true, count: sensors.length, data: sensors });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/sensors/:id/readings
router.post('/:id/readings', (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Reading value is required.' });
    }

    const updated = store.updateSensorReading(req.params.id, parseFloat(value));
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Sensor device not found.' });
    }

    res.json({ success: true, message: 'Sensor reading ingested.', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

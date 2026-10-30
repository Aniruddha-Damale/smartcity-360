import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import complaintsRouter from './routes/complaints.js';
import dashboardRouter from './routes/dashboard.js';
import departmentsRouter from './routes/departments.js';
import notificationsRouter from './routes/notifications.js';
import announcementsRouter from './routes/announcements.js';
import sensorsRouter from './routes/sensors.js';
import aiRouter from './routes/ai.js';
import mapRouter from './routes/map.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'SmartCity 360 AI-Powered Urban Management Platform',
    version: '1.0.0',
    mode: config.isDemoMode ? 'Demonstration Mode (Pre-seeded & Active)' : 'Supabase Production Mode',
    aiEngine: config.ai.provider,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/complaints', complaintsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/sensors', sensorsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/map', mapRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal municipal server error'
  });
});

// Serve frontend static build if present
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Start listening
app.listen(config.port, () => {
  console.log('===========================================================');
  console.log(`🏙️  SmartCity 360 REST API Server running on port ${config.port}`);
  console.log(`📡  Environment: ${config.isDemoMode ? 'Demo / Standalone Live Mode' : 'Connected to Supabase'}`);
  console.log(`🧠  AI Provider: ${config.ai.provider.toUpperCase()} Engine`);
  console.log(`🔗  Health Endpoint: http://localhost:${config.port}/api/health`);
  console.log('===========================================================');
});

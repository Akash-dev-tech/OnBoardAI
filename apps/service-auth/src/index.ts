import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from '@onboardai/utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ─────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());

// ─── HEALTH CHECK ───────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'service-auth',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// ─── ROUTES ─────────────────────────────────────────────────
import authRoutes from './routes/auth.routes';
app.use('/api/v1/auth', authRoutes);

// ─── 404 HANDLER ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.path} not found` }
  });
});

// ─── START ──────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`service-auth running`, { port: PORT });
});

export default app;

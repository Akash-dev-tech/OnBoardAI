import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '@onboardai/utils';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'service-auth',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

import authRoutes from './routes/auth.routes';
app.use('/api/v1/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.path} not found` }
  });
});

app.listen(PORT, () => {
  logger.info(`service-auth running`, { port: PORT });
});

export default app;

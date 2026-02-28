import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

import express from 'express';
import cors from 'cors';
import templateRoutes from './routes/template.routes';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, service: 'service-onboarding', status: 'running', timestamp: new Date().toISOString() });
});

app.use('/api/v1/templates', templateRoutes);

app.listen(PORT, () => {
  console.log(`íº€ service-onboarding running on port ${PORT}`);
});

export default app;

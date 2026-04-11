import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler, notFound } from './middleware/errorHandler';
import configRoutes from './routes/config';
import messageRoutes from './routes/messages';
import scoreRoutes from './routes/scores';
import authRoutes from './routes/auth';
import rewardRoutes from './routes/rewards';
import userRoutes from './routes/users';

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/config', configRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

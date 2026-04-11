import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler, notFound } from './middleware/errorHandler';
import configRoutes from './routes/config';
import messageRoutes from './routes/messages';

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

app.use(notFound);
app.use(errorHandler);

export default app;

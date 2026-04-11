import app from './app';
import { config } from './config';

// Import routes - ensure they're loaded
import './routes/config';
import './routes/messages';
import './routes/scores';
import './routes/auth';
import './routes/rewards';
import './routes/users';

// Vercel serverless handler
export default app;

// Local dev server
const PORT = config.port;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[SERVER] Catch My Love API running on port ${PORT}`);
  });
}
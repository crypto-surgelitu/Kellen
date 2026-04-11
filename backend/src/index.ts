import app from './app';
import { config } from './config';

const PORT = config.port;

// Export for Vercel serverless
export default app;

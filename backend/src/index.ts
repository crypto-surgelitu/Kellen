import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`[SERVER] Catch My Love API running on port ${PORT}`);
  console.log(`[ENV] Node environment: ${config.nodeEnv}`);
  console.log(`[CORS] Allowed origin: ${config.corsOrigin}`);
});

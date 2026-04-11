import { Router } from 'express';
import { configService } from '../services/config.service';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const config = await configService.getAll();
    res.json(config);
  } catch (error) {
    next(error);
  }
});

router.put('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      throw new AppError('Value is required', 400);
    }

    const updated = await configService.update(key, value);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;

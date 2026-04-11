import { Router } from 'express';
import { scoreService } from '../services/score.service';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { userId, value, level, comboMax, heartsCaught } = req.body;

    if (!userId || value === undefined || !level) {
      throw new AppError('Missing required fields: userId, value, level', 400);
    }

    const score = await scoreService.submitScore(userId, {
      value,
      level,
      comboMax: comboMax || 0,
      heartsCaught: heartsCaught || 0,
    });

    res.status(201).json({ success: true, data: score });
  } catch (error) {
    next(error);
  }
});

router.get('/leaderboard', async (_req, res, next) => {
  try {
    const limit = Math.min(parseInt(_req.query.limit as string || '10', 10), 100);
    const leaderboard = await scoreService.getLeaderboard(limit);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
});

router.get('/rank/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const rankData = await scoreService.getUserRank(userId);
    res.json({ success: true, data: rankData });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string || '10', 10), 50);
    const history = await scoreService.getUserHistory(userId, limit);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
});

export default router;
import { Router } from 'express';
import { rewardService } from '../services/reward.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/daily', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const reward = await rewardService.getDailyReward(userId);
    res.json({ success: true, data: reward });
  } catch (error) {
    next(error);
  }
});

router.post('/claim', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const result = await rewardService.claimDailyReward(userId);
    
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    
    res.json({ 
      success: true, 
      data: { 
        reward: result.reward, 
        totalHearts: result.totalHearts 
      } 
    });
  } catch (error) {
    next(error);
  }
});

router.get('/streak', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const streak = await rewardService.getStreak(userId);
    res.json({ success: true, data: streak });
  } catch (error) {
    next(error);
  }
});

export default router;
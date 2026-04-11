import { Router } from 'express';
import { userService } from '../services/user.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const profile = await userService.getProfile(userId);
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

router.put('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { name, avatarUrl } = req.body;
    
    const profile = await userService.updateProfile(userId, { name, avatarUrl });
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

export default router;
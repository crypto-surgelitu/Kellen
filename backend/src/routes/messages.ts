import { Router } from 'express';
import { messageService } from '../services/message.service';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const message = await messageService.getRandomMessage(category as string);
    res.json(message);
  } catch (error) {
    next(error);
  }
});

router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const messages = await messageService.getMessagesByCategory(category);
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

export default router;

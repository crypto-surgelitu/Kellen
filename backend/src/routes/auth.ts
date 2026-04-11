import { Router } from 'express';
import { getSupabaseAdmin } from '../services/supabase.service';
import { AppError } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw new AppError('Email, password, and name are required', 400);
    }

    const supabase = getSupabaseAdmin();
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError || !authData.user) {
      throw new AppError(authError?.message || 'Failed to create user', 400);
    }

    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        name,
      },
    });

    res.status(201).json({ 
      success: true, 
      data: { 
        user: { id: user.id, email: user.email, name: user.name },
        message: 'Registration successful. Please login.' 
      } 
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const supabase = getSupabaseAdmin();
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new AppError(authError?.message || 'Invalid credentials', 401);
    }

    let user = await prisma.user.findUnique({
      where: { id: authData.user.id },
    });

    if (!user) {
      const createdUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email || email,
          name: authData.user.user_metadata?.name || email.split('@')[0],
        },
      });
      user = createdUser;
    }

    res.json({ 
      success: true, 
      data: { 
        user: { id: user.id, email: user.email },
        token: authData.session?.access_token 
      } 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
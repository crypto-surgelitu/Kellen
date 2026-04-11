import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const rewardService = {
  async getDailyReward(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingReward = await prisma.dailyReward.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingReward) {
      return {
        claimed: existingReward.claimed,
        reward: existingReward.reward,
        date: existingReward.date,
        message: existingReward.claimed ? 'Already claimed today' : 'Available',
      };
    }

    const newReward = await prisma.dailyReward.create({
      data: {
        userId,
        date: today,
        reward: 100,
        claimed: false,
      },
    });

    return {
      claimed: false,
      reward: newReward.reward,
      date: newReward.date,
      message: 'Available',
    };
  },

  async claimDailyReward(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingReward = await prisma.dailyReward.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingReward?.claimed) {
      return { success: false, message: 'Already claimed today' };
    }

    const reward = existingReward 
      ? await prisma.dailyReward.update({
          where: { id: existingReward.id },
          data: { claimed: true },
        })
      : await prisma.dailyReward.create({
          data: {
            userId,
            date: today,
            reward: 100,
            claimed: true,
          },
        });

    await prisma.user.update({
      where: { id: userId },
      data: { totalHearts: { increment: reward.reward } },
    });

    return { 
      success: true, 
      reward: reward.reward,
      totalHearts: (await prisma.user.findUnique({ where: { id: userId } }))?.totalHearts || 0 
    };
  },

  async getStreak(userId: string) {
    const rewards = await prisma.dailyReward.findMany({
      where: { userId, claimed: true },
      orderBy: { date: 'desc' },
      take: 30,
    });

    if (rewards.length === 0) {
      return { streak: 0, longestStreak: 0, totalClaims: 0 };
    }

    let streak = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const reward of rewards) {
      const rewardDate = new Date(reward.date);
      rewardDate.setHours(0, 0, 0, 0);

      if (lastDate === null) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (rewardDate.getTime() === today.getTime() || rewardDate.getTime() === yesterday.getTime()) {
          currentStreak = 1;
        }
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - rewardDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
          }
          currentStreak = 1;
        }
      }

      lastDate = rewardDate;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    streak = currentStreak;

    return { 
      streak, 
      longestStreak, 
      totalClaims: rewards.length 
    };
  },
};
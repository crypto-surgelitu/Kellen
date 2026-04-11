import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const scoreService = {
  async submitScore(userId: string, data: {
    value: number;
    level: number;
    comboMax: number;
    heartsCaught: number;
  }) {
    return prisma.score.create({
      data: {
        userId,
        value: data.value,
        level: data.level,
        comboMax: data.comboMax,
        heartsCaught: data.heartsCaught,
      },
    });
  },

  async getLeaderboard(limit = 10) {
    const scores = await prisma.score.findMany({
      orderBy: { value: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return scores.map((s, i) => ({
      rank: i + 1,
      userId: s.user.id,
      userName: s.user.name,
      avatarUrl: s.user.avatarUrl,
      score: s.value,
      level: s.level,
      comboMax: s.comboMax,
      heartsCaught: s.heartsCaught,
      date: s.createdAt,
    }));
  },

  async getUserRank(userId: string) {
    const userScore = await prisma.score.findFirst({
      where: { userId },
      orderBy: { value: 'desc' },
    });

    if (!userScore) {
      return { rank: null, score: null };
    }

    const higherScores = await prisma.score.count({
      where: { value: { gt: userScore.value } },
    });

    return {
      rank: higherScores + 1,
      score: userScore.value,
    };
  },

  async getUserHistory(userId: string, limit = 10) {
    return prisma.score.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        value: true,
        level: true,
        comboMax: true,
        heartsCaught: true,
        createdAt: true,
      },
    });
  },
};
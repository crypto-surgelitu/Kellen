import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        level: true,
        totalHearts: true,
        createdAt: true,
      },
    });

    if (!user) {
      return null;
    }

    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: { value: 'desc' },
      take: 1,
    });

    const bestScore = scores[0]?.value || 0;
    const totalGames = await prisma.score.count({ where: { userId } });

    return {
      ...user,
      bestScore,
      totalGames,
    };
  },

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        level: true,
        totalHearts: true,
      },
    });
  },
};
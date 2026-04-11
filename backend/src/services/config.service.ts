import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const configService = {
  async getAll() {
    const configs = await prisma.gameConfig.findMany({
      where: { isActive: true },
    });

    const configMap: Record<string, any> = {};
    configs.forEach((c) => {
      configMap[c.key] = c.value;
    });

    return {
      heartSpeed: configMap.heartSpeed ?? 2,
      spawnRate: configMap.spawnRate ?? 1000,
      bucketSpeed: configMap.bucketSpeed ?? 10,
      difficultyTiers: configMap.difficultyTiers ?? [
        { score: 0, speed: 2, rate: 1000 },
        { score: 50, speed: 3, rate: 800 },
        { score: 150, speed: 5, rate: 600 },
      ],
    };
  },

  async update(key: string, value: any) {
    return prisma.gameConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },

  async getByKey(key: string) {
    return prisma.gameConfig.findUnique({ where: { key } });
  },
};

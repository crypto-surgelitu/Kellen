import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const messageService = {
  async getRandomMessage(category?: string) {
    const where = category 
      ? { category: category.toUpperCase(), isActive: true }
      : { isActive: true };

    const messages = await prisma.affectionMessage.findMany({ where });

    if (messages.length === 0) {
      return {
        message: "You're amazing!",
        category: 'SWEET',
      };
    }

    const random = messages[Math.floor(Math.random() * messages.length)];
    return {
      message: random.text,
      category: random.category,
    };
  },

  async getMessagesByCategory(category: string) {
    return prisma.affectionMessage.findMany({
      where: { category: category.toUpperCase(), isActive: true },
    });
  },

  async createMessage(category: string, text: string) {
    return prisma.affectionMessage.create({
      data: {
        category: category.toUpperCase(),
        text,
      },
    });
  },
};

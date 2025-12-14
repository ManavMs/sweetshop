import prisma from '../utils/prisma';
import { Sweet, Prisma } from '@prisma/client';

export class SweetsService {
    async getAllSweets(): Promise<Sweet[]> {
        return prisma.sweet.findMany();
    }

    async createSweet(data: Prisma.SweetCreateInput): Promise<Sweet> {
        if (!data.imageUrl || data.imageUrl.trim() === '') {
            const query = encodeURIComponent(`${data.name} sweet dessert`);
            data.imageUrl = `https://tse2.mm.bing.net/th?q=${query}&w=500&h=500&c=7&rs=1&p=0`;
        }
        return prisma.sweet.create({ data });
    }

    async getSweetById(id: number): Promise<Sweet | null> {
        return prisma.sweet.findUnique({ where: { id } });
    }

    async updateSweet(id: number, data: Partial<Sweet>): Promise<Sweet> {
        return prisma.sweet.update({ where: { id }, data });
    }

    async deleteSweet(id: number): Promise<Sweet> {
        return prisma.sweet.delete({ where: { id } });
    }

    async searchSweets(query: string, minPrice?: number, maxPrice?: number): Promise<Sweet[]> {
        const where: Prisma.SweetWhereInput = {
            AND: [
                {
                    OR: [
                        { name: { contains: query } },
                        { category: { contains: query } }
                    ]
                }
            ]
        };

        if (minPrice !== undefined) {
            (where.AND as Prisma.SweetWhereInput[]).push({ price: { gte: minPrice } });
        }

        if (maxPrice !== undefined) {
            (where.AND as Prisma.SweetWhereInput[]).push({ price: { lte: maxPrice } });
        }

        return prisma.sweet.findMany({ where });
    }

    async purchaseSweet(id: number, quantity: number = 1): Promise<Sweet> {
        const sweet = await prisma.sweet.findUnique({ where: { id } });
        if (!sweet) throw new Error('Sweet not found');
        if (sweet.quantity < quantity) throw new Error('Insufficient stock');

        return prisma.sweet.update({
            where: { id },
            data: { quantity: sweet.quantity - quantity }
        });
    }

    async restockSweet(id: number, quantity: number): Promise<Sweet> {
        return prisma.sweet.update({
            where: { id },
            data: { quantity: { increment: quantity } }
        });
    }
}

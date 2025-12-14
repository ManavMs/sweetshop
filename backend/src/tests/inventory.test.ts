import request from 'supertest';
import app from '../app';
import prisma from '../utils/prisma';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

describe('Inventory Endpoints', () => {
    let adminToken: string;
    let userToken: string;
    let sweetId: number;

    beforeAll(async () => {
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();

        const admin = await prisma.user.create({ data: { email: 'admin@inv.com', password: 'hash', role: 'ADMIN' } });
        adminToken = jwt.sign({ userId: admin.id, role: admin.role }, SECRET);

        const user = await prisma.user.create({ data: { email: 'user@inv.com', password: 'hash', role: 'USER' } });
        userToken = jwt.sign({ userId: user.id, role: user.role }, SECRET);

        const sweet = await prisma.sweet.create({
            data: { name: 'Test Sweet', category: 'Test', price: 1.0, quantity: 10 }
        });
        sweetId = sweet.id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should purchase a sweet (decrease quantity)', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(9);
    });

    it('should restock a sweet (Admin)', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 5 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(14); // 9 + 5
    });

    it('should fail to purchase if out of stock', async () => {
        // Set quantity to 0
        await prisma.sweet.update({ where: { id: sweetId }, data: { quantity: 0 } });

        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Insufficient stock');
    });
});

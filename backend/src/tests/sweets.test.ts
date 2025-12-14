import request from 'supertest';
import app from '../app';
import prisma from '../utils/prisma';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

describe('Sweets Endpoints', () => {
    let adminToken: string;
    let userToken: string;

    beforeAll(async () => {
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany();

        // Create Admin
        const admin = await prisma.user.create({
            data: { email: 'admin@sweetshop.com', password: 'hash', role: 'ADMIN' }
        });
        adminToken = jwt.sign({ userId: admin.id, role: admin.role }, SECRET);

        // Create User
        const user = await prisma.user.create({
            data: { email: 'user@sweetshop.com', password: 'hash', role: 'USER' }
        });
        userToken = jwt.sign({ userId: user.id, role: user.role }, SECRET);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a sweet (Admin only)', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Chocolate Fudge',
                category: 'Fudge',
                price: 5.99,
                quantity: 10
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Chocolate Fudge');
    });

    it('should fail to create a sweet (User)', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Candy Cane',
                category: 'Candy',
                price: 1.99,
                quantity: 100
            });

        expect(res.statusCode).toEqual(403);
    });

    it('should get all sweets', async () => {
        const res = await request(app).get('/api/sweets');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should search sweets by name', async () => {
        const res = await request(app).get('/api/sweets?q=Fudge');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toContain('Fudge');
    });
});

import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {
    async register(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> }> {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1h' });

        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }

    async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> }> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: '1h' });

        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}

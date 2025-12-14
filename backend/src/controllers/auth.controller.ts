import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const result = await authService.register(email, password);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.message === 'User already exists') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            if (error.message === 'Invalid credentials') {
                return res.status(401).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

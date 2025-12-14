import { Request, Response } from 'express';
import { SweetsService } from '../services/sweets.service';

const sweetsService = new SweetsService();

export class SweetsController {
    async getAll(req: Request, res: Response) {
        const sweets = await sweetsService.getAllSweets();
        res.json(sweets);
    }

    async create(req: Request, res: Response) {
        try {
            const sweet = await sweetsService.createSweet(req.body);
            res.status(201).json(sweet);
        } catch (error) {
            res.status(500).json({ message: 'Error creating sweet' });
        }
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const sweet = await sweetsService.getSweetById(id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        res.json(sweet);
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            const sweet = await sweetsService.updateSweet(id, req.body);
            res.json(sweet);
        } catch (error) {
            res.status(500).json({ message: 'Error updating sweet' });
        }
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            await sweetsService.deleteSweet(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting sweet' });
        }
    }

    async search(req: Request, res: Response) {
        const query = req.query.q as string || '';
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

        const sweets = await sweetsService.searchSweets(query, minPrice, maxPrice);
        res.json(sweets);
    }

    async purchase(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            const sweet = await sweetsService.purchaseSweet(id);
            res.json(sweet);
        } catch (error: any) {
            if (error.message === 'Sweet not found') return res.status(404).json({ message: error.message });
            if (error.message === 'Insufficient stock') return res.status(400).json({ message: error.message });
            res.status(500).json({ message: 'Error purchasing sweet' });
        }
    }

    async restock(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { quantity } = req.body;
        try {
            const sweet = await sweetsService.restockSweet(id, quantity);
            res.json(sweet);
        } catch (error) {
            res.status(500).json({ message: 'Error restocking sweet' });
        }
    }
}

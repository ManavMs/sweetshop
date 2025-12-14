import { Router } from 'express';
import { SweetsController } from '../controllers/sweets.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();
const sweetsController = new SweetsController();

// Public
router.get('/', sweetsController.getAll);
router.get('/search', sweetsController.search);
router.get('/:id', sweetsController.getById);

// Protected (Admin)
router.post('/', authenticate, isAdmin, sweetsController.create);
router.put('/:id', authenticate, isAdmin, sweetsController.update);
router.delete('/:id', authenticate, isAdmin, sweetsController.delete);
router.post('/:id/restock', authenticate, isAdmin, sweetsController.restock);

// Protected (User)
router.post('/:id/purchase', authenticate, sweetsController.purchase);

export default router;

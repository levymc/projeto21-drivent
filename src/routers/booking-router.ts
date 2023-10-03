import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.get('/'); //.all('/*', authenticateToken)

export { bookingRouter };

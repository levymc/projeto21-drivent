import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.get('/', getHotels); // .all('/*', authenticateToken)

export { hotelsRouter };

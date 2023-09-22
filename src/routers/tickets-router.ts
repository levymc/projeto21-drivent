import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { getTicketsType } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/', getTicketsType);

export { ticketsRouter };

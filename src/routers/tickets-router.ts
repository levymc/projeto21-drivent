import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { getTicketsType, getTickets } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/types', getTicketsType);
ticketsRouter.get('/', getTickets);

export { ticketsRouter };

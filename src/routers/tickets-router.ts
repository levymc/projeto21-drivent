import { Router } from 'express';
import { validateBody } from '@/middlewares';
import { getTicketsType, getTickets, postTicket } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/types', getTicketsType);
ticketsRouter.get('/', getTickets);
ticketsRouter.post('/', postTicket);

export { ticketsRouter };

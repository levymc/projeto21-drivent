import { Router } from 'express';
import { ticketsControllers } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/', ticketsControllers.getTicket);
ticketsRouter.get('/types', ticketsControllers.getTypes);
ticketsRouter.post('/', validateBody(ticketSchema), ticketsControllers.createTicket);

export { ticketsRouter };

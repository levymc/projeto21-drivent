import { Router } from 'express';

import { createUserSchema } from '@/schemas';
import { validateBody } from '@/middlewares';
import { usersPost } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/tickets/types', usersPost);

export { ticketsRouter };

import Joi from 'joi';
import { createTicket } from '@/repositories/tickets-repository';

export const ticketSchema = Joi.object<createTicket>({
  ticketTypeId: Joi.number().required(),
});

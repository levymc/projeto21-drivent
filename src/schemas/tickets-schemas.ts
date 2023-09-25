import Joi from 'joi';
import { createTicket } from '@/protocols';

export const ticketSchema = Joi.object<createTicket>({
  ticketTypeId: Joi.number().required(),
});

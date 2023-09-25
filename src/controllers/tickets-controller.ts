import httpStatus from 'http-status';
import { Response } from 'express';
import { ticketsServices } from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';
import { createTicket } from '@/repositories/tickets-repository';
import { invalidDataError } from '@/errors';

async function getTypes(req: AuthenticatedRequest, res: Response) {
  const result = await ticketsServices.getTypes();
  res.status(httpStatus.OK).send(result);
}

async function getTicket(req: AuthenticatedRequest, res: Response) {
  const result = await ticketsServices.getTicket(req.userId);

  res.status(httpStatus.OK).send(result);
}

async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body as createTicket;

  if (!ticketTypeId) throw invalidDataError('ticketType error - invalid data request');

  const result = await ticketsServices.createTicket(req.userId, ticketTypeId);

  res.status(httpStatus.CREATED).send(result);
}

export const ticketsControllers = {
  getTypes,
  getTicket,
  createTicket,
};

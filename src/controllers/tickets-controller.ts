import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ticketsService } from '@/services';
import logger from '@/config/logger';

export async function getTickets(req: Request, res: Response) {
  logger.info('getTickets START');
  const tickets = await ticketsService.returnTickets();
  logger.info('getTickets END');
  return res.json(tickets);
}

export async function getTicketsType(req: Request, res: Response) {
  logger.info('getTicketsType START');
  const ticketsTypes = await ticketsService.returnTicketsTypes();
  logger.info('getTicketsType END');
  return res.json(ticketsTypes);
}

export async function postTicket(req: Request, res: Response) {
  logger.info('postTicket START');
  const postedTicket = await ticketsService.createTicket(req.body);
  logger.info('postTicket END');
  return res.json(postedTicket);
}

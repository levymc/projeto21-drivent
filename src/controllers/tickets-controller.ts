import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ticketsService } from '@/services';
import logger from '@/config/logger';

export async function getTickets(req: Request, res: Response) {
  const { email, password } = req.body;

  return res.json("'tickets'");
}

export async function getTicketsType(req: Request, res: Response) {
  logger.info('getTicketsType START');
  const ticketsTypes = await ticketsService.returnTicketsTypes();
  logger.info('getTicketsType END');
  return res.json(ticketsTypes);
}

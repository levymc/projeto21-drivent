import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from '@/services';

export async function getTickets(req: Request, res: Response) {
  const { email, password } = req.body;

  const tickets = await userService.createUser({ email, password });

  return res.json(tickets);
}

import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { BookingWithRoom } from '@/protocols';
import { bookingService } from '@/services/booking-service';
import { unauthorizedError } from '@/errors';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const booking = await bookingService.getBooking(userId);

  res.status(httpStatus.OK).json(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = Number(req.body.userId);
  const roomId = Number(req.body.roomId);

  const createdBooking = await bookingService.handlePostBooking(userId, roomId);

  res.status(httpStatus.CREATED).json();
}

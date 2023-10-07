import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const booking = await bookingService.getBooking(userId);

  res.status(httpStatus.OK).json(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = Number(req.userId);
  const roomId = Number(req.body.roomId);

  const createdBooking = await bookingService.handlePostBooking(userId, roomId);

  res.status(httpStatus.OK).json(createdBooking);
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const userId = Number(req.userId);
  const roomId = Number(req.body.roomId);

  const response = await bookingService.handlePutBooking(userId, roomId);

  res.status(httpStatus.OK).json(response);
}

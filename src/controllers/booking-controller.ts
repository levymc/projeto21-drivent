import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { BookingWithRoom } from '@/protocols';
import { bookingService } from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  //cada usuario tem uma só reserva
  const { userId } = req;

  const booking: BookingWithRoom = await bookingService.getBooking(userId);

  res.status(httpStatus.OK).json(booking);
}

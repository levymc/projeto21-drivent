import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { BookingWithRoom } from '@/protocols';
import { bookingService } from '@/services/booking-service';
import { unauthorizedError } from '@/errors';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    //cada usuario tem uma só reserva
    console.log('asad');
    const { userId } = req;

    const booking = await bookingService.getBooking(userId);

    res.status(httpStatus.OK).json(booking);
  } catch (err) {
    next(err);
  }
}

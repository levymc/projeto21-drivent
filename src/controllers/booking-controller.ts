import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { BookingWithRoom } from '@/protocols';
import { bookingService } from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  //cada usuario tem uma só reserva
  try {
    const { userId } = req;
    console.log('Controller');
    const booking = await bookingService.getBooking(userId);

    res.status(httpStatus.OK).json(booking);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
}

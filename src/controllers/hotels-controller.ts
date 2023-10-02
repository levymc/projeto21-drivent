import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotels = await hotelsService.receiveHotels(userId);
  return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.id);
  const hotel = await hotelsService.receiveHotelById(userId, hotelId);
  return res.status(httpStatus.OK).send(hotel);
}

// export async function paymentProcess(req: AuthenticatedRequest, res: Response) {
//   const { userId } = req;
//   const { ticketId, cardData } = req.body as InputPaymentBody;

//   const payment = await paymentsService.paymentProcess(ticketId, userId, cardData);
//   res.status(httpStatus.OK).send(payment);
// }

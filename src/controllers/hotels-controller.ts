import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const hotels = await hotelsService.receiveHotels();
  return res.status(httpStatus.OK).send(hotels);
}

// export async function paymentProcess(req: AuthenticatedRequest, res: Response) {
//   const { userId } = req;
//   const { ticketId, cardData } = req.body as InputPaymentBody;

//   const payment = await paymentsService.paymentProcess(ticketId, userId, cardData);
//   res.status(httpStatus.OK).send(payment);
// }

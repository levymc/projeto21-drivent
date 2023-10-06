import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.get('/', getBooking).post('/', postBooking); //.all('/*', authenticateToken)

export { bookingRouter };

import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postBooking, putBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBooking).post('/', postBooking).put(`/:bookingId`, putBooking); //.all('/*', authenticateToken)

export { bookingRouter };

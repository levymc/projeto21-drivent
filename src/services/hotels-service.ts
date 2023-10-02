import { notFoundError } from '@/errors';
import { PaymentError } from '@/errors/payment-error';
import { enrollmentRepository, hotelsRepository, ticketsRepository } from '@/repositories';

async function receiveHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const userTicket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!userTicket) throw notFoundError();
  else if (userTicket.status != `PAID`) throw PaymentError('PaymentIsRequired', 'O status do ticket deve ser Pago');
  else if (userTicket.TicketType.isRemote)
    throw PaymentError(`TicketType Remote`, 'The type of ticket must not be remote');
  else if (!userTicket.TicketType.includesHotel) throw PaymentError('TicketHotels', 'TicketType must include hotels');
  const hotels = await hotelsRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels.map((hotel) => {
    return {
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
    };
  });
}

export const hotelsService = {
  receiveHotels,
};

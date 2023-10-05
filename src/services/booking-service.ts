import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { EnrollmentMockType } from '@/protocols';

async function findEnrollmentByUserId(userId: number): Promise<EnrollmentMockType> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  return enrollment;
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollmentId);
  if (!ticket) throw notFoundError();
  return ticket;
}

function isInvalidBooking(ticket: Ticket, type: TicketType): boolean {
  return ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel;
}

async function validateUserBooking(userId: number) {
  const enrollment = await findEnrollmentByUserId(userId);
  const ticket = await findTicketByEnrollmentId(enrollment.id);
  const type = ticket.TicketType;

  if (isInvalidBooking(ticket, type)) {
    throw cannotListHotelsError();
  }
}

async function getBooking(userId: number) {
  await validateUserBooking(userId);
  const booking = await bookingRepository.findBooking(userId);
  console.log(booking);
  if (!booking) throw notFoundError();

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

export const bookingService = {
  getBooking,
  findEnrollmentByUserId,
  findTicketByEnrollmentId,
  isInvalidBooking,
  validateUserBooking,
};

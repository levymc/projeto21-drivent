import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { bookingRepository, enrollmentRepository, roomRepository, ticketsRepository } from '@/repositories';
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

async function findRoomById(roomId: number) {
  const room = await roomRepository.receiveRoom(roomId);
  if (!room) throw notFoundError();
  return room;
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
  if (!booking) throw notFoundError();

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function handlePostBooking(userId: number, roomId: number) {
  await validateUserBooking(userId);
  const room = await findRoomById(roomId);
  const capacity = room.capacity;
  //antes de criar, devemos verificar se
  // Existem quantos booking com esse roomId? Essa quantidade é maior do que o capacity? Se sim erro 403 Forbidden
  // Verificar se o roomId existe, caso contrario erro 404 NotFound
  const createdBooking = await bookingRepository.createBooking(userId, roomId);
  return {
    bookingId: createdBooking.id,
  };
}

export const bookingService = {
  getBooking,
  findEnrollmentByUserId,
  findTicketByEnrollmentId,
  isInvalidBooking,
  validateUserBooking,
  handlePostBooking,
};

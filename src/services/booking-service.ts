import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
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

async function findReservedRooms(roomId: number) {
  const rooms = await bookingRepository.findBookingsByRoomId(roomId);
  return rooms;
}

function checkOverCapacity(capacity: number, countReservedRooms: number) {
  if (countReservedRooms >= capacity) throw forbiddenError('Over Capacity');
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
  const reservedRooms = await findReservedRooms(roomId);
  checkOverCapacity(room.capacity, reservedRooms.length);
  const createdBooking = await bookingRepository.createBooking(userId, roomId);
  console.log(createdBooking);
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

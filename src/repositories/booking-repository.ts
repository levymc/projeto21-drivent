import { prisma } from '@/config';

async function findBooking(id: number) {
  return prisma.booking.findUnique({
    where: {
      id,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function findBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function findBookingByUserId(userId: number) {
  return prisma.booking.findUnique({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

export const bookingRepository = {
  findBooking,
  createBooking,
  findBookingsByRoomId,
  updateBooking,
  findBookingByUserId,
};

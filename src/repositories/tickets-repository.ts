import { TicketType, Ticket } from '@prisma/client';
import { prisma } from '@/config/database';

type postTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

async function getTypes(): Promise<TicketType[]> {
  const result = await prisma.ticketType.findMany();
  return result;
}

async function getTicket(enrollmentId: number) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });

  return ticket;
}

async function verifyEnrollment(userId: number) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId,
    },
  });

  return enrollment;
}

async function createTicket(ticket: postTicket) {
  const result = await prisma.ticket.create({
    data: {
      ...ticket,
    },
  });

  return result;
}

export const ticketsRepository = {
  getTypes,
  getTicket,
  verifyEnrollment,
  createTicket,
};

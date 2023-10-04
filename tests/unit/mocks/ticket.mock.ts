import { Ticket, TicketStatus } from '@prisma/client';

type TicketMockType = Ticket;

export const mockTicket: TicketMockType = {
  id: 1,
  ticketTypeId: 2,
  enrollmentId: 3,
  status: TicketStatus.RESERVED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

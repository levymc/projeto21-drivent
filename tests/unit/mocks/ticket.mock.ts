import { Ticket, TicketStatus, TicketType } from '@prisma/client';

type TicketMockType = Ticket;
type TicketTypeMockType = TicketType;

export const mockTicket: TicketMockType = {
  id: 1,
  ticketTypeId: 2,
  enrollmentId: 3,
  status: TicketStatus.RESERVED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockTicketType: TicketTypeMockType = {
  id: 2,
  name: 'Ingresso Padrão',
  price: 1000,
  isRemote: false,
  includesHotel: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

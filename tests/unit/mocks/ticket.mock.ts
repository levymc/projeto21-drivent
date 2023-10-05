import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { faker } from '@faker-js/faker';

type TicketTypeMockType = TicketType;

export const mockTicket: Ticket = {
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

export const generateRandomTicket = (): Ticket => {
  return {
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    enrollmentId: faker.datatype.number(),
    status: faker.helpers.arrayElement(Object.values(TicketStatus)),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

export const generateRandomTicketType = (): TicketTypeMockType => {
  return {
    id: faker.datatype.number(),
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote: faker.datatype.boolean(),
    includesHotel: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

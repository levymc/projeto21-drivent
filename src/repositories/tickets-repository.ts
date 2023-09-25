import { prisma } from '@/config';
import logger from '@/config/logger';
import { Ticket } from '@prisma/client';

async function findTicketsTypes() {
  logger.trace('ticketsRepository.findTicketsTypes START');
  const retorno = await prisma.ticketType.findMany({});
  logger.trace({ msg: 'ticketsRepository.findTicketsTypes START', retorno });

  return retorno;
}

async function findTickets() {
  logger.trace('ticketsRepository.findTickets START');
  const tickets = await prisma.ticket.findMany({
    include: {
      TicketType: true,
    },
  });
  const formattedTickets = tickets.map((ticket) => ({
    id: ticket.id,
    status: ticket.status,
    ticketTypeId: ticket.ticketTypeId,
    enrollmentId: ticket.enrollmentId,
    TicketType: {
      id: ticket.TicketType.id,
      name: ticket.TicketType.name,
      price: ticket.TicketType.price,
      isRemote: ticket.TicketType.isRemote,
      includesHotel: ticket.TicketType.includesHotel,
      createdAt: ticket.TicketType.createdAt,
      updatedAt: ticket.TicketType.updatedAt,
    },
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  }));
  logger.trace({ msg: 'ticketsRepository.findTickets end', formattedTickets });
  return formattedTickets;
}

async function create(data: Ticket) {
  console.log(data);
  logger.trace('ticketsRepository.create START');
  const retorno = await prisma.ticket.create({
    data,
  });
  logger.trace('ticketsRepository.create END');

  return retorno;
}

export const ticketsRepository = {
  findTicketsTypes,
  findTickets,
  create,
};

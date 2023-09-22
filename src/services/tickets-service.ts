import logger from '@/config/logger';
import { ticketsRepository } from '@/repositories/tickets-repository';

async function returnTicketsTypes() {
  logger.info('ticketsService.returnTicketsTypes START');
  const ticketsTypes = await ticketsRepository.findTicketsTypes();
  logger.info('ticketsService.returnTicketsTypes END');
  return ticketsTypes;
}

export const ticketsService = {
  returnTicketsTypes,
};

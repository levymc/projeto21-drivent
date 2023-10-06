import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createBooking } from '../factories/booking-factory';
import { createEnrollmentWithAddress, createTicketType, createUser, createTicket } from '../factories';
import { createRoom } from '../factories/room-factory';
import { createHotel } from '../factories/hotels-factory';
import app, { init } from '@/app';

describe('Testes de integração para a rota /booking', () => {
  beforeAll(async () => {
    await init();
    await cleanDb();
  });

  const server = supertest(app);

  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should return OK', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createBooking(user.id, room.id);
    const token = await generateValidToken(user);
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.OK);
  });
});

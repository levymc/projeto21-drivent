import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createBooking } from '../factories/booking-factory';
import { createEnrollmentWithAddress, createTicketType, createUser, createTicket } from '../factories';
import { createRoom } from '../factories/room-factory';
import { createHotel } from '../factories/hotels-factory';
import app, { init } from '@/app';

const createAll = async (isRemote = false, includesHotel = true, type?: TicketStatus) => {
  const user = await createUser();
  const hotel = await createHotel();
  const room = await createRoom(hotel.id);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(isRemote, includesHotel);
  await createTicket(enrollment.id, ticketType.id, type ? type : TicketStatus.PAID);
  await createBooking(user.id, room.id);
  const token = await generateValidToken(user);
  return token;
};

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

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status 402 when there is no hotel (includesHotel = false)', async () => {
      const token = await createAll(false, false);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket isRemote', async () => {
      const token = await createAll(true, true);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticketType is RESERVED', async () => {
      const token = await createAll(false, true, TicketStatus.RESERVED);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should return OK', async () => {
      const token = await createAll(false, true);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        Room: {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });
});

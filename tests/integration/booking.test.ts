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
import app, { close, init } from '@/app';

const createAll = async (isRemote = false, includesHotel = true, type?: TicketStatus) => {
  const user = await createUser();
  const hotel = await createHotel();
  const room = await createRoom(null, hotel.id, 1);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(isRemote, includesHotel);
  await createTicket(enrollment.id, ticketType.id, type ? type : TicketStatus.PAID);
  const booking = await createBooking(user.id, room.id);
  const token = await generateValidToken(user);
  return { token, user, room, booking };
};

const createAllWithOutBooking = async (isRemote = false, includesHotel = true, type?: TicketStatus) => {
  const user = await createUser();
  const hotel = await createHotel();
  const room = await createRoom(null, hotel.id, 1);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(isRemote, includesHotel);
  await createTicket(enrollment.id, ticketType.id, type ? type : TicketStatus.PAID);
  const token = await generateValidToken(user);
  return { token, user, room };
};

const server = supertest(app);

beforeAll(async () => {
  await init();
  await cleanDb();
});

afterAll(async () => {
  await close();
});

describe('Integration Test for get /booking', () => {
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
      const { token } = await createAll(false, false);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 402 when ticket isRemote', async () => {
      const { token } = await createAll(true, true);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 402 when ticketType is RESERVED', async () => {
      const { token } = await createAll(false, true, TicketStatus.RESERVED);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should return OK', async () => {
      const { token } = await createAll(false, true);
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

describe('Integration Test for post /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const body = { roomId: 1 };
    const response = await server.post('/booking').send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const body = { roomId: 1 };
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const body = { roomId: 1 };
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when there is no roomId', async () => {
      const body = { roomId: 998192 };
      const { token } = await createAllWithOutBooking();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when room capacity is full', async () => {
      const { room } = await createAll();
      const withOutBooking = await createAllWithOutBooking();
      const body = { roomId: room.id };
      const response = await server.post('/booking').set('Authorization', `Bearer ${withOutBooking.token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status OK', async () => {
      const created = await createAllWithOutBooking();
      const body = { roomId: created.room.id };
      const response = await server.post('/booking').set('Authorization', `Bearer ${created.token}`).send(body);
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

describe('Integration Test for put /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const body = { roomId: 1 };
    const response = await server.put('/booking/1').send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const body = { roomId: 1 };
    const token = faker.lorem.word();

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const body = { roomId: 1 };
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when there is no roomId', async () => {
      const created = await createAll();
      const body = { roomId: 998192 };
      const { token } = await createAllWithOutBooking();
      const response = await server
        .put(`/booking/${created.booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when room capacity is full', async () => {
      const { room } = await createAll();
      const withOutBooking = await createAllWithOutBooking();
      const body = { roomId: room.id };
      const response = await server
        .put(`/booking/${withOutBooking}`)
        .set('Authorization', `Bearer ${withOutBooking.token}`)
        .send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status OK', async () => {
      const created = await createAll();
      const withOutBooking = await createAllWithOutBooking();
      const body = { roomId: withOutBooking.room.id };
      const response = await server
        .put(`/booking/${created.booking.id}`)
        .set('Authorization', `Bearer ${created.token}`)
        .send(body);
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

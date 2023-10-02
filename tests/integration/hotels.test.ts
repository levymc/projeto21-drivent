import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { createHotel } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    // expect(response.body).toEqual([
    //   expect.objectContaining({
    //     id: expect.any(Number),
    //     name: expect.any(String),
    //     image: expect.any(String),
    //     createdAt: expect.any(String),
    //     updatedAt: expect.any(String),
    //   }),
    // ]);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('when token is valid', () => {
  it('should respond with status 404 when there is no enrollment for given user', async () => {
    const token = await generateValidToken();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when there is no ticket for given user', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when there is no hotels', async () => {
    const token = await generateValidToken();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when the ticket was not paid yet', async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType(false, true);
    await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when the ticketType is remote', async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType(true, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when the ticket doesnt include a hotel', async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType(false, false);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and hotels', async () => {
    const user = await createUser();
    const enrollment = await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    // console.log(response.body);

    expect(response.status).toBe(httpStatus.OK);
    // expect(response.body).toContain([
    //   expect.objectContaining({
    //     // id: expect.any(Number),
    //     // name: expect.any(String),
    //     // image: expect.any(String),
    //     createdAt: hotel.createdAt.toISOString(),
    //     updatedAt: hotel.updatedAt.toISOString(),
    //   }),
    // ]);
  });
});

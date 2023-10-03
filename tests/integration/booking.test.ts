import supertest from 'supertest';
import httpStatus from 'http-status';
import { cleanDb, generateValidToken } from '../helpers';
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
});

const request = require('supertest');
const app = require('../app');

let token;

beforeAll(async () => {
  const email = `test+${Date.now()}@example.com`;
  const password = 'P4ssw0rd!';

  await request(app)
    .post('/auth/register')
    .send({ nombre: 'Test Usuario', email, password });

  const res = await request(app)
    .post('/auth/login')
    .send({ email, password });

  token = res.body?.data?.token;
});

describe('Rutas protegidas /users', () => {
  test('Sin token devuelve 401/403', async () => {
    const res = await request(app).get('/users');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('Con token devuelve 200', async () => {
    expect(token).toBeTruthy();
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

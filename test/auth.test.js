const request = require('supertest');
const app = require('../app');

function extractToken(res) {
  return (
    res.body?.data?.token ||
    res.body?.token ||
    null
  );
}

describe('Autenticación', () => {
  const email = `test+${Date.now()}@example.com`;
  const password = 'P4ssw0rd!';
  let token;

  test('Registro exitoso', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ nombre: 'Test', email, password });
    expect([200, 201]).toContain(res.statusCode);
  });

  test('Login exitoso devuelve token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password });
    token = extractToken(res);
    expect(token).toBeTruthy();
  });

  module.exports = { token };
});

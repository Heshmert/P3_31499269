const request = require('supertest');
const app = require('../app');

describe('🔐 Rutas protegidas /tags', () => {
  test('POST sin token → 401/403', async () => {
    const res = await request(app).post('/tags').send({ name: 'Suspenso' });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('GET sin token → 200 OK', async () => {
    const res = await request(app).get('/tags');
    expect([200]).toContain(res.statusCode);
  });

  test('GET /:id sin token → 401/403', async () => {
    const res = await request(app).get('/tags/1');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('PUT sin token → 401/403', async () => {
    const res = await request(app).put('/tags/1').send({ name: 'Actualizado' });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('DELETE sin token → 401/403', async () => {
    const res = await request(app).delete('/tags/1');
    expect([401, 403]).toContain(res.statusCode);
  });
});

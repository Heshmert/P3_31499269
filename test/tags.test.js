const request = require('supertest');
const app = require('../app');

describe('🔐 Rutas protegidas /admin/tags', () => {
  test('POST sin token → 401/403', async () => {
    const res = await request(app).post('/admin/tags').send({ name: 'Suspenso' });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('GET sin token → 401/403', async () => {
    const res = await request(app).get('/admin/tags');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('GET /:id sin token → 401/403', async () => {
    const res = await request(app).get('/admin/tags/1');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('PUT sin token → 401/403', async () => {
    const res = await request(app).put('/admin/tags/1').send({ name: 'Actualizado' });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('DELETE sin token → 401/403', async () => {
    const res = await request(app).delete('/admin/tags/1');
    expect([401, 403]).toContain(res.statusCode);
  });
});

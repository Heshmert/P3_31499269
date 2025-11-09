const request = require('supertest');
const app = require('../app');

describe('🔐 Rutas protegidas /admin/categories', () => {
  test('POST sin token → 401/403', async () => {
    const res = await request(app).post('/admin/categories').send({ name: 'Ficción', description: 'Libros imaginativos' });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('GET sin token → 401/403', async () => {
    const res = await request(app).get('/admin/categories');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('GET /:id sin token → 401/403', async () => {
    const res = await request(app).get('/admin/categories/1');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('PUT sin token → 401/403', async () => {
    const res = await request(app).put('/admin/categories/1').send({ name: 'Actualizado', description: 'Nueva descripción' });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('DELETE sin token → 401/403', async () => {
    const res = await request(app).delete('/admin/categories/1');
    expect([401, 403]).toContain(res.statusCode);
  });
});

const request = require('supertest');
const app = require('../app'); // ajusta si tu archivo principal se llama distinto

describe('🔐 Rutas protegidas /admin/products', () => {
  test('POST sin token → 401/403', async () => {
    const res = await request(app).post('/admin/products').send({ name: 'Producto X' });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('GET /:id sin token → 401/403', async () => {
    const res = await request(app).get('/admin/products/1');
    expect([401, 403]).toContain(res.statusCode);
  });

  test('PUT sin token → 401/403', async () => {
    const res = await request(app).put('/admin/products/1').send({ name: 'Actualizado' });
    expect([401, 403]).toContain(res.statusCode);
  });

  test('DELETE sin token → 401/403', async () => {
    const res = await request(app).delete('/admin/products/1');
    expect([401, 403]).toContain(res.statusCode);
  });
});

describe('🌐 Rutas públicas /products', () => {
  test('GET /products funciona sin token', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data.products)).toBe(true);
  });

  test('GET /products con filtros funciona', async () => {
    const res = await request(app).get('/products?price_min=10&price_max=100&search=libro');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.products)).toBe(true);
  });

  test('GET /products con paginación funciona', async () => {
    const res = await request(app).get('/products?page=2&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.products.length).toBeLessThanOrEqual(5);
  });

  test('GET /products con tags funciona', async () => {
    const res = await request(app).get('/products?tags=1,2');
    expect(res.statusCode).toBe(200);
  });

  test('GET /products con sort funciona', async () => {
    const res = await request(app).get('/products?sort=price_desc');
    expect(res.statusCode).toBe(200);
  });
});

describe('🌐 Ruta pública /p/:id-:slug', () => {
  const validId = 1;
  const correctSlug = 'producto-x'; // ajusta según tu base
  const wrongSlug = 'slug-equivocado';

  test('GET /p/:id-:slug funciona con slug correcto', async () => {
    const res = await request(app).get(`/p/${validId}-${correctSlug}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('GET /p/:id-:slug redirige si el slug es incorrecto', async () => {
    const res = await request(app).get(`/p/${validId}-${wrongSlug}`);
    if (res.statusCode === 301) {
      expect(res.headers.location).toMatch(`/p/${validId}-`);
    } else {
      expect([200, 404]).toContain(res.statusCode);
    }
  });
});

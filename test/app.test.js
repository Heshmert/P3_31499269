const request = require('supertest');
const app = require('../app');

describe('GET /ping', () => {
  it('debe responder con 200 OK y cuerpo vacío', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('');
  });
});

describe('GET /about', () => {
  it('debe responder con 200 OK y datos en formato JSend', async () => {
    const res = await request(app).get('/about');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('nombreCompleto');
    expect(res.body.data).toHaveProperty('cedula');
    expect(res.body.data).toHaveProperty('seccion');
  });
});
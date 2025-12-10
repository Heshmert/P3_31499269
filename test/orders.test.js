const request = require('supertest');
const app = require('../app'); // tu app Express
const prisma = require('../prisma'); // instancia de Prisma

// Mock del PaymentStrategy para controlar resultados
jest.mock('../services/payments/CreditCardPaymentStrategy', () => {
  return jest.fn().mockImplementation(() => ({
    processPayment: jest.fn(async (paymentDetails, amount) => {
      if (paymentDetails.cardToken === 'fail') {
        return { success: false, error: 'Payment rejected' };
      }
      return { success: true, transactionId: 'tx123' };
    })
  }));
});

describe('Orders API', () => {
  let token;
  let product;

  beforeAll(async () => {
    // Crear usuario de prueba y obtener JWT
    const user = await prisma.user.create({
      data: { email: 'test@test.com', password: 'hashedpass' }
    });

    // Aquí deberías usar tu endpoint de login real para obtener el token
    // Para simplificar, supongamos que tienes un helper que genera JWT:
    token = require('../utils/jwt').generateToken({ id: user.id });

    // Crear producto con stock suficiente
    product = await prisma.product.create({
      data: {
        name: 'Producto Test',
        price: 100,
        stock: 10,
        slug: 'producto-test',
        categoryId: 1 // ajusta según tu schema
      }
    });
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test('✅ Transacción exitosa crea orden y reduce stock', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, quantity: 2 }],
        paymentMethod: 'CreditCard',
        paymentDetails: { cardToken: 'ok', currency: 'USD' }
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.order.items[0].quantity).toBe(2);

    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
    expect(updatedProduct.stock).toBe(8); // stock reducido
  });

  test('❌ Falla por stock insuficiente hace rollback', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, quantity: 999 }],
        paymentMethod: 'CreditCard',
        paymentDetails: { cardToken: 'ok', currency: 'USD' }
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');

    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
    expect(updatedProduct.stock).toBe(8); // stock no cambió
  });

  test('❌ Falla por pago rechazado hace rollback', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, quantity: 1 }],
        paymentMethod: 'CreditCard',
        paymentDetails: { cardToken: 'fail', currency: 'USD' } // mock devuelve fallo
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');

    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
    expect(updatedProduct.stock).toBe(8); // stock no cambió
  });

  test('❌ Acceso sin JWT devuelve 401', async () => {
    const res = await request(app)
      .get('/orders');

    expect(res.status).toBe(401);
  });
});

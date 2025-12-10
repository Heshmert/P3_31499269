const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Mock del PaymentStrategy para controlar resultados
jest.mock('../services/payments/CreditCardPaymentStrategy', () => {
  return jest.fn().mockImplementation(() => ({
    processPayment: jest.fn(async (paymentDetails, amount) => {
      if (paymentDetails.fullName === 'RECHAZADO') {
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
    // Crear categoría
    const category = await prisma.category.create({
      data: { name: 'TestCat', description: 'Categoria de prueba' }
    });

    // Crear usuario y token
    const user = await prisma.user.create({
      data: { nombre: 'Tester', email: 'test@test.com', password: 'hashedpass' }
    });

    // Generar token directamente con jsonwebtoken
    const SECRET = process.env.JWT_SECRET || 'test-secret';
    token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });

    // Crear producto
    product = await prisma.product.create({
      data: {
        name: 'Producto Test',
        description: 'Desc',
        price: 100,
        stock: 10,
        slug: 'producto-test',
        author: 'Autor',
        publisher: 'Editorial',
        isbn: 'isbn-test',
        language: 'ES',
        format: 'Paperback',
        year: 2024,
        categoryId: category.id
      }
    });
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
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
        paymentDetails: {
          cardNumber: '4111111111111111',
          cvv: '123',
          expirationMonth: '01',
          expirationYear: '2024',
          fullName: 'APROBADO',
          currency: 'USD'
        }
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.order.items[0].quantity).toBe(2);

    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
    expect(updatedProduct.stock).toBe(8);
  });

  test('❌ Falla por stock insuficiente hace rollback', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, quantity: 999 }],
        paymentMethod: 'CreditCard',
        paymentDetails: {
          cardNumber: '4111111111111111',
          cvv: '123',
          expirationMonth: '01',
          expirationYear: '2024',
          fullName: 'APROBADO',
          currency: 'USD'
        }
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');

    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
    expect(updatedProduct.stock).toBe(8);
  });

  test('❌ Falla por pago rechazado hace rollback', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, quantity: 1 }],
        paymentMethod: 'CreditCard',
        paymentDetails: {
          cardNumber: '4111111111111111',
          cvv: '123',
          expirationMonth: '01',
          expirationYear: '2024',
          fullName: 'RECHAZADO',
          currency: 'USD'
        }
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');

    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
    expect(updatedProduct.stock).toBe(8);
  });

  test('❌ Acceso sin JWT devuelve 401', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(401);
  });
});

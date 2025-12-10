// services/OrderService.js
const prisma = require('@prisma/client').PrismaClient ? new (require('@prisma/client').PrismaClient)() : require('../prisma'); // adapta a tu inicialización
const CreditCardPaymentStrategy = require('./payments/CreditCardPaymentStrategy');

class OrderService {
  constructor() {
    this.strategies = {
      CreditCard: new CreditCardPaymentStrategy()
      // Si luego agregas más: Pix, PayPal, etc.
    };
  }

  // Selección de strategy según paymentMethod
  getStrategy(paymentMethod) {
    const strategy = this.strategies[paymentMethod];
    if (!strategy) {
      throw new Error(`Método de pago no soportado: ${paymentMethod}`);
    }
    return strategy;
  }

  // items: [{ productId, quantity }]
  // payment: { paymentMethod: 'CreditCard', paymentDetails: { cardToken, currency } }
  async checkout(userId, items, payment) {
    if (!userId) throw new Error('Usuario requerido');
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Debes enviar items para la orden');
    }
    if (!payment?.paymentMethod || !payment?.paymentDetails) {
      throw new Error('Datos de pago incompletos');
    }

    const strategy = this.getStrategy(payment.paymentMethod);

    // Ejecutar todo de forma atómica
    return await prisma.$transaction(async (tx) => {
      // 1) Cargar productos y validar stock
      const productIds = items.map(i => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } }
      });

      // Map rápido para acceso
      const byId = new Map(products.map(p => [p.id, p]));

      for (const item of items) {
        const product = byId.get(item.productId);
        if (!product) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }
        if (item.quantity <= 0) {
          throw new Error(`Cantidad inválida para producto ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para producto ${product.id}`);
        }
      }

      // 2) Calcular total y unitPrice por item
      let totalAmount = 0;
      const orderItemsData = items.map(i => {
        const p = byId.get(i.productId);
        const unitPrice = p.price; // precio actual al momento de la compra
        totalAmount += unitPrice * i.quantity;
        return {
          productId: i.productId,
          quantity: i.quantity,
          unitPrice
        };
      });

      // 3) Ejecutar pago con Strategy
      const paymentResult = await strategy.processPayment(payment.paymentDetails, totalAmount);
      if (!paymentResult.success) {
        // al lanzar error, la transacción hace rollback
        throw new Error(`Pago rechazado: ${paymentResult.error || 'desconocido'}`);
      }

      // 4) Actualizar stock solo si el pago fue exitoso
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 5) Crear la orden y sus items
      const order = await tx.order.create({
        data: {
          userId,
          status: 'COMPLETED',
          totalAmount,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      // Opcional: podrías registrar el transactionId del pago en la orden (campo adicional)
      return order;
    });
  }

  // Historial del usuario con paginación
  async listUserOrders(userId, { page = 1, limit = 10 } = {}) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          items: { include: { product: true } }
        }
      }),
      prisma.order.count({ where: { userId } })
    ]);

    return {
      page: Number(page),
      limit: Number(limit),
      total,
      orders
    };
  }

  // Detalle de una orden del usuario
  async getUserOrderById(userId, orderId) {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: { include: { product: true } } }
    });

    if (!order || order.userId !== Number(userId)) {
      // por seguridad, no revelar si existe; puedes devolver null y que el controlador responda 404
      return null;
    }

    return order;
  }
}

module.exports = new OrderService();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const CreditCardPaymentStrategy = require("./payments/CreditCardPaymentStrategy");

class OrderService {
  constructor() {
    this.strategies = {
      CreditCard: new CreditCardPaymentStrategy(),
    };
  }

  getStrategy(paymentMethod) {
    const strategy = this.strategies[paymentMethod];
    if (!strategy) {
      throw new Error(`Método de pago no soportado: ${paymentMethod}`);
    }
    return strategy;
  }

  async checkout(userId, items, payment) {
    if (!userId) throw new Error("Usuario requerido");
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Debes enviar items para la orden");
    }
    if (!payment?.paymentMethod || !payment?.paymentDetails) {
      throw new Error("Datos de pago incompletos");
    }

    const strategy = this.getStrategy(payment.paymentMethod);

    // 1) Validar stock y calcular total (transacción corta)
    let totalAmount = 0;
    let orderItemsData = [];

    await prisma.$transaction(async (tx) => {
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      const byId = new Map(products.map((p) => [p.id, p]));

      for (const item of items) {
        const product = byId.get(item.productId);
        if (!product)
          throw new Error(`Producto no encontrado: ${item.productId}`);
        if (item.quantity <= 0)
          throw new Error(`Cantidad inválida para producto ${item.productId}`);
        if (product.stock < item.quantity)
          throw new Error(`Stock insuficiente para producto ${product.id}`);

        const unitPrice = product.price;
        totalAmount += unitPrice * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
        });
      }
    });

    // 2) Procesar pago externo (fuera de la transacción)
    const paymentResult = await strategy.processPayment(
      payment.paymentDetails,
      totalAmount
    );
    if (!paymentResult.success) {
      throw new Error(
        `Pago rechazado: ${paymentResult.error || "desconocido"}`
      );
    }

    // 3) Crear orden y actualizar stock (nueva transacción)
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          status: "COMPLETED",
          totalAmount,
          items: {
            create: orderItemsData,
          },
          transactionId: paymentResult.transactionId || null, // opcional
        },
        include: {
          items: { include: { product: true } },
        },
      });

      return order;
    });

    return order;
  }

  async listUserOrders(userId, { page = 1, limit = 10 } = {}) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: { items: { include: { product: true } } },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { page: Number(page), limit: Number(limit), total, orders };
  }

  async getUserOrderById(userId, orderId) {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: { include: { product: true } } },
    });

    if (!order || order.userId !== Number(userId)) {
      return null;
    }
    return order;
  }
}

module.exports = new OrderService();

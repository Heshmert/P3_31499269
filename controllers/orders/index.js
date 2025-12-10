const OrderService = require('@services/OrderService');

// POST /orders → crear orden y procesar pago
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // viene del middleware JWT
    const { items, paymentMethod, paymentDetails } = req.body;

    const order = await OrderService.checkout(userId, items, {
      paymentMethod,
      paymentDetails
    });

    res.status(201).json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      data: { message: err.message }
    });
  }
};

// GET /orders → historial del usuario con paginación
exports.listOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const result = await OrderService.listUserOrders(userId, { page, limit });

    res.json({
      status: 'success',
      data: result
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      data: { message: err.message }
    });
  }
};

// GET /orders/:id → detalle de una orden
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await OrderService.getUserOrderById(userId, id);

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        data: { message: 'Orden no encontrada o no pertenece al usuario' }
      });
    }

    res.json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      data: { message: err.message }
    });
  }
};

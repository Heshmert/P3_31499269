const express = require('express');
const router = express.Router();
const ordersController = require('@controllers/orders');
const authMiddleware = require('@middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de órdenes (requiere autenticación JWT)
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una orden y procesar el pago (transacción atómica)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *               - paymentDetails
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               paymentMethod:
 *                 type: string
 *                 example: CreditCard
 *               paymentDetails:
 *                 type: object
 *                 required:
 *                   - cardNumber
 *                   - cvv
 *                   - expirationMonth
 *                   - expirationYear
 *                   - fullName
 *                   - currency
 *                 properties:
 *                   cardNumber:
 *                     type: string
 *                     example: "4111111111111111"
 *                   cvv:
 *                     type: string
 *                     example: "123"
 *                   expirationMonth:
 *                     type: string
 *                     example: "01"
 *                   expirationYear:
 *                     type: string
 *                     example: "2024"
 *                   fullName:
 *                     type: string
 *                     example: "APROBADO"
 *                   currency:
 *                     type: string
 *                     example: "USD"
 *                   description:
 *                     type: string
 *                     example: "Compra en tienda"
 *                   reference:
 *                     type: string
 *                     example: "order:12345"
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Error en stock o pago rechazado
 */
router.post('/', authMiddleware, ordersController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar órdenes del usuario autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 */
router.get('/', authMiddleware, ordersController.listOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtener detalle de una orden específica
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Detalle de la orden
 *       404:
 *         description: Orden no encontrada o no pertenece al usuario
 */
router.get('/:id', authMiddleware, ordersController.getOrderById);

module.exports = router;

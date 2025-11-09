const express = require('express');
const router = express.Router();
const ProductController = require('@controllers/products');
const auth = require('@middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin - Products
 *   description: Gestión protegida de productos
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - categoryId
 *               - tagIds
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               author:
 *                 type: string
 *               publisher:
 *                 type: string
 *               isbn:
 *                 type: string
 *               language:
 *                 type: string
 *               format:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', auth, ProductController.create);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtiene un producto por ID (vista admin)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', auth, ProductController.getById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               author:
 *                 type: string
 *               publisher:
 *                 type: string
 *               isbn:
 *                 type: string
 *               language:
 *                 type: string
 *               format:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', auth, ProductController.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', auth, ProductController.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const ProductController = require('@controllers/products');

/**
 * @swagger
 * tags:
 *   name: Public - Products
 *   description: Consulta pública de productos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista y filtra productos públicamente
 *     tags: [Public - Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: number
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de productos filtrados
 */
router.get('/products', ProductController.publicList);

/**
 * @swagger
 * /p/{id}-{slug}:
 *   get:
 *     summary: Obtiene un producto por ID y slug (self-healing)
 *     tags: [Public - Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       301:
 *         description: Redirección a la URL canónica
 *       404:
 *         description: Producto no encontrado
 */
router.get('/p/:id-:slug', ProductController.publicGetBySlug);

module.exports = router;

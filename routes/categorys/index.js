const express = require('express');
const router = express.Router();
const CategoryController = require('@controllers/categorys');
const auth = require('@middleware/auth');



/**
 * @swagger
 * tags:
 *   name: Admin - Categories
 *   description: Gestión protegida de categorías
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas las categorías
 *     tags: [Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', auth, CategoryController.getAll);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     tags: [Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/:id', auth, CategoryController.getById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Admin - Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría creada
 *       400:
 *         description: Error de validación
 */
router.post('/', auth, CategoryController.create);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 */
router.put('/:id', auth, CategoryController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Elimina una categoría por ID
 *     tags: [Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
router.delete('/:id', auth, CategoryController.delete);

module.exports = router;

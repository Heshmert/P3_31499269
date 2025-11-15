const express = require('express');
const router = express.Router();
const TagController = require('@controllers/tags');
const auth = require('@middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin - Tags
 *   description: Gestión protegida de etiquetas
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Lista todas las etiquetas
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de etiquetas
 */
router.get('/', auth, TagController.getAll);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Obtiene una etiqueta por ID
 *     tags: [Admin - Tags]
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
 *         description: Etiqueta encontrada
 *       404:
 *         description: Etiqueta no encontrada
 */
router.get('/:id', auth, TagController.getById);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Crea una nueva etiqueta
 *     tags: [Admin - Tags]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Etiqueta creada
 *       400:
 *         description: Error de validación
 */
router.post('/', auth, TagController.create);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Actualiza una etiqueta existente
 *     tags: [Admin - Tags]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Etiqueta actualizada
 *       404:
 *         description: Etiqueta no encontrada
 */
router.put('/:id', auth, TagController.update);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Elimina una etiqueta por ID
 *     tags: [Admin - Tags]
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
 *         description: Etiqueta eliminada
 *       404:
 *         description: Etiqueta no encontrada
 */
router.delete('/:id', auth, TagController.delete);

module.exports = router;

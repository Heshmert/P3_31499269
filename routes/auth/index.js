const express = require('express');
const router = express.Router();

const loginController = require('../../controllers/auth/login');
const registerController = require('../../controllers/auth/register');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token devuelto
 */
router.post('/login', loginController);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un usuario y devuelve token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/register', registerController);

module.exports = router;
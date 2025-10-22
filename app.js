const { swaggerUi, swaggerSpec } = require('./swagger');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', indexRouter);

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica si el servidor está activo
 *     responses:
 *       200:
 *         description: OK sin contenido
 */

app.get('/ping', (req, res) => {
  res.status(200).send();
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Devuelve información del desarrollador
 *     responses:
 *       200:
 *         description: Información personal en formato JSend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                     cedula:
 *                       type: string
 *                     seccion:
 *                       type: string
 *             example:
 *               status: success
 *               data:
 *                 nombreCompleto: "Juan Pablo Gonzalez La Posta"
 *                 cedula: "31499269"
 *                 seccion: "1"
 */
app.get('/about', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      nombreCompleto: 'Juan Pablo Gonzalez La Posta',
      cedula: '31499269',
      seccion: '1'
    }
  });
});


module.exports = app;

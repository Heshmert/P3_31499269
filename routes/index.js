var express = require("express");
var router = express.Router();
const tagsRouter = require("./tags");
const categorysRouter = require("./categorys");
const productsRouter = require("./products");
const publicProductsRouter = require("./products/public");
const usersRouter = require("./users");
const authRouter = require("./auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica si el servidor está activo
 *     responses:
 *       200:
 *         description: OK sin contenido
 */

router.get("/ping", (req, res) => {
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
router.get("/about", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      nombreCompleto: "Juan Pablo Gonzalez La Posta",
      cedula: "31499269",
      seccion: "1",
    },
  });
});

router.use("/auth", authRouter);

router.use("/users", usersRouter);

router.use("/tags", tagsRouter);

router.use("/categories", categorysRouter);

router.use("/admin/products", productsRouter);

router.use("/products", publicProductsRouter);

module.exports = router;

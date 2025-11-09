const ProductModel = require("@models/products");

const ProductController = {
  async getById(req, res) {
    const id = Number(req.params.id);
    const product = await ProductModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", data: { message: "Producto no encontrado" } });
    }
    res.json({ status: "success", data: { product } });
  },

  async create(req, res) {
    try {
      const product = await ProductModel.create(req.body);
      res.json({ status: "success", data: { product } });
    } catch (error) {
      res
        .status(400)
        .json({ status: "fail", data: { message: "Error al crear producto" } });
    }
  },

  async update(req, res) {
    const id = Number(req.params.id);
    try {
      const product = await ProductModel.update(id, req.body);
      res.json({ status: "success", data: { product } });
    } catch (error) {
      res.status(404).json({
        status: "fail",
        data: { message: "Error al actualizar producto" },
      });
    }
  },

  async delete(req, res) {
    const id = Number(req.params.id);
    try {
      await ProductModel.delete(id);
      res.json({ status: "success", data: { message: "Producto eliminado" } });
    } catch (error) {
      res
        .status(404)
        .json({ status: "fail", data: { message: "Producto no encontrado" } });
    }
  },

  async publicGetBySlug(req, res) {
    const id = Number(req.params.id);
    const slug = req.params.slug;

    const product = await ProductModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", data: { message: "Producto no encontrado" } });
    }

    if (product.slug !== slug) {
      return res.redirect(301, `/p/${product.id}-${product.slug}`);
    }

    res.json({ status: "success", data: { product } });
  },
  async publicList(req, res) {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      price_min,
      price_max,
      search,
      publisher,
      language,
      format,
    } = req.query;

    const filters = {};

    if (category) {
      filters.category = {
        OR: [
          { name: { contains: category, mode: "insensitive" } },
          { id: Number(category) || undefined },
        ],
      };
    }

    if (tags) {
      const tagIds = Array.isArray(tags) ? tags.map(Number) : [Number(tags)];
      filters.tags = { some: { id: { in: tagIds } } };
    }

    if (price_min || price_max) {
      filters.price = {};
      if (price_min) filters.price.gte = Number(price_min);
      if (price_max) filters.price.lte = Number(price_max);
    }

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (publisher)
      filters.publisher = { contains: publisher, mode: "insensitive" };
    if (language)
      filters.language = { contains: language, mode: "insensitive" };
    if (format) filters.format = { contains: format, mode: "insensitive" };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await ProductModel.findMany({
      where: filters,
      skip,
      take: Number(limit),
    });

    res.json({ status: "success", data: { products } });
  },
};

module.exports = ProductController;

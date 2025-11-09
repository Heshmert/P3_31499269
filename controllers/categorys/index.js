const CategoryModel = require('@models/categorys');

const CategoryController = {
  async getAll(req, res) {
    const categories = await CategoryModel.findAll();
    res.json({ status: "success", data: { categories } });
  },

  async getById(req, res) {
    const id = Number(req.params.id);
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ status: "fail", data: { message: "Categoría no encontrada" } });
    }
    res.json({ status: "success", data: { category } });
  },

  async create(req, res) {
    const { name, description } = req.body;
    try {
      const category = await CategoryModel.create({ name, description });
      res.json({ status: "success", data: { category } });
    } catch (error) {
      res
        .status(400)
        .json({
          status: "fail",
          data: { message: "Nombre duplicado o inválido" },
        });
    }
  },

  async update(req, res) {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    try {
      const category = await CategoryModel.update(id, { name, description });
      res.json({ status: "success", data: { category } });
    } catch (error) {
      res
        .status(404)
        .json({ status: "fail", data: { message: "Categoría no encontrada" } });
    }
  },

  async delete(req, res) {
    const id = Number(req.params.id);
    try {
      await CategoryModel.delete(id);
      res.json({ status: "success", data: { message: "Categoría eliminada" } });
    } catch (error) {
      res
        .status(404)
        .json({ status: "fail", data: { message: "Categoría no encontrada" } });
    }
  },
};

module.exports = CategoryController;

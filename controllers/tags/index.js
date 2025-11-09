const TagModel = require('@models/tags');

const TagController = {
  async getAll(req, res) {
    const tags = await TagModel.findAll();
    res.json({ status: "success", data: { tags } });
  },

  async getById(req, res) {
    const id = Number(req.params.id);
    const tag = await TagModel.findById(id);
    if (!tag) {
      return res
        .status(404)
        .json({ status: "fail", data: { message: "Etiqueta no encontrada" } });
    }
    res.json({ status: "success", data: { tag } });
  },

  async create(req, res) {
    const { name } = req.body;
    try {
      const tag = await TagModel.create({ name });
      res.json({ status: "success", data: { tag } });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        data: { message: "Nombre duplicado o inválido" },
      });
    }
  },

  async update(req, res) {
    const id = Number(req.params.id);
    const { name } = req.body;
    try {
      const tag = await TagModel.update(id, { name });
      res.json({ status: "success", data: { tag } });
    } catch (error) {
      res
        .status(404)
        .json({ status: "fail", data: { message: "Etiqueta no encontrada" } });
    }
  },

  async delete(req, res) {
    const id = Number(req.params.id);
    try {
      await TagModel.delete(id);
      res.json({ status: "success", data: { message: "Etiqueta eliminada" } });
    } catch (error) {
      res
        .status(404)
        .json({ status: "fail", data: { message: "Etiqueta no encontrada" } });
    }
  },
};

module.exports = TagController;

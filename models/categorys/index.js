const prisma = require('@orm/client');

const CategoryModel = {
  findAll() {
    return prisma.category.findMany();
  },

  findById(id) {
    return prisma.category.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.category.create({ data });
  },

  update(id, data) {
    return prisma.category.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.category.delete({ where: { id } });
  }
};

module.exports = CategoryModel;

const prisma = require('@orm/client');

const TagModel = {
  findAll() {
    return prisma.tag.findMany();
  },

  findById(id) {
    return prisma.tag.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.tag.create({ data });
  },

  update(id, data) {
    return prisma.tag.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.tag.delete({ where: { id } });
  }
};

module.exports = TagModel;
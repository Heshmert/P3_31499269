const prisma = require("@orm/client");

const ProductModel = {
  finprismayId(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, tags: true },
    });
  },

  create(data) {
    const { tagIds, ...productData } = data;
    return prisma.product.create({
      data: {
        ...productData,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: { category: true, tags: true },
    });
  },

  update(id, data) {
    const { tagIds, ...productData } = data;
    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
      },
      include: { category: true, tags: true },
    });
  },

  delete(id) {
    return prisma.product.delete({ where: { id } });
  },

  findMany({ where = {}, skip = 0, take = 10 }) {
    return prisma.product.findMany({
      where,
      skip,
      take,
      include: { category: true, tags: true }
    });
  }
};

module.exports = ProductModel;

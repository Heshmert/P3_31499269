const prisma = require('@orm/client');

const ProductRepository = {
  findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, tags: true }
    });
  },

  findMany(query) {
    return prisma.product.findMany(query);
  },

  create(data) {
    const { tagIds, ...productData } = data;
    return prisma.product.create({
      data: {
        ...productData,
        tags: {
          connect: tagIds.map(id => ({ id }))
        }
      },
      include: { category: true, tags: true }
    });
  },

  update(id, data) {
    const { tagIds, ...productData } = data;
    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        tags: {
          set: tagIds.map(id => ({ id }))
        }
      },
      include: { category: true, tags: true }
    });
  },

  delete(id) {
    return prisma.product.delete({ where: { id } });
  }
};

module.exports = ProductRepository;

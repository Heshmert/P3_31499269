const prisma = require('@orm/client');
const slugify = require('slugify');

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
    const { tagIds, categoryId, name, ...productData } = data;
    const slug = slugify(name, { lower: true });

    return prisma.product.create({
      data: {
        ...productData,
        name,
        slug,
        category: { connect: { id: categoryId } },
        tags: tagIds ? { connect: tagIds.map(id => ({ id })) } : undefined
      },
      include: { category: true, tags: true }
    });
  },

  update(id, data) {
    const { tagIds, categoryId, name, ...productData } = data;
    const slug = slugify(name, { lower: true });

    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        name,
        slug,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        tags: tagIds ? { set: tagIds.map(id => ({ id })) } : undefined
      },
      include: { category: true, tags: true }
    });
  },

  delete(id) {
    return prisma.product.delete({ where: { id } });
  }
};

module.exports = ProductRepository;

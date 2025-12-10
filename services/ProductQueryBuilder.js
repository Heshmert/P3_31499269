class ProductQueryBuilder {
  constructor() {
    this.query = {
      where: {},
      skip: 0,
      take: 10,
      include: { category: true, tags: true },
    };
  }

  applyPagination(page, limit) {
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    this.query.skip = (p - 1) * l;
    this.query.take = l;
    return this;
  }

  applySearch(search) {
    if (search) {
      this.query.where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    return this;
  }

  applyCategory(category) {
    if (category) {
      this.query.where.category = {
        OR: [
          { name: { contains: category } },
          { id: Number(category) || undefined },
        ],
      };
    }
    return this;
  }

  applyTags(tags) {
    if (tags) {
      const tagIds = Array.isArray(tags)
        ? tags.map(Number)
        : String(tags)
            .split(',')
            .map((id) => parseInt(id))
            .filter((id) => !isNaN(id));

      if (tagIds.length > 0) {
        this.query.where.tags = { some: { id: { in: tagIds } } };
      }
    }
    return this;
  }

  applyPriceRange(price_min, price_max) {
    if (price_min || price_max) {
      this.query.where.price = {};
      if (price_min) this.query.where.price.gte = Number(price_min);
      if (price_max) this.query.where.price.lte = Number(price_max);
    }
    return this;
  }

  applyCustomFilters({ publisher, language, format }) {
    if (publisher) this.query.where.publisher = { contains: publisher };
    if (language) this.query.where.language = { contains: language };
    if (format) this.query.where.format = { contains: format };
    return this;
  }

  build() {
    return this.query;
  }
}

module.exports = ProductQueryBuilder;

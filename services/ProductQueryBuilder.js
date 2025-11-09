class ProductQueryBuilder {
  constructor(params = {}) {
    this.params = params;
    this.query = {
      where: {},
      skip: 0,
      take: 10,
      include: { category: true, tags: true },
    };
  }

  applyPagination() {
    const page = Number(this.params.page) || 1;
    const limit = Number(this.params.limit) || 10;
    this.query.skip = (page - 1) * limit;
    this.query.take = limit;
    return this;
  }

  applySearch() {
    const { search } = this.params;
    if (search) {
      this.query.where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    return this;
  }

  applyCategory() {
    const { category } = this.params;
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

  applyTags() {
    const { tags } = this.params;
    if (tags) {
      const tagIds = Array.isArray(tags)
        ? tags.map(Number)
        : String(tags)
            .split(",")
            .map((id) => parseInt(id))
            .filter((id) => !isNaN(id));

      if (tagIds.length > 0) {
        this.query.where.tags = { some: { id: { in: tagIds } } };
      }
    }
    return this;
  }

  applyPriceRange() {
    const { price_min, price_max } = this.params;
    if (price_min || price_max) {
      this.query.where.price = {};
      if (price_min) this.query.where.price.gte = Number(price_min);
      if (price_max) this.query.where.price.lte = Number(price_max);
    }
    return this;
  }

  applyCustomFilters() {
    const { publisher, language, format } = this.params;
    if (publisher) this.query.where.publisher = { contains: publisher };
    if (language) this.query.where.language = { contains: language };
    if (format) this.query.where.format = { contains: format };
    return this;
  }

  build() {
    return this.applyPagination()
      .applySearch()
      .applyCategory()
      .applyTags()
      .applyPriceRange()
      .applyCustomFilters().query;
  }
}

module.exports = ProductQueryBuilder;

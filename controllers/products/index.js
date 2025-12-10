const ProductRepository = require('@repositories/ProductRepository');
const ProductQueryBuilder = require('@services/ProductQueryBuilder');

// 🔐 Rutas protegidas (admin)
async function create(req, res) {
  try {
    const product = await ProductRepository.create(req.body);
    res.json({ status: 'success', data: { product } });
  } catch (error) {
    res.status(400).json({ status: 'fail', data: { message: 'Error al crear producto' } });
  }
}

async function update(req, res) {
  const id = Number(req.params.id);
  try {
    const product = await ProductRepository.update(id, req.body);
    res.json({ status: 'success', data: { product } });
  } catch (error) {
    res.status(404).json({ status: 'fail', data: { message: 'Error al actualizar producto' } });
  }
}

async function deleteProduct(req, res) {
  const id = Number(req.params.id);
  try {
    await ProductRepository.delete(id);
    res.json({ status: 'success', data: { message: 'Producto eliminado' } });
  } catch (error) {
    res.status(404).json({ status: 'fail', data: { message: 'Producto no encontrado' } });
  }
}

async function getById(req, res) {
  const id = Number(req.params.id);
  const product = await ProductRepository.findById(id);
  if (!product) {
    return res.status(404).json({ status: 'fail', data: { message: 'Producto no encontrado' } });
  }
  res.json({ status: 'success', data: { product } });
}

// 🌐 Rutas públicas
async function publicList(req, res) {
  try {
    const { page, limit, search, category, tags, price_min, price_max, publisher, language, format } = req.query;

    const builder = new ProductQueryBuilder()
      .applyPagination(page, limit)
      .applySearch(search)
      .applyCategory(category)
      .applyTags(tags)
      .applyPriceRange(price_min, price_max)
      .applyCustomFilters({ publisher, language, format });

    const query = builder.build();
    const products = await ProductRepository.findMany(query);

    res.json({ status: 'success', data: { products } });
  } catch (error) {
    res.status(400).json({ status: 'fail', data: { message: error.message } });
  }
}

async function publicGetBySlug(req, res) {
  const id = Number(req.params.id);
  const slug = req.params.slug;

  const product = await ProductRepository.findById(id);
  if (!product) {
    return res.status(404).json({ status: 'fail', data: { message: 'Producto no encontrado' } });
  }

  if (product.slug !== slug) {
    return res.redirect(301, `/products/${product.id}-${product.slug}`);
  }

  res.json({ status: 'success', data: { product } });
}

module.exports = {
  create,
  update,
  delete: deleteProduct,
  getById,
  publicList,
  publicGetBySlug
};

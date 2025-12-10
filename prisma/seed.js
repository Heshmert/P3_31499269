const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Usuarios
  const user1 = await prisma.user.create({
    data: {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'hashedpassword123'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      nombre: 'María Gómez',
      email: 'maria@example.com',
      password: 'hashedpassword456'
    }
  });

  // Categorías
  const category1 = await prisma.category.create({
    data: {
      name: 'Programación',
      description: 'Libros y recursos de programación'
    }
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Bases de Datos',
      description: 'Libros sobre diseño y administración de bases de datos'
    }
  });

  // Tags
  const tag1 = await prisma.tag.create({ data: { name: 'JavaScript' } });
  const tag2 = await prisma.tag.create({ data: { name: 'SQL' } });
  const tag3 = await prisma.tag.create({ data: { name: 'Backend' } });

  // Productos
  const product1 = await prisma.product.create({
    data: {
      name: 'Aprendiendo JavaScript',
      description: 'Guía completa para dominar JavaScript moderno',
      price: 25.99,
      stock: 50,
      slug: 'aprendiendo-javascript',
      author: 'Carlos López',
      publisher: 'TechBooks',
      isbn: '978-1-23456-789-0',
      language: 'Español',
      format: 'Paperback',
      year: 2022,
      categoryId: category1.id,
      tags: { connect: [{ id: tag1.id }, { id: tag3.id }] }
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Fundamentos de SQL',
      description: 'Aprende a consultar y administrar bases de datos relacionales',
      price: 30.50,
      stock: 40,
      slug: 'fundamentos-sql',
      author: 'Ana Torres',
      publisher: 'DBBooks',
      isbn: '978-9-87654-321-0',
      language: 'Español',
      format: 'Hardcover',
      year: 2021,
      categoryId: category2.id,
      tags: { connect: [{ id: tag2.id }] }
    }
  });

  // Orden de ejemplo
  const order = await prisma.order.create({
    data: {
      userId: user1.id,
      status: 'COMPLETED',
      totalAmount: 25.99 * 2 + 30.50,
      transactionId: 'TX123456',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 2,
            unitPrice: 25.99
          },
          {
            productId: product2.id,
            quantity: 1,
            unitPrice: 30.50
          }
        ]
      }
    }
  });

  console.log('Seed completado ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

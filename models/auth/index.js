const prisma = require('@orm/client');

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function createUser({ nombre, email, passwordHash }) {
  return prisma.user.create({
    data: {
      nombre,
      email,
      password: passwordHash,
    },
  });
}

module.exports = {
  findByEmail,
  createUser,
  prisma, // útil para tests/cleanup
};

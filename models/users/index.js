const prisma = require("../../prisma/config.prisma");

const getAllUsers = () =>
  prisma.user.findMany({ select: { id: true, nombre: true, email: true } });

const getUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, nombre: true, email: true },
  });

const createUser = async ({ nombre, email, password }) =>
  prisma.user.create({ data: { nombre, email, password } });

const updateUser = async (id, { nombre, email }) =>
  prisma.user.update({ where: { id }, data: { nombre, email } });

const deleteUser = (id) => prisma.user.delete({ where: { id } });

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

const bcrypt = require("bcrypt");
const userModel = require("../../models/users");

const getUsers = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json({ status: "success", data: users });
};

const getUser = async (req, res) => {
  const user = await userModel.getUserById(parseInt(req.params.id));
  if (!user)
    return res
      .status(404)
      .json({ status: "fail", message: "Usuario no encontrado" });
  res.json({ status: "success", data: user });
};

const createUser = async (req, res) => {
  const { nombre, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await userModel.createUser({
      nombre,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      data: { id: user.id, nombre: user.nombre, email: user.email },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: "fail", message: "Email duplicado o datos inválidos" });
  }
};

const updateUser = async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const user = await userModel.updateUser(parseInt(req.params.id), {
      nombre,
      email,
    });
    res.json({
      status: "success",
      data: { id: user.id, nombre: user.nombre, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: "Error al actualizar" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(parseInt(req.params.id));
    res.json({ status: "success", data: null });
  } catch (err) {
    res.status(404).json({ status: "fail", message: "Usuario no encontrado" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};

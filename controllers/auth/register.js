const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findByEmail, createUser } = require('../../models/auth');

module.exports = async function registerController(req, res) {
  const { nombre, email, password } = req.body;
  try {
    const existing = await findByEmail(email);
    if (existing) {
      return res.status(409).json({ status: 'fail', message: 'Email ya registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ nombre, email, passwordHash });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({ status: 'success', data: { id: user.id, token } });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Error al registrar usuario' });
  }
};
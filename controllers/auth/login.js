const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findByEmail } = require('../../models/auth');

module.exports = async function loginController(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ status: 'success', data: { token } });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Error al iniciar sesión' });
  }
};
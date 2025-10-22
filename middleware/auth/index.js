const jwt = require("jsonwebtoken");

module.exports = function ValidacionToken(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", message: "Token no proporcionado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: "fail", message: "Token inválido" });
  }
};

import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ data: null, message: "Token no proporcionado" });
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ data: null, message: "Formato de token inválido. Use 'Bearer <token>'" });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ data: null, message: "Token inválido o expirado" });
  }
}

export default verifyToken;

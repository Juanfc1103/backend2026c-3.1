export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ data: null, message: "No autenticado" });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        data: null,
        message: `Advertencia: el rol '${req.user.rol}' no está autorizado para realizar esta operación`,
      });
    }
    next();
  };
}

export default authorizeRoles;

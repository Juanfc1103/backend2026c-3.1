import express from "express";
import usuariosController from "../controllers/usuarios.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const response = await usuariosController.mostrarUsuarios();
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.get("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const response = await usuariosController.buscarPorId(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.post("/create", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const response = await usuariosController.crear(req.body);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.put("/update/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const response = await usuariosController.actualizar(req.body, req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.delete("/delete/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const response = await usuariosController.eliminar(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

export default router;

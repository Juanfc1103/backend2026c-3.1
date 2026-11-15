import express from "express";
import funcionesController from "../controllers/funciones.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await funcionesController.mostrarFunciones();
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await funcionesController.buscarPorId(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.post("/create", verifyToken, authorizeRoles("admin", "empleado"), async (req, res) => {
  try {
    const response = await funcionesController.crear(req.body);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.put("/update/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const response = await funcionesController.actualizar(req.body, req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.delete("/delete/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const response = await funcionesController.eliminar(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

export default router;

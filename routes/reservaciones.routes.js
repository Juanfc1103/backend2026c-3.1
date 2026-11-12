import express from "express";
import reservacionesController from "../controllers/reservaciones.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const response = await reservacionesController.mostrarReservaciones();
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.get("/busqueda/fecha", verifyToken, async (req, res) => {
  try {
    const { inicio, fin } = req.query;
    const response = await reservacionesController.porRangoDeFecha(inicio, fin);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const response = await reservacionesController.buscarPorId(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.delete("/delete-relation/:id/ticket", verifyToken, async (req, res) => {
  try {
    const response = await reservacionesController.eliminarRelacionTicket(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.post("/create", verifyToken, async (req, res) => {
  try {
    const response = await reservacionesController.crear(req.body);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const response = await reservacionesController.actualizar(req.body, req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const response = await reservacionesController.eliminar(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

export default router;

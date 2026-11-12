import express from "express";
import ticketsController from "../controllers/tickets.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const response = await ticketsController.mostrarTickets();
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const response = await ticketsController.buscarPorId(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.post("/create", verifyToken, async (req, res) => {
  try {
    const response = await ticketsController.crear(req.body);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const response = await ticketsController.actualizar(req.body, req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const response = await ticketsController.eliminar(req.params.id);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

export default router;

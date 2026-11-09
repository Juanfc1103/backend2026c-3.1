import express from "express";
import peliculasController from "../controllers/peliculas.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await peliculasController.mostrarPeliculas();
    res.status(response.status).json({
      data: response.data,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.get("/grupo/ultimas5", async (req, res) => {
  try {
    const response = await peliculasController.ultimas5();
    res.status(response.status).json({
      data: response.data,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await peliculasController.buscarPorId(req.params.id);
    res.status(response.status).json({
      data: response.data,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const response = await peliculasController.crear(req.body);
    res.status(response.status).json({
      data: response.data,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const response = await peliculasController.actualizar(req.body, req.params.id);
    res.status(response.status).json({
      data: response.data,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const response = await peliculasController.eliminar(req.params.id);
    res.status(response.status).json({
      data: response.data,
      message: response.message,
    });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

export default router;

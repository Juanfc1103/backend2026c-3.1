import express from "express";
import peliculasController from "../controllers/peliculas.controller.js";
import salasController from "../controllers/salas.controller.js";
import funcionesController from "../controllers/funciones.controller.js";
import ticketsController from "../controllers/tickets.controller.js";
import reservacionesController from "../controllers/reservaciones.controller.js";
import usuariosController from "../controllers/usuarios.controller.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Sistema de Cine" });
});

router.get("/vistas/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

router.get("/vistas/register", (req, res) => {
  res.render("register", { title: "Registro" });
});

router.get("/vistas/peliculas", async (req, res) => {
  try {
    const response = await peliculasController.mostrarPeliculas();
    res.render("peliculas", { title: "Películas", peliculas: response.data || [] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/vistas/salas", async (req, res) => {
  try {
    const response = await salasController.mostrarSalas();
    res.render("salas", { title: "Salas", salas: response.data || [] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/vistas/funciones", async (req, res) => {
  try {
    const response = await funcionesController.mostrarFunciones();
    res.render("funciones", { title: "Funciones", funciones: response.data || [] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/vistas/tickets", async (req, res) => {
  try {
    const response = await ticketsController.mostrarTickets();
    res.render("tickets", { title: "Tickets", tickets: response.data || [] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/vistas/reservaciones", async (req, res) => {
  try {
    const response = await reservacionesController.mostrarReservaciones();
    res.render("reservaciones", { title: "Reservaciones", reservaciones: response.data || [] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/vistas/usuarios", async (req, res) => {
  try {
    const response = await usuariosController.mostrarUsuarios();
    res.render("usuarios", { title: "Usuarios", usuarios: response.data || [] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;

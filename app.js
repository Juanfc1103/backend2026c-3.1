import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.routes.js";
import peliculasRouter from "./routes/peliculas.routes.js";
import salasRouter from "./routes/salas.routes.js";
import funcionesRouter from "./routes/funciones.routes.js";
import ticketsRouter from "./routes/tickets.routes.js";
import authRouter from "./routes/auth.routes.js";
import usuariosRouter from "./routes/usuarios.routes.js";
import reservacionesRouter from "./routes/reservaciones.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/peliculas", peliculasRouter);
app.use("/salas", salasRouter);
app.use("/funciones", funcionesRouter);
app.use("/tickets", ticketsRouter);
app.use("/auth", authRouter);
app.use("/usuarios", usuariosRouter);
app.use("/reservaciones", reservacionesRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  if (req.accepts("html")) {
    res.render("error", { message: err.message, error: { status: err.status || 500, stack: err.stack } });
  } else {
    res.json({ data: null, message: err.message });
  }
});

export default app;

import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

class PeliculasController {
  async mostrarPeliculas() {
    const [rows] = await pool.query("SELECT * FROM peliculas");
    if (rows.length === 0) {
      return {
        status: 200,
        data: null,
        message: "No hay películas registradas",
      };
    }
    return {
      status: 200,
      data: rows,
      message: "Películas listadas exitosamente",
    };
  }

  async buscarPorId(idPel) {
    const [rows] = await pool.query("SELECT * FROM peliculas WHERE id = ?", [idPel]);
    if (rows.length === 0) {
      return {
        status: 404,
        data: null,
        message: "Película no encontrada",
      };
    }
    return {
      status: 200,
      data: rows[0],
      message: "Película encontrada exitosamente",
    };
  }

  async ultimas5() {
    const [rows] = await pool.query("SELECT * FROM peliculas");
    if (rows.length === 0) {
      return {
        status: 200,
        data: null,
        message: "No hay películas registradas",
      };
    }
    const ultimas = rows.slice(-5);
    return {
      status: 200,
      data: ultimas,
      message: "Últimas 5 películas obtenidas exitosamente",
    };
  }

  async crear(newPelicula) {
    if (
      !newPelicula ||
      !newPelicula.titulo ||
      !newPelicula.genero ||
      !newPelicula.duracion
    ) {
      return {
        status: 400,
        data: null,
        message: "Faltan datos indispensables de la película",
      };
    }

    const id = uuidv4();
    const pelicula = {
      id,
      titulo: newPelicula.titulo,
      genero: newPelicula.genero,
      duracion: newPelicula.duracion,
    };

    await pool.query(
      "INSERT INTO peliculas (id, titulo, genero, duracion) VALUES (?, ?, ?, ?)",
      [id, newPelicula.titulo, newPelicula.genero, newPelicula.duracion]
    );

    return {
      status: 201,
      data: pelicula,
      message: "Película agregada exitosamente",
    };
  }

  async actualizar(newPelicula, idPel) {
    const [existing] = await pool.query("SELECT * FROM peliculas WHERE id = ?", [idPel]);
    if (existing.length === 0) {
      return {
        status: 400,
        data: null,
        message: "Película no encontrada",
      };
    }

    const current = existing[0];
    const titulo = newPelicula.titulo ? newPelicula.titulo : current.titulo;
    const genero = newPelicula.genero ? newPelicula.genero : current.genero;
    const duracion = newPelicula.duracion ? newPelicula.duracion : current.duracion;

    await pool.query(
      "UPDATE peliculas SET titulo = ?, genero = ?, duracion = ? WHERE id = ?",
      [titulo, genero, duracion, idPel]
    );

    return {
      status: 200,
      data: { id: idPel, titulo, genero, duracion },
      message: "Película actualizada exitosamente",
    };
  }

  async eliminar(idPel) {
    const [existing] = await pool.query("SELECT * FROM peliculas WHERE id = ?", [idPel]);
    if (existing.length === 0) {
      return {
        status: 400,
        data: null,
        message: "Película no encontrada",
      };
    }

    await pool.query("DELETE FROM peliculas WHERE id = ?", [idPel]);
    const [rows] = await pool.query("SELECT * FROM peliculas");

    return {
      status: 200,
      data: rows,
      message: "Película eliminada exitosamente",
    };
  }
}

const peliculasController = new PeliculasController();
export default peliculasController;

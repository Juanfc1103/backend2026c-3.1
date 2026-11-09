import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

class FuncionesController {
  async mostrarFunciones() {
    const [rows] = await pool.query(
      "SELECT f.id, f.horario, p.titulo AS pelicula, s.nombre AS sala FROM funciones f JOIN peliculas p ON f.peliculaId = p.id JOIN salas s ON f.salaId = s.id"
    );
    if (rows.length === 0) {
      return { status: 200, data: null, message: "No hay funciones registradas" };
    }
    return { status: 200, data: rows, message: "Funciones listadas exitosamente" };
  }

  async buscarPorId(idFuncion) {
    const [rows] = await pool.query("SELECT * FROM funciones WHERE id = ?", [idFuncion]);
    if (rows.length === 0) {
      return { status: 404, data: null, message: "Función no encontrada" };
    }
    return { status: 200, data: rows[0], message: "Función encontrada exitosamente" };
  }

  async crear(newFuncion) {
    if (!newFuncion || !newFuncion.peliculaId || !newFuncion.salaId || !newFuncion.horario) {
      return { status: 400, data: null, message: "Faltan datos indispensables de la función" };
    }
    const [peliculaRows] = await pool.query("SELECT id FROM peliculas WHERE id = ?", [newFuncion.peliculaId]);
    if (peliculaRows.length === 0) {
      return { status: 400, data: null, message: "Película no encontrada" };
    }
    const [salaRows] = await pool.query("SELECT id FROM salas WHERE id = ?", [newFuncion.salaId]);
    if (salaRows.length === 0) {
      return { status: 400, data: null, message: "Sala no encontrada" };
    }
    const id = uuidv4();
    const funcion = { id, peliculaId: newFuncion.peliculaId, salaId: newFuncion.salaId, horario: newFuncion.horario };
    await pool.query("INSERT INTO funciones (id, peliculaId, salaId, horario) VALUES (?, ?, ?, ?)", [id, newFuncion.peliculaId, newFuncion.salaId, newFuncion.horario]);
    return { status: 201, data: funcion, message: "Función agregada exitosamente" };
  }

  async actualizar(newFuncion, idFuncion) {
    const [existing] = await pool.query("SELECT * FROM funciones WHERE id = ?", [idFuncion]);
    if (existing.length === 0) {
      return { status: 400, data: null, message: "Función no encontrada" };
    }
    const current = existing[0];
    const peliculaId = newFuncion.peliculaId ? newFuncion.peliculaId : current.peliculaId;
    const salaId = newFuncion.salaId ? newFuncion.salaId : current.salaId;
    const horario = newFuncion.horario ? newFuncion.horario : current.horario;
    if (newFuncion.peliculaId) {
      const [peliculaRows] = await pool.query("SELECT id FROM peliculas WHERE id = ?", [peliculaId]);
      if (peliculaRows.length === 0) {
        return { status: 400, data: null, message: "Película no encontrada" };
      }
    }
    if (newFuncion.salaId) {
      const [salaRows] = await pool.query("SELECT id FROM salas WHERE id = ?", [salaId]);
      if (salaRows.length === 0) {
        return { status: 400, data: null, message: "Sala no encontrada" };
      }
    }
    await pool.query("UPDATE funciones SET peliculaId = ?, salaId = ?, horario = ? WHERE id = ?", [peliculaId, salaId, horario, idFuncion]);
    return { status: 200, data: { id: idFuncion, peliculaId, salaId, horario }, message: "Función actualizada exitosamente" };
  }

  async eliminar(idFuncion) {
    const [existing] = await pool.query("SELECT * FROM funciones WHERE id = ?", [idFuncion]);
    if (existing.length === 0) {
      return { status: 400, data: null, message: "Función no encontrada" };
    }
    await pool.query("DELETE FROM funciones WHERE id = ?", [idFuncion]);
    const [rows] = await pool.query("SELECT * FROM funciones");
    return { status: 200, data: rows, message: "Función eliminada exitosamente" };
  }
}

const funcionesController = new FuncionesController();
export default funcionesController;

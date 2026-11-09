import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

class SalasController {
  mostrarSalas() {
    return new Promise((resolve, reject) => {
      pool
        .query("SELECT * FROM salas")
        .then(([rows]) => {
          if (rows.length === 0) {
            resolve({ status: 200, data: null, message: "No hay salas registradas" });
          } else {
            resolve({ status: 200, data: rows, message: "Salas listadas exitosamente" });
          }
        })
        .catch((error) => reject(error));
    });
  }

  buscarPorId(idSala) {
    return new Promise((resolve, reject) => {
      pool
        .query("SELECT * FROM salas WHERE id = ?", [idSala])
        .then(([rows]) => {
          if (rows.length === 0) {
            resolve({ status: 404, data: null, message: "Sala no encontrada" });
          } else {
            resolve({ status: 200, data: rows[0], message: "Sala encontrada exitosamente" });
          }
        })
        .catch((error) => reject(error));
    });
  }

  crear(newSala) {
    return new Promise((resolve, reject) => {
      if (!newSala || !newSala.nombre || !newSala.capacidad) {
        resolve({ status: 400, data: null, message: "Faltan datos indispensables de la sala" });
        return;
      }
      const id = uuidv4();
      const sala = { id, nombre: newSala.nombre, capacidad: newSala.capacidad };
      pool
        .query("INSERT INTO salas (id, nombre, capacidad) VALUES (?, ?, ?)", [id, newSala.nombre, newSala.capacidad])
        .then(() => {
          resolve({ status: 201, data: sala, message: "Sala agregada exitosamente" });
        })
        .catch((error) => reject(error));
    });
  }

  actualizar(newSala, idSala) {
    return new Promise((resolve, reject) => {
      pool
        .query("SELECT * FROM salas WHERE id = ?", [idSala])
        .then(([existing]) => {
          if (existing.length === 0) {
            resolve({ status: 400, data: null, message: "Sala no encontrada" });
            return null;
          }
          const current = existing[0];
          const nombre = newSala.nombre ? newSala.nombre : current.nombre;
          const capacidad = newSala.capacidad ? newSala.capacidad : current.capacidad;
          return pool
            .query("UPDATE salas SET nombre = ?, capacidad = ? WHERE id = ?", [nombre, capacidad, idSala])
            .then(() => ({ id: idSala, nombre, capacidad }));
        })
        .then((result) => {
          if (result) {
            resolve({ status: 200, data: result, message: "Sala actualizada exitosamente" });
          }
        })
        .catch((error) => reject(error));
    });
  }

  eliminar(idSala) {
    return new Promise((resolve, reject) => {
      pool
        .query("SELECT * FROM salas WHERE id = ?", [idSala])
        .then(([existing]) => {
          if (existing.length === 0) {
            resolve({ status: 400, data: null, message: "Sala no encontrada" });
            return null;
          }
          return pool.query("DELETE FROM salas WHERE id = ?", [idSala]);
        })
        .then((delResult) => {
          if (delResult === null) return null;
          return pool.query("SELECT * FROM salas");
        })
        .then((selectResult) => {
          if (selectResult) {
            resolve({ status: 200, data: selectResult[0], message: "Sala eliminada exitosamente" });
          }
        })
        .catch((error) => reject(error));
    });
  }
}

const salasController = new SalasController();
export default salasController;

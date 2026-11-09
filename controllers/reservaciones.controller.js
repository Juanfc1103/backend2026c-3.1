import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

class ReservacionesController {
  async mostrarReservaciones() {
    const [rows] = await pool.query("SELECT * FROM reservaciones");
    if (rows.length === 0) {
      return { status: 200, data: null, message: "No hay reservaciones registradas" };
    }
    return { status: 200, data: rows, message: "Reservaciones listadas exitosamente" };
  }

  async buscarPorId(idReservacion) {
    const [rows] = await pool.query("SELECT * FROM reservaciones WHERE id = ?", [idReservacion]);
    if (rows.length === 0) {
      return { status: 404, data: null, message: "Reservación no encontrada" };
    }
    return { status: 200, data: rows[0], message: "Reservación encontrada exitosamente" };
  }

  async porRangoDeFecha(fechaInicio, fechaFin) {
    const [rows] = await pool.query("SELECT * FROM reservaciones WHERE fecha BETWEEN ? AND ?", [fechaInicio, fechaFin]);
    return { status: 200, data: rows, message: "Reservaciones filtradas por fecha exitosamente" };
  }

  async eliminarRelacionTicket(idReservacion) {
    const [existing] = await pool.query("SELECT * FROM reservaciones WHERE id = ?", [idReservacion]);
    if (existing.length === 0) {
      return { status: 404, data: null, message: "Reservación no encontrada" };
    }
    await pool.query("UPDATE reservaciones SET ticketId = NULL WHERE id = ?", [idReservacion]);
    const [rows] = await pool.query("SELECT * FROM reservaciones WHERE id = ?", [idReservacion]);
    return { status: 200, data: rows[0], message: "Relación con el ticket eliminada exitosamente" };
  }

  async crear(newReservacion) {
    if (!newReservacion || !newReservacion.cliente || !newReservacion.ticketId || !newReservacion.fecha) {
      return { status: 400, data: null, message: "Faltan datos indispensables de la reservación" };
    }
    const [ticketRows] = await pool.query("SELECT id FROM tickets WHERE id = ?", [newReservacion.ticketId]);
    if (ticketRows.length === 0) {
      return { status: 400, data: null, message: "Ticket no encontrado" };
    }
    const id = uuidv4();
    const reservacion = { id, cliente: newReservacion.cliente, ticketId: newReservacion.ticketId, fecha: newReservacion.fecha };
    await pool.query("INSERT INTO reservaciones (id, cliente, ticketId, fecha) VALUES (?, ?, ?, ?)", [id, newReservacion.cliente, newReservacion.ticketId, newReservacion.fecha]);
    return { status: 201, data: reservacion, message: "Reservación agregada exitosamente" };
  }

  async actualizar(newReservacion, idReservacion) {
    const [existing] = await pool.query("SELECT * FROM reservaciones WHERE id = ?", [idReservacion]);
    if (existing.length === 0) {
      return { status: 400, data: null, message: "Reservación no encontrada" };
    }
    const current = existing[0];
    const cliente = newReservacion.cliente ? newReservacion.cliente : current.cliente;
    const ticketId = newReservacion.ticketId ? newReservacion.ticketId : current.ticketId;
    const fecha = newReservacion.fecha ? newReservacion.fecha : current.fecha;
    if (newReservacion.ticketId) {
      const [ticketRows] = await pool.query("SELECT id FROM tickets WHERE id = ?", [ticketId]);
      if (ticketRows.length === 0) {
        return { status: 400, data: null, message: "Ticket no encontrado" };
      }
    }
    await pool.query("UPDATE reservaciones SET cliente = ?, ticketId = ?, fecha = ? WHERE id = ?", [cliente, ticketId, fecha, idReservacion]);
    return { status: 200, data: { id: idReservacion, cliente, ticketId, fecha }, message: "Reservación actualizada exitosamente" };
  }

  async eliminar(idReservacion) {
    const [existing] = await pool.query("SELECT * FROM reservaciones WHERE id = ?", [idReservacion]);
    if (existing.length === 0) {
      return { status: 400, data: null, message: "Reservación no encontrada" };
    }
    await pool.query("DELETE FROM reservaciones WHERE id = ?", [idReservacion]);
    const [rows] = await pool.query("SELECT * FROM reservaciones");
    return { status: 200, data: rows, message: "Reservación eliminada exitosamente" };
  }
}

const reservacionesController = new ReservacionesController();
export default reservacionesController;

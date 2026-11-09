import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

class TicketsController {
  async mostrarTickets() {
    const [rows] = await pool.query("SELECT * FROM tickets");
    if (rows.length === 0) {
      return { status: 200, data: null, message: "No hay tickets registrados" };
    }
    return { status: 200, data: rows, message: "Tickets listados exitosamente" };
  }

  async buscarPorId(idTicket) {
    const [rows] = await pool.query("SELECT * FROM tickets WHERE id = ?", [idTicket]);
    if (rows.length === 0) {
      return { status: 404, data: null, message: "Ticket no encontrado" };
    }
    return { status: 200, data: rows[0], message: "Ticket encontrado exitosamente" };
  }

  async crear(newTicket) {
    if (!newTicket || !newTicket.funcionId || !newTicket.asiento || !newTicket.precio) {
      return { status: 400, data: null, message: "Faltan datos indispensables del ticket" };
    }
    const [funcionRows] = await pool.query("SELECT id FROM funciones WHERE id = ?", [newTicket.funcionId]);
    if (funcionRows.length === 0) {
      return { status: 400, data: null, message: "Función no encontrada" };
    }
    const id = uuidv4();
    const ticket = { id, funcionId: newTicket.funcionId, asiento: newTicket.asiento, precio: newTicket.precio };
    await pool.query("INSERT INTO tickets (id, funcionId, asiento, precio) VALUES (?, ?, ?, ?)", [id, newTicket.funcionId, newTicket.asiento, newTicket.precio]);
    return { status: 201, data: ticket, message: "Ticket agregado exitosamente" };
  }

  async actualizar(newTicket, idTicket) {
    const [existing] = await pool.query("SELECT * FROM tickets WHERE id = ?", [idTicket]);
    if (existing.length === 0) {
      return { status: 400, data: null, message: "Ticket no encontrado" };
    }
    const current = existing[0];
    const funcionId = newTicket.funcionId ? newTicket.funcionId : current.funcionId;
    const asiento = newTicket.asiento ? newTicket.asiento : current.asiento;
    const precio = newTicket.precio ? newTicket.precio : current.precio;
    if (newTicket.funcionId) {
      const [funcionRows] = await pool.query("SELECT id FROM funciones WHERE id = ?", [funcionId]);
      if (funcionRows.length === 0) {
        return { status: 400, data: null, message: "Función no encontrada" };
      }
    }
    await pool.query("UPDATE tickets SET funcionId = ?, asiento = ?, precio = ? WHERE id = ?", [funcionId, asiento, precio, idTicket]);
    return { status: 200, data: { id: idTicket, funcionId, asiento, precio }, message: "Ticket actualizado exitosamente" };
  }

  async eliminar(idTicket) {
    const [existing] = await pool.query("SELECT * FROM tickets WHERE id = ?", [idTicket]);
    if (existing.length === 0) {
      return { status: 400, data: null, message: "Ticket no encontrado" };
    }
    await pool.query("DELETE FROM tickets WHERE id = ?", [idTicket]);
    const [rows] = await pool.query("SELECT * FROM tickets");
    return { status: 200, data: rows, message: "Ticket eliminado exitosamente" };
  }
}

const ticketsController = new TicketsController();
export default ticketsController;

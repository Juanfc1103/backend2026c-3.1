import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  async register(data) {
    if (!data || !data.nombre || !data.email || !data.password || !data.rol) {
      return { status: 400, data: null, message: "Faltan datos indispensables" };
    }

    const [existing] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [data.email]);
    if (existing.length > 0) {
      return { status: 400, data: null, message: "El correo ya está registrado" };
    }

    const id = uuidv4();
    const hash = await bcrypt.hash(data.password, 10);

    await pool.query(
      "INSERT INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
      [id, data.nombre, data.email, hash, data.rol]
    );

    return {
      status: 201,
      data: { id, nombre: data.nombre, email: data.email, rol: data.rol },
      message: "Usuario registrado exitosamente",
    };
  }
}

const authController = new AuthController();
export default authController;

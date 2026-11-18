import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

class UsuariosController {
  async mostrarUsuarios() {
    const [rows] = await pool.query("SELECT id, nombre, email, rol FROM usuarios");
    if (rows.length === 0) {
      return { status: 200, data: null, message: "No hay usuarios registrados" };
    }
    return { status: 200, data: rows, message: "Usuarios listados exitosamente" };
  }

  async buscarPorId(idUsu) {
    const [rows] = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE id = ?", [idUsu]);
    if (rows.length === 0) {
      return { status: 404, data: null, message: "Usuario no encontrado" };
    }
    return { status: 200, data: rows[0], message: "Usuario encontrado exitosamente" };
  }

  async crear(newUser) {
    if (!newUser || !newUser.nombre || !newUser.email || !newUser.password || !newUser.rol) {
      return { status: 400, data: null, message: "Faltan datos indispensables del usuario" };
    }
    const rolesPermitidos = ["admin", "empleado", "cliente"];
    if (!rolesPermitidos.includes(newUser.rol)) {
      return { status: 400, data: null, message: "Rol inválido. Roles permitidos: admin, empleado, cliente" };
    }

    const [existing] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [newUser.email]);
    if (existing.length > 0) {
      return { status: 400, data: null, message: "El correo ya está registrado" };
    }

    const id = uuidv4();
    const hash = await bcrypt.hash(newUser.password, 10);

    await pool.query(
      "INSERT INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
      [id, newUser.nombre, newUser.email, hash, newUser.rol]
    );

    return {
      status: 201,
      data: { id, nombre: newUser.nombre, email: newUser.email, rol: newUser.rol },
      message: "Usuario creado exitosamente",
    };
  }

  async actualizar(newUser, idUsu) {
    const [existing] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [idUsu]);
    if (existing.length === 0) {
      return { status: 404, data: null, message: "Usuario no encontrado" };
    }

    const current = existing[0];
    const nombre = newUser.nombre ? newUser.nombre : current.nombre;
    const email = newUser.email ? newUser.email : current.email;
    const rol = newUser.rol ? newUser.rol : current.rol;
    let password = current.password;
    if (newUser.password) {
      password = await bcrypt.hash(newUser.password, 10);
    }

    await pool.query(
      "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?",
      [nombre, email, password, rol, idUsu]
    );

    return {
      status: 200,
      data: { id: idUsu, nombre, email, rol },
      message: "Usuario actualizado exitosamente",
    };
  }

  async eliminar(idUsu) {
    const [existing] = await pool.query("SELECT id FROM usuarios WHERE id = ?", [idUsu]);
    if (existing.length === 0) {
      return { status: 404, data: null, message: "Usuario no encontrado" };
    }

    await pool.query("DELETE FROM usuarios WHERE id = ?", [idUsu]);
    const [rows] = await pool.query("SELECT id, nombre, email, rol FROM usuarios");

    return { status: 200, data: rows, message: "Usuario eliminado exitosamente" };
  }
}

const usuariosController = new UsuariosController();
export default usuariosController;

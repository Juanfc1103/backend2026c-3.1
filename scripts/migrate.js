import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error("Faltan variables de entorno de base de datos. Revise su .env");
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD || "",
});

await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
await conn.query(`USE \`${DB_NAME}\``);

const sqlPath = path.join(__dirname, "..", "database", "cine_db.sql");
const sql = readFileSync(sqlPath, "utf8");
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

for (const stmt of statements) {
  try {
    await conn.query(stmt);
  } catch (err) {
    if (!/already exists|Duplicate/i.test(err.message)) {
      console.warn("Aviso ejecutando SQL:", err.message);
    }
  }
}

const adminEmail = "admin@cine.com";
const [existing] = await conn.query("SELECT id FROM usuarios WHERE email = ?", [adminEmail]);
if (existing.length === 0) {
  const id = uuidv4();
  const hash = await bcrypt.hash("admin123", 10);
  await conn.query(
    "INSERT INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
    [id, "Administrador", adminEmail, hash, "admin"]
  );
  console.log("Usuario admin creado: admin@cine.com / admin123");
} else {
  console.log("Usuario admin ya existe, se omite seed.");
}

await conn.end();
console.log("Migración completada exitosamente.");

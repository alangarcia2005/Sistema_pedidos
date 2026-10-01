import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    /* Validaciones */
    if (!correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    /* Buscar usuario */
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE Correo = ?",
      [correo],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado",
      });
    }

    const usuario = rows[0];

    /* Verificar contraseña */
    const passwordValido = await bcrypt.compare(
      password.toString(),
      usuario.Password,
    );

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      });
    }

    /* Generar token */
    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.Correo,
        Rol: usuario.Rol || "empleado",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    /* Respuesta */
    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.Correo,
        Rol: usuario.Rol || "empleado",
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    /* Validaciones */
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    /* Verificar usuario existente */
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE Correo = ?",
      [correo],
    );

    if (rows.length > 0) {
      return res.status(400).json({
        mensaje: "El usuario ya existe",
      });
    }

    /* Encriptar contraseña */
    const hash = await bcrypt.hash(password.toString(), 10);

    /* Guardar usuario */
    const [result] = await pool.query(
      `INSERT INTO usuario
      (Nombre, Correo, Password, Rol)
      VALUES (?, ?, ?, ?)`,
      [nombre, correo, hash, rol || "empleado"],
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: result.insertId,
        nombre,
        correo,
        Rol: rol || "empleado",
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message,
    });
  }
};
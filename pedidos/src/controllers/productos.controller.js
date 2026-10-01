import { pool } from "../db.js";

/* =========================
   OBTENER TODOS LOS PRODUCTOS
========================= */
export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener productos",
      error: error.message,
    });
  }
};

/* =========================
   OBTENER PRODUCTO POR ID
========================= */
export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener producto",
      error: error.message,
    });
  }
};

/* =========================
   CREAR PRODUCTO
========================= */
export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, disponible } = req.body;

    /* Validaciones */
    if (!nombre || !precio || !categoria) {
      return res.status(400).json({
        mensaje: "Faltan campos obligatorios",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO productos
            (nombre, descripcion, precio, categoria, disponible)
            VALUES (?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, categoria, disponible ?? true],
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion,
      precio,
      categoria,
      disponible,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear producto",
      error: error.message,
    });
  }
};

/* =========================
   ACTUALIZAR PRODUCTO
========================= */
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const { nombre, descripcion, precio, categoria, disponible } = req.body;

    const [result] = await pool.query(
      `UPDATE productos
            SET nombre = ?,
                descripcion = ?,
                precio = ?,
                categoria = ?,
                disponible = ?
            WHERE id = ?`,
      [nombre, descripcion, precio, categoria, disponible, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar producto",
      error: error.message,
    });
  }
};

/* =========================
   ELIMINAR PRODUCTO
========================= */
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar producto",
      error: error.message,
    });
  }
};

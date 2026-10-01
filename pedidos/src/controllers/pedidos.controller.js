import { pool } from "../db.js";

/* =========================
   OBTENER TODOS LOS PEDIDOS
========================= */
export const getPedidos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
            SELECT * FROM pedidos
            ORDER BY fecha DESC
        `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener pedidos",
      error: error.message,
    });
  }
};

/* =========================
   OBTENER PEDIDO POR ID
========================= */
export const getPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const [pedido] = await pool.query(`SELECT * FROM pedidos WHERE id = ?`, [
      id,
    ]);

    if (pedido.length === 0) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado",
      });
    }

    const [detalle] = await pool.query(
      `SELECT 
                dp.id,
                p.nombre,
                dp.cantidad,
                dp.subtotal
            FROM detalle_pedido dp
            INNER JOIN productos p
            ON dp.producto_id = p.id
            WHERE dp.pedido_id = ?`,
      [id],
    );

    res.json({
      pedido: pedido[0],
      detalle,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener pedido",
      error: error.message,
    });
  }
};

/* =========================
   CREAR PEDIDO
========================= */
export const createPedido = async (req, res) => {
  try {
    const { cliente, productos } = req.body;

    if (!cliente || !productos || productos.length === 0) {
      return res.status(400).json({
        mensaje: "Datos incompletos",
      });
    }

    let total = 0;

    /* Calcular total */
    for (const item of productos) {
      total += item.precio * item.cantidad;
    }

    /* Crear pedido */
    const [pedidoResult] = await pool.query(
      `INSERT INTO pedidos
            (cliente, total)
            VALUES (?, ?)`,
      [cliente, total],
    );

    const pedidoId = pedidoResult.insertId;

    /* Insertar detalle pedido */
    for (const item of productos) {
      const subtotal = item.precio * item.cantidad;

      await pool.query(
        `INSERT INTO detalle_pedido
                (pedido_id, producto_id, cantidad, subtotal)
                VALUES (?, ?, ?, ?)`,
        [pedidoId, item.producto_id, item.cantidad, subtotal],
      );
    }

    res.status(201).json({
      mensaje: "Pedido creado correctamente",
      pedidoId,
      total,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear pedido",
      error: error.message,
    });
  }
};

/* =========================
   ELIMINAR PEDIDO
========================= */
export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;

    /* Eliminar detalles */
    await pool.query(
      `DELETE FROM detalle_pedido
             WHERE pedido_id = ?`,
      [id],
    );

    /* Eliminar pedido */
    const [result] = await pool.query(
      `DELETE FROM pedidos
             WHERE id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Pedido no encontrado",
      });
    }

    res.json({
      mensaje: "Pedido eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar pedido",
      error: error.message,
    });
  }
};

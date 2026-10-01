import { Router } from "express";

import {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos.controller.js";

import verificarToken from "../middlewares/auth.js";

const router = Router();

/* Públicas */
router.get("/", getProductos);
router.get("/:id", getProducto);

/* Protegidas */
router.post("/", verificarToken, createProducto);
router.put("/:id", verificarToken, updateProducto);
router.delete("/:id", verificarToken, deleteProducto);

export default router;

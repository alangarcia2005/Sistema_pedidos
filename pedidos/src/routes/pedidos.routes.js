import { Router } from "express";

import {
  getPedidos,
  getPedido,
  createPedido,
  deletePedido,
} from "../controllers/pedidos.controller.js";

import verificarToken from "../middlewares/auth.js";

const router = Router();

/* Rutas protegidas */

router.get("/", verificarToken, getPedidos);

router.get("/:id", verificarToken, getPedido);

router.post("/", verificarToken, createPedido);

router.delete("/:id", verificarToken, deletePedido);

export default router;

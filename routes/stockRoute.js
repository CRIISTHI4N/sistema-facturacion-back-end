import { Router } from "express";
import { userAuth } from "../middleware/userAuth.js";

const router = Router()

import {
    listarStockCompleto,
    listarStock,
    listadoCompra,
    ingresarStock,
    actualizarStock,
    eliminarStock
} from "../controllers/stockController.js";

router.get('/listar-stock-completo/:id/:token', userAuth, listarStockCompleto)
router.get('/listar-stock/:token', userAuth, listarStock)
router.get('/listado-compra/:token', userAuth, listadoCompra)
router.post('/ingresar/:token', userAuth, ingresarStock)
router.put('/actualizar/:id/:token', userAuth, actualizarStock)
router.delete('/eliminar/:id/:token', userAuth, eliminarStock)

export default router
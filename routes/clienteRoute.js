import { Router } from "express";
import { userAuth } from "../middleware/userAuth.js";

const router = Router()

import {
    listarClientes,
    listarCliente,
    descipcionCliente,
    ingresarCliente,
    actualizarCliente,
    actualizarNumeroComprasCliente
} from "../controllers/clienteController.js";

router.get('/listar-clientes/:token', userAuth, listarClientes)
router.get('/listar-cliente/:id/:token', userAuth, listarCliente)
router.get('/descripcion-cliente/:identificacion/:token', userAuth, descipcionCliente)
router.post('/ingresar/:token', userAuth, ingresarCliente)
router.put('/actualizar-cliente/:id/:token', userAuth, actualizarCliente)
router.put('/actualizar-compras-cliente/:id/:token', userAuth, actualizarNumeroComprasCliente)

export default router
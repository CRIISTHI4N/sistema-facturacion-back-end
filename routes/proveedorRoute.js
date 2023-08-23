import { Router } from "express";
import { userAuth } from "../middleware/userAuth.js";

const router = Router()

import {
    listarProveedores,
    listarProveedor,
    ingresarProveedor,
    actualizarProveedor,
    eliminarProveedor,
    listarNombreProveedor
} from "../controllers/proveedorController.js";

router.get('/listar-provedores/:token', userAuth, listarProveedores)
router.get('/listar-proveedor/:id/:token', userAuth, listarProveedor)
router.get('/listar-nombre-provedor/:token', userAuth, listarNombreProveedor)
router.post('/ingresar/:token', userAuth, ingresarProveedor)
router.put('/actualizar/:id/:token', userAuth, actualizarProveedor)
router.delete('/eliminar/:id/:token', userAuth, eliminarProveedor)

export default router
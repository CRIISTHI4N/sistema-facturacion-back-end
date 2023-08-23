import { Router } from "express";
import { userAuth } from "../middleware/userAuth.js";

import {
    listarCategorias,
    listarCategoria,
    ingresarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    listarNombreCategoria
} from "../controllers/categoriaController.js";

const router = Router()

router.get('/listar-categorias/:token', userAuth, listarCategorias)
router.get('/listar-categoria/:id/:token', userAuth, listarCategoria)
router.get('/listar-nombre-categoria/:token', userAuth, listarNombreCategoria)
router.post('/ingresar/:token', userAuth, ingresarCategoria)
router.put('/actualizar/:id/:token', userAuth, actualizarCategoria)
router.delete('/eliminar/:id/:token', userAuth, eliminarCategoria)

export default router
import { Router } from "express";
import { userAuth } from "../middleware/userAuth.js";

import {
    obtenerUsuario,
    ingresarUsuario,
    actualizarUsuario,
    verificarToken
} from "../controllers/usuarioController.js";

const router = Router()

router.post('/login', obtenerUsuario)
router.post('/ingresar/:token', userAuth, ingresarUsuario)
router.put('/actualizar/:id/:token', userAuth, actualizarUsuario)
router.post('/verificar-token', verificarToken)

export default router
import { Router } from "express";
import { userAuth } from "../middleware/userAuth.js";

const router = Router()

import {
    listarFactura,
    listarFacturas,
    ingresarFactura,
    actualizarFactura,
    eliminarFactura,
    crearCuerpoFactura,
    eliminarCuerpoFactura,
    comprobarStock,
    actualizarCuerpoFactura,
    listarCabeceraFacturas,
    listarCabeceraFactura,
    listarCabeceraPersonalizado,
    ingresarCabeceraFactura,
    actualizarCabeceraFactura,
    eliminarCabeceraFactura,
    devolverStock,
    listarVentas
} from "../controllers/facturaController.js";


// Cabecera factura (datos del local)
router.get('/listar-cabecera-facturas/:token', userAuth, listarCabeceraFacturas)
router.get('/listar-cabecera-factura/:id/:token', userAuth, listarCabeceraFactura)
router.get('/listar-cabecera-personalizado/:token', userAuth, listarCabeceraPersonalizado)
router.post('/ingresar-cabecera-factura/:token', userAuth, ingresarCabeceraFactura)
router.put('/actualizar-cabecera-factura/:id/:token', userAuth, actualizarCabeceraFactura)
router.delete('/eliminar-cabecera-factura/:id/:token', userAuth, eliminarCabeceraFactura)

// Cuerpo factura (productos a comprar)
router.post('/comprobar-stock/:id/:token', userAuth, comprobarStock)
router.post('/crear-cuerpo-factura/:token', userAuth, crearCuerpoFactura)
router.delete('/eliminar-cuerpo-factura/:id/:token', userAuth, eliminarCuerpoFactura)
router.put('/actualizar-cuerpo-factura/:token', userAuth, actualizarCuerpoFactura)
router.put('/devolver-stock/:id/:token', userAuth, devolverStock)

// Factura final
router.get('/listar-facturas/:token', userAuth, listarFacturas)
router.get('/listar-factura/:id/:token', userAuth, listarFactura)
router.post('/ingresar-factura/:token', userAuth, ingresarFactura)
router.put('/actualizar-factura/:id/:token', userAuth, actualizarFactura)
router.delete('/eliminar-factura/:id/:token', userAuth, eliminarFactura)

// Ventas
router.get('/ventas/:token', userAuth, listarVentas)

export default router
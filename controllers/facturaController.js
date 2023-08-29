import { Factura } from "../models/Factura.js";
import { CabeceraFactura } from "../models/CabeceraFactura.js";
import { CuerpoFactura } from "../models/CuerpoFactura.js";
import { Stock } from "../models/Stock.js";

import { v4 as uuidv4 } from 'uuid';
import Decimal from 'decimal.js';

// Factura final
export const listarFacturas = async (req, res) => {
    const factura = await Factura.find({}).sort({ fechaCreacion: -1 })
    return res.status(200).json(factura)
}

export const listarVentas = async (req, res) => {
    const now = new Date();

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const totalVentasDia = await calcularTotalVentas(startOfDay, endOfDay);
    const totalVentasMes = await calcularTotalVentas(startOfMonth, endOfMonth);
    const totalVentasMesPasado = await calcularTotalVentas(lastMonthStart, lastMonthEnd);

    return res.status(200).json({ totalVentasDia, totalVentasMes, totalVentasMesPasado });
}

export const listarFactura = async (req, res) => {

    const { id } = req.params

    const factura = await Factura.findById(id)
        .select('cabecera numeroFactura cliente cuerpo subtotal descuento iva total createdAt')
        .populate('cabecera', 'ruc nombreLocal sucursal direccion')
        .populate('cliente', '_id nombres apellidos identificacion direccion telefono correo')
        .populate({
            path: 'cuerpo',
            select: '_id descripcionProducto cantidadProducto precioProducto descuentoProducto subtotal',
            populate: {
                path: 'producto',
                select: '_id codigo precioUnitario'
            },
        })

    if (!factura) {
        const error = new Error('Error, no se pudo econtrar esta factura')
        return res.status(404).json({ msg: error.message })
    }

    return res.status(200).json(factura)
}

export const ingresarFactura = async (req, res) => {

    const { cabecera, cliente, cuerpo } = req.body

    // Extraemos el valor 'total' y 'cantidadProducto' del producto que se va a comprar
    const productos = await Promise.all(
        cuerpo.map(c => {
            return CuerpoFactura.findById(c._id)
                .select('cantidadProducto subtotal total')
                .populate({
                    path: 'producto', select: 'cantidad'
                })
        })
    );


    // Realizamos la suma total de todos los productos
    // Subtotal
    const subtotal = productos.reduce((acumulador, p) => acumulador.plus(new Decimal(Number(p.subtotal))), new Decimal(0));

    const descuento = productos.reduce((acumulador, p) => {
        if (Number(p.total) !== 0) {
            return acumulador.plus(new Decimal(Number(p.subtotal)).minus(new Decimal(Number(p.total))));
        }

        return acumulador;
    }, new Decimal(0));

    // Iva
    const iva = subtotal.times(0.12);

    // Total a pagar
    const total = subtotal.minus(descuento).plus(iva);

    try {
        const factura = new Factura();
        factura.cabecera = cabecera
        factura.numeroFactura = uuidv4()
        factura.cliente = cliente
        factura.cuerpo = cuerpo
        factura.subtotal = subtotal
        factura.descuento = descuento
        factura.iva = iva
        factura.total = total
        await factura.save()

        return res.status(200).json({ _id: factura._id })

    } catch (e) {
        const error = new Error('Error, no se pudo ingresar la factura, intente de nuevo')
        return res.status(404).json({ msg: error.message })
    }
}

export const actualizarFactura = async (req, res) => {

    const { cabecera, cliente, cuerpo } = req.body
    const { id } = req.params

    const factura = await Factura.findById(id)

    if (!factura) {
        const error = new Error('Error, no se encontro esta factura')
        return res.status(404).json({ msg: error.message })
    }

    // Extraemos el valor 'total' y 'cantidadProducto' del producto que se va a comprar
    const productos = await Promise.all(
        cuerpo.map(c => {
            return CuerpoFactura.findById(c._id)
                .select('cantidadProducto subtotal total')
                .populate({
                    path: 'producto', select: 'cantidad'
                })
        })
    )

    // Realizamos la suma total de todos los productos
    // Subtotal
    const subtotal = productos.reduce((acumulador, p) => acumulador.plus(new Decimal(Number(p.subtotal))), new Decimal(0));

    const descuento = productos.reduce((acumulador, p) => {
        if (Number(p.total) !== 0) {
            return acumulador.plus(new Decimal(Number(p.subtotal)).minus(new Decimal(Number(p.total))));
        }

        return acumulador;
    }, new Decimal(0));

    // Iva
    const iva = subtotal.times(0.12);

    // Total a pagar
    const total = subtotal.minus(descuento).plus(iva);

    try {

        factura.cabecera = cabecera || factura.cabecera
        factura.numeroFactura = factura.numeroFactura
        factura.cliente = cliente || factura.cliente
        factura.cuerpo = cuerpo || factura.cuerpo
        factura.subtotal = subtotal || factura.subtotal
        factura.descuento = descuento || factura.descuento
        factura.iva = iva || factura.iva
        factura.total = total || factura.total

        await factura.save()
        return res.status(200).json({ msg: 'Factura actualizada correctamente' })

    } catch (e) {
        const error = new Error('Error, no se pudo eliminar la factura')
        return res.status(404).json({ msg: error.message })
    }
}

export const eliminarFactura = async (req, res) => {

    const { id } = req.params

    const factura = await Factura.findById(id)
    const cuerpo = factura.cuerpo

    const productos = await Promise.all(
        cuerpo.map(c => {
            return CuerpoFactura.findById(c._id)
                .select('producto cantidadProducto')
                .populate({
                    path: 'producto', select: 'cantidad'
                })
        })
    )

    const productosFiltrados = productos.filter(p => p !== null);

    try {
        for (const p of productosFiltrados) {
            try {
                const stock = await Stock.findById(p.producto._id)
                stock.cantidad += p.cantidadProducto
                await stock.save()

            } catch (error) { console.log(error) }
        }

    } catch (e) {
        const error = new Error('Error, no se pudo devolver el stock')
        return res.status(404).json({ msg: error.message })
    }

    try {
        factura.deleteOne()
        return res.status(200).json({ msg: 'Factura eliminada correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró esta factura')
        return res.status(404).json({ msg: error.message })
    }
}


// Cabecera factura (datos del local)
export const listarCabeceraFactura = async (req, res) => {
    const { id } = req.params

    try {
        const cabeceraFactura = await CabeceraFactura.findById(id)
        return res.json(cabeceraFactura)

    } catch (e) {
        const error = new Error('Erro, no se econtró esta cabecera')
        return res.status(404).json({ msg: error.message })
    }
}

export const listarCabeceraFacturas = async (req, res) => {
    const cabeceraFactura = await CabeceraFactura.find({})
    return res.status(200).json(cabeceraFactura)
}

export const listarCabeceraPersonalizado = async (req, res) => {
    const cabeceraFactura = await CabeceraFactura.find({}).select('_id nombreLocal direccion')
    return res.status(200).json(cabeceraFactura)
}

export const ingresarCabeceraFactura = async (req, res) => {
    const cabeceraFactura = new CabeceraFactura(req.body)

    try {
        await cabeceraFactura.save()
        return res.status(200).json({ msg: "Cabecera ingresada correctamente" })

    } catch (e) {
        const error = new Error('Error, no se pudo ingresar la cabecera')
        return res.status(404).json({ msg: error.message })
    }
}

export const actualizarCabeceraFactura = async (req, res) => {

    const { id } = req.params

    try {
        const cabeceraFactura = await CabeceraFactura.findById(id)

        cabeceraFactura.ruc = req.body.ruc || cabeceraFactura.ruc
        cabeceraFactura.nombreLocal = req.body.nombreLocal || cabeceraFactura.nombreLocal
        cabeceraFactura.sucursal = req.body.sucursal || cabeceraFactura.sucursal
        cabeceraFactura.direccion = req.body.direccion || cabeceraFactura.direccion

        cabeceraFactura.save()
        return res.status(200).json({ msg: 'Cabecera actualizada correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró esta cabecera')
        return res.status(404).json({ msg: error.message })
    }
}

export const eliminarCabeceraFactura = async (req, res) => {

    const { id } = req.params

    try {
        const cabeceraFactura = await CabeceraFactura.findById(id)
        cabeceraFactura.deleteOne()
        return res.status(200).json({ msg: 'Cabecera eliminada correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró esta cabecera')
        return res.status(404).json({ msg: error.message })
    }
}



// Cuerpo factura (productos a comprar)
export const comprobarStock = async (req, res) => {
    const { id } = req.params

    const productoStock = await Stock.findById(id)

    if (!productoStock) {
        const error = new Error('Producto no encontrado')
        return res.status(404).json({ msg: error.message })
    }

    // Esta validacion va al momento de darle 'agregar' en la ventana modal de Next, esta ventana modal contiene todo el stock de la tienda
    if (productoStock.cantidad === 0) {
        const error = new Error('Sin unidades')
        return res.status(200).json({ msg: error.message })
    }

    return res.status(200).json(productoStock)

}

export const crearCuerpoFactura = async (req, res) => {

    const { idStock, cantidadProducto, descuentoProducto } = req.body
    const productoStock = await Stock.findById(idStock)

    if (parseInt(cantidadProducto) > parseInt(productoStock.cantidad)) {
        const error = new Error('La cantidad supera el stock')
        return res.json({ msg: error.message })
    }

    if (parseInt(cantidadProducto) < 1) {
        return res.json({ msg: 'Cantidad invalida' })
    }

    // Actualizar el STOCK
    try {
        productoStock.cantidad -= parseInt(cantidadProducto);
        await productoStock.save()

    } catch (e) {
        const error = new Error('Error al descontar del Stock')
        return res.json({ msg: error.message })
    }

    const decimalCantidad = new Decimal(cantidadProducto);
    const decimalPrecioUnitario = new Decimal(Number(productoStock.precioUnitario));
    const decimalDescuento = new Decimal(descuentoProducto);

    const subtotal = decimalCantidad.times(decimalPrecioUnitario);

    let totalPrendaDecimal = new Decimal(0);
    if (!decimalDescuento.isZero()) {
        totalPrendaDecimal = subtotal.minus(subtotal.times(decimalDescuento).dividedBy(100));
    }

    try {
        const cuerpoFactura = new CuerpoFactura()
        cuerpoFactura.producto = req.body.idStock
        cuerpoFactura.descripcionProducto = req.body.descripcionProducto
        cuerpoFactura.cantidadProducto = req.body.cantidadProducto
        cuerpoFactura.precioProducto = productoStock.precioUnitario
        cuerpoFactura.descuentoProducto = descuentoProducto
        cuerpoFactura.subtotal = subtotal
        cuerpoFactura.total = totalPrendaDecimal
        cuerpoFactura.save()

        return res.status(200).json(cuerpoFactura)

    } catch (e) {
        const error = new Error('Error al crear cuerpo')
        return res.json({ msg: error.message })
    }

}

export const actualizarCuerpoFactura = async (req, res) => {
    const {
        idStock,
        idCuerpoFactura,
        cantidadProducto,
        descuentoProducto,
        cantidadProductoTemp
    } = req.body

    const cuerpoFactura = await CuerpoFactura.findById(idCuerpoFactura)
    const productoStock = await Stock.findById(idStock)


    // Actualizar el STOCK (+)
    try {
        productoStock.cantidad += parseInt(cantidadProductoTemp);
        await productoStock.save()
    } catch (e) {
        const error = new Error('al controlar el Stock')
        return res.json({ msg: error.message })
    }


    if (parseInt(cantidadProducto) > parseInt(productoStock.cantidad)) {
        const error = new Error('La cantidad supera el stock')
        return res.json({ msg: error.message })
    }

    if (parseInt(cantidadProducto) < 1) {
        return res.json({ msg: 'Cantidad invalida' })
    }


    // Actualizar el STOCK (-)
    try {
        productoStock.cantidad -= parseInt(cantidadProducto);
        await productoStock.save()

    } catch (e) {
        const error = new Error('Error al controlar el Stock')
        return res.json({ msg: error.message })
    }

    // importar alguna libreria que trabaje con la presicion de decimales
    // hacer la operacion de incremento y decremento de contidad en el stock

    const decimalCantidad = new Decimal(cantidadProducto);
    const decimalPrecioUnitario = new Decimal(Number(productoStock.precioUnitario));
    const decimalDescuento = new Decimal(descuentoProducto);

    const subtotal = decimalCantidad.times(decimalPrecioUnitario);

    let totalPrendaDecimal = new Decimal(0);
    if (!decimalDescuento.isZero()) {
        totalPrendaDecimal = subtotal.minus(subtotal.times(decimalDescuento).dividedBy(100));
    }

    try {
        cuerpoFactura.producto = req.body.idStock || cuerpoFactura.producto
        cuerpoFactura.descripcionProducto = req.body.descripcionProducto || cuerpoFactura.descripcionProducto
        cuerpoFactura.cantidadProducto = req.body.cantidadProducto || cuerpoFactura.cantidadProducto
        cuerpoFactura.precioProducto = productoStock.precioUnitario || cuerpoFactura.precioProducto
        cuerpoFactura.descuentoProducto = descuentoProducto || cuerpoFactura.descuentoProducto
        cuerpoFactura.subtotal = isNaN(subtotal) ? cuerpoFactura.subtotal : subtotal
        cuerpoFactura.total = totalPrendaDecimal || cuerpoFactura.total

        cuerpoFactura.save()
        return res.status(200).json(cuerpoFactura)

    } catch (e) {
        const error = new Error('Error al actualizar cuerpo')
        return res.json({ msg: error.message })
    }

}

export const eliminarCuerpoFactura = async (req, res) => {

    const { id } = req.params

    try {
        const cuerpoFactura = await CuerpoFactura.findById(id)
        cuerpoFactura.deleteOne()
        return res.status(204).json()

    } catch (e) {
        const error = new Error('Error, no se encontró este cuerpo')
        return res.status(404).json({ msg: error.message })
    }
}

export const devolverStock = async (req, res) => {
    const { id } = req.params
    const { cantidad } = req.body

    const productoStock = await Stock.findById(id)

    try {
        productoStock.cantidad += parseInt(cantidad)
        await productoStock.save()
        return res.status(200).json({ cantidad: productoStock.cantidad })

    } catch (e) {
        const error = new Error('Error, no se puedo devolver las cantidades al Stock')
        return res.status(404).json({ msg: error.message })
    }
}

// OTRAS FUNCIONES
const calcularTotalVentas = async (startDate, endDate) => {
    const facturas = await Factura.find({
        createdAt: { $gte: startDate, $lte: endDate }
    }).select('total');

    return facturas.reduce((total, factura) => total + Number(factura.total), 0);
};

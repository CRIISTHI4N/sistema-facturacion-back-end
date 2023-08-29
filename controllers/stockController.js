import { Stock } from "../models/Stock.js";

export const listarStockCompleto = async (req, res) => {
    const { id } = req.params

    try {
        const stock = await Stock.findById(id).populate('proveedor', '_id nombre').populate('categoria', '_id nombre').select('-updatedAt -__v')
        return res.json(stock)

    } catch (e) {
        const error = new Error('Error, no se econtró este stock')
        return res.status(404).json({ msg: error.message })
    }
}

export const listarStock = async (req, res) => {
    const stock = await Stock.find({}).populate('proveedor', 'nombre').populate('categoria', 'nombre').select('-updatedAt -__v')

    return res.status(200).json(stock)
}

export const listadoCompra = async (req, res) => {
    const stock = await Stock.find({ estado: true }).select('_id nombre cantidad precioUnitario codigo')

    return res.status(200).json(stock)
}

export const ingresarStock = async (req, res) => {
    try {
        const stock = new Stock(req.body)

        stock.proveedor = req.body.proveedor || null
        stock.categoria = req.body.categoria || null
        await stock.save()
        return res.status(200).json({ msg: "Stock ingresado correctamente" })

    } catch (e) {
        const error = new Error('Error, no se pudo ingresar el stock')
        return res.status(404).json({ msg: error.message })
    }
}

export const actualizarStock = async (req, res) => {
    const { id } = req.params

    try {
        const stock = await Stock.findById(id)

        stock.nombre = req.body.nombre || stock.nombre
        stock.cantidad = req.body.cantidad || stock.cantidad
        stock.precioUnitario = req.body.precioUnitario || stock.precioUnitario
        stock.codigo = req.body.codigo || stock.codigo
        stock.descuento = req.body.descuento || stock.descuento
        stock.proveedor = req.body.proveedor !== undefined ? req.body.proveedor : null;
        stock.categoria = req.body.categoria !== undefined ? req.body.categoria : null;
        stock.descripcion = req.body.descripcion || stock.descripcion
        stock.estado = req.body.estado || stock.estado

        stock.save()
        return res.status(200).json({ msg: 'Stock actualizado correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró este stock')
        return res.status(404).json({ msg: error.message })
    }
}

export const eliminarStock = async (req, res) => {
    const { id } = req.params

    try {
        const stock = await Stock.findById(id)
        stock.deleteOne()
        return res.status(200).json({ msg: 'Stock eliminado correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró este stock')
        return res.status(404).json({ msg: error.message })
    }
}
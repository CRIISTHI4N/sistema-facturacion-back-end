import { Proveedor } from "../models/Proveedor.js";

export const listarProveedor = async (req, res) => {
    const { id } = req.params

    try {
        const proveedor = await Proveedor.findById(id)
        return res.json(proveedor)

    } catch (e) {
        const error = new Error('Erro, no se econtró este proveedor')
        return res.status(404).json({ msg: error.message })
    }
}

export const listarProveedores = async (req, res) => {
    const proveedor = await Proveedor.find({}).select('_id nombre telefono descripcion estado')
    return res.status(200).json(proveedor)
}

export const listarNombreProveedor = async (req, res) => {
    const proveedor = await Proveedor.find({}).select('_id nombre telefono')
    return res.status(200).json(proveedor)
}

export const ingresarProveedor = async (req, res) => {
    try {
        const proveedor = new Proveedor(req.body)
        await proveedor.save()
        return res.status(200).json({ msg: "Proveedor ingresado correctamente" })

    } catch (e) {
        const error = new Error('Error, no se pudo ingresar el proveedor')
        return res.status(404).json({ msg: error.message })
    }
}

export const actualizarProveedor = async (req, res) => {
    const { id } = req.params

    try {
        const proveedor = await Proveedor.findById(id)

        proveedor.nombre = req.body.nombre || proveedor.nombre
        proveedor.identificacion = req.body.identificacion || proveedor.identificacion
        proveedor.contacto = req.body.contacto || proveedor.contacto
        proveedor.telefono = req.body.telefono || proveedor.telefono
        proveedor.correo = req.body.correo || proveedor.correo
        proveedor.direccion = req.body.direccion || proveedor.direccion
        proveedor.descripcion = req.body.descripcion || proveedor.descripcion
        proveedor.estado = req.body.estado || proveedor.estado

        proveedor.save()
        return res.status(200).json({ msg: 'Proveedor actualizado correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró este proveedor')
        return res.status(404).json({ msg: error.message })
    }
}

export const eliminarProveedor = async (req, res) => {
    const { id } = req.params

    try {
        const proveedor = await Proveedor.findById(id)
        proveedor.deleteOne()
        return res.status(200).json({ msg: 'Proveedor eliminado correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró este proveedor')
        return res.status(404).json({ msg: error.message })
    }
}
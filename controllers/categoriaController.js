import { Categoria } from "../models/Categoria.js"

export const listarCategoria = async (req, res) => {

    const { id } = req.params

    try {
        const categoria = await Categoria.findById(id)
        return res.json(categoria)

    } catch (e) {
        const error = new Error('Erro, no se econtró esta cateogoría')
        return res.status(404).json({ msg: error.message })
    }
}

export const listarCategorias = async (req, res) => {
    const categorias = await Categoria.find({})
    return res.status(200).json(categorias)
}

export const listarNombreCategoria = async (req, res) => {
    const categoria = await Categoria.find({}).select('_id nombre')
    return res.status(200).json(categoria)
}

export const ingresarCategoria = async (req, res) => {

    const categoria = new Categoria(req.body)

    try {
        await categoria.save()
        return res.status(200).json({ msg: "Categoría ingresada correctamente" })

    } catch (e) {
        const error = new Error('Error, no se pudo ingresar la categoría')
        return res.status(404).json({ msg: error.message })
    }
}

export const actualizarCategoria = async (req, res) => {

    const { id } = req.params

    try {
        const categoria = await Categoria.findById(id)

        categoria.nombre = req.body.nombre || categoria.nombre
        categoria.descripcion = req.body.descripcion || categoria.descripcion
        categoria.estado = req.body.estado || categoria.estado

        categoria.save()
        return res.status(200).json({ msg: 'Categoría actualizada correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró esta categoría')
        return res.status(404).json({ msg: error.message })
    }
}

export const eliminarCategoria = async (req, res) => {

    const { id } = req.params

    try {
        const categoria = await Categoria.findById(id)
        categoria.deleteOne()
        return res.status(200).json({ msg: 'Categoría eliminada correctamente' })

    } catch (e) {
        const error = new Error('Error, no se encontró esta categoría')
        return res.status(404).json({ msg: error.message })
    }
}
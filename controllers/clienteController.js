import { Cliente } from "../models/Cliente.js";

export const listarCliente = async (req, res) => {
    const { id } = req.params

    try {
        const cliente = await Cliente.findById(id)
        return res.json(cliente)

    } catch (e) {
        const error = new Error('Erro, no se econtró este cliente')
        return res.status(404).json({ msg: error.message })
    }
}

export const descipcionCliente = async (req, res) => {
    const { identificacion } = req.params

    try {
        const cliente = await Cliente.findOne({ identificacion })

        if (!cliente) {
            const error = new Error('Sin descripcion')
            return res.status(404).json({ msg: error.message })
        }

        return res.json({ descripcion: cliente.descripcion })

    } catch (e) {
        const error = new Error('Error, no se encontro este cliente')
        return res.status(404).json({ msg: error.message })
    }
}

export const listarClientes = async (req, res) => {
    const cliente = await Cliente.find({}).select('_id nombres apellidos identificacion numeroCompras')
    return res.status(200).json(cliente)
}

export const ingresarCliente = async (req, res) => {

    const { identificacion } = req.body;

    try {
        const clienteExistente = await Cliente.findOne({ identificacion });

        if (clienteExistente) {

            clienteExistente.nombres = req.body.nombres
            clienteExistente.apellidos = req.body.apellidos
            clienteExistente.direccion = req.body.direccion
            clienteExistente.telefono = req.body.telefono
            clienteExistente.correo = req.body.correo
            clienteExistente.descripcion = req.body.descripcion
            clienteExistente.numeroCompras++

            await clienteExistente.save();
            return res.status(200).json({ cliente: clienteExistente._id });

        } else {
            const nuevoCliente = new Cliente(req.body);
            await nuevoCliente.save();
            return res.status(200).json({ cliente: nuevoCliente._id, identificacion: nuevoCliente.identificacion });
        }

    } catch (e) {
        const error = new Error('Error, no se pudo ingresar el cliente')
        return res.status(404).json({ msg: error.message })
    }
}


import { Usuario } from "../models/Usuario.js"

export const obtenerUsuario = async (req, res) => {

    const { user, pass } = req.body

    const verificarUser = await Usuario.findOne({ user })

    if (!verificarUser) {
        const error = new Error("Usuario incorrecto")
        return res.status(404).json({ msg: error.message })
    }

    try {

        if (await verificarUser.comprobarPassword(pass)) {

            req.usuario = {
                _id: verificarUser._id,
                name: verificarUser.name,
                token: process.env.KEY_USER,
                user: verificarUser.user
            }

            return res.json({
                _id: verificarUser._id,
                name: verificarUser.name,
                token: process.env.KEY_USER,
                user: verificarUser.user
            })

        } else {
            const error = new Error("Contraseña Incorrecta");
            return res.status(403).json({ msg: error.message })
        }

    } catch (e) {
        const error = new Error("Ups, Ocurrio un error!")
        return res.status(404).json({ msg: error.message })
    }
}

export const verificarToken = async (req, res) => {

    const { token } = req.body

    if (token !== process.env.KEY_USER || token === '') {
        return res.status(401).json({ msg: "Error, no tienes acceso al sistema" })
    }

    try {

        return res.status(204).json()

    } catch (e) {
        const error = new Error("Ups, Ocurrio un error!")
        return res.status(401).json({ msg: error.message })
    }
}

export const ingresarUsuario = async (req, res) => {

    const usuario = new Usuario(req.body)

    try {
        await usuario.save();
        return res.status(200).json({ msg: "Usuario creado correctamente" })

    } catch (e) {
        const error = new Error('Ups, Ocurrio un error!')
        return res.status(404).json({ msg: error.message })
    }

}

export const actualizarUsuario = async (req, res) => {
    const { id } = req.params

    try {
        const usuario = await Usuario.findById(id)

        usuario.name = req.body.name || usuario.name
        usuario.user = req.body.user || usuario.user
        usuario.pass = req.body.pass || usuario.pass

        await usuario.save()
        return res.status(200).json({ msg: "Usuario actualizado correctamente" })

    } catch (e) {
        const error = new Error('Error, No se encontro este usuario')
        return res.status(404).json({ msg: error.message })
    }
}




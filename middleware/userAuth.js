
export const userAuth = async (req, res, next) => {

    const { token } = req.params

    if (token !== process.env.KEY_USER) {
        return res.status(401).json({ msg: "Ups, Parece que estas intentado entrar el sistema sin permiso!" })
    }

    next()
}

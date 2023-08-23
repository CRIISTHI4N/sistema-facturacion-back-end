import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UsuarioSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    user: {
        type: String,
        trim: true,
    },
    pass: {
        type: String,
        trim: true,
    }
}, { timestamps: true })

UsuarioSchema.pre('save', async function (next) {

    // Si no está modificado el password, que no haga nada
    if (!this.isModified('pass')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.pass = await bcrypt.hash(this.pass, salt);
});

UsuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.pass)
}

export const Usuario = mongoose.model('Usuario', UsuarioSchema)
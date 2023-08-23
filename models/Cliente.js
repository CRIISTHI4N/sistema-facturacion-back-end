import mongoose from "mongoose";

const ClienteSchema = mongoose.Schema({
    nombres: {
        type: String,
        trim: true,
        required: true
    },
    apellidos: {
        type: String,
        trim: true,
        required: true
    },
    identificacion: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    direccion: {
        type: String,
        trim: true,
    },
    telefono: {
        type: String,
        trim: true,
    },
    correo: {
        type: String,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    numeroCompras: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

export const Cliente = mongoose.model('Cliente', ClienteSchema)
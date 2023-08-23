import mongoose from "mongoose";

const ProveedorSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    identificacion: {
        type: String,
        trim: true,
    },
    contacto: {
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
    direccion: {
        type: String,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    estado: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

export const Proveedor = mongoose.model('Proveedor', ProveedorSchema)
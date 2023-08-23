import mongoose from "mongoose"

const CategoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
    },
    estado: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export const Categoria = mongoose.model('Categoria', CategoriaSchema)
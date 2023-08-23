import mongoose from "mongoose"

const StockSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precioUnitario: {
        type: mongoose.Decimal128,
        required: true
    },
    codigo: {
        type: String,
        trim: true,
        required: true
    },
    proveedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: false
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: false
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

export const Stock = mongoose.model('Stock', StockSchema)
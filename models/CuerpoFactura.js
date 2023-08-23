import mongoose from "mongoose";

const CuerpoFacturaSchema = mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock'
    },
    descripcionProducto: {
        type: String,
        trim: true,
    },
    cantidadProducto: {
        type: Number,
        required: true
    },
    precioProducto: {
        type: mongoose.Decimal128,
        required: true
    },
    descuentoProducto: {
        type: Number
    },
    subtotal: {
        type: mongoose.Decimal128,
    },
    total: {
        type: mongoose.Decimal128,
    },
}, { timestamps: true })

export const CuerpoFactura = mongoose.model('CuerpoFactura', CuerpoFacturaSchema)
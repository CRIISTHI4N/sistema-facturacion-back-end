import mongoose from "mongoose";

const CabeceraFacturaSchema = mongoose.Schema({
    ruc: {
        type: String,
        trim: true,
        required: true
    },
    nombreLocal: {
        type: String,
        trim: true,
        required: true
    },
    sucursal: {
        type: String,
        trim: true,
    },
    direccion: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true })

export const CabeceraFactura = mongoose.model('CabeceraFactura', CabeceraFacturaSchema)
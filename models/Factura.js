import mongoose from "mongoose";
import moment from 'moment-timezone';

const FacturaSchema = mongoose.Schema({
    cabecera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CabeceraFactura',
        required: true
    },
    numeroFactura: {
        type: String
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    cuerpo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CuerpoFactura',
        }
    ],
    subtotal: {
        type: mongoose.Decimal128
    },
    descuento: {
        type: mongoose.Decimal128
    },
    iva: {
        type: mongoose.Decimal128
    },
    total: {
        type: mongoose.Decimal128
    },
    createdAt: {
        type: Date,
        default: moment().tz('America/Guayaquil').toDate()
    },
    updatedAt: {
        type: Date,
        default: moment().tz('America/Guayaquil').toDate()
    }
}, { timestamps: true })

export const Factura = mongoose.model('Factura', FacturaSchema)
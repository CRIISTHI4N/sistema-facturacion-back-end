// Librerias de Node
import express from "express"
import dotenv from "dotenv"
import cors from 'cors'

// Conección a la BBDD
import { coneccionDB } from "./config/db.js";

// Importación de rutas
import categoriaRoute from "./routes/categoriaRoute.js"
import stockRoute from "./routes/stockRoute.js"
import proveedorRoute from "./routes/proveedorRoute.js"
import clienteRoute from "./routes/clienteRoute.js"
import facturaRoute from "./routes/facturaRoute.js"
import usuarioRoute from "./routes/usuarioRoute.js"



const app = express()
// Configuración para utilizar variables de entorno
dotenv.config()
app.use(express.json())

coneccionDB()


// Cors
// =================================================
const whiteList = [process.env.URL_FRONT]
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Error de cors"))
        }
    }
}
app.use(cors(corsOptions))
// =================================================

// Rutas

app.get('/', (req, res) => {
    console.log('EN SERVICIO...');
    res.send('EN SERVICIO...')
})


app.use('/api/usuario', usuarioRoute)
app.use('/api/categoria', categoriaRoute)
app.use('/api/stock', stockRoute)
app.use('/api/proveedor', proveedorRoute)
app.use('/api/cliente', clienteRoute)
app.use('/api/factura', facturaRoute)



const PORT = process.env.PORT || 4000
// Lanzamiento del servidor
app.listen(PORT, () => {
    console.log('CONECTANDO...');
})

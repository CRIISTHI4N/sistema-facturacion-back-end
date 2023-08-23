import mongoose from "mongoose";

export const coneccionDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.URL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const url = `${connection.connection.host}: ${connection.connection.port}`
        console.log(`Conexión establecida`);
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}
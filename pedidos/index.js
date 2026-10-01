import app from "./src/app.js";
import dotenv from 'dotenv';

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});
import express from 'express';
import dotenv from 'dotenv';
import  cors  from "cors";
import conectarDB from './config/db.js';
import routerUsuarios from './routes/usuario.routes.js';
import routerProyectos from './routes/proyecto.routes.js';
import routerTareas from './routes/tarea.routes.js';


const app = express();
app.use(express.json())

dotenv.config();

conectarDB();

//Configurar CORS
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callBack) {
        if (whiteList.includes(origin)) {
            //Puede consultar la api
            callBack(null, true)
        } else {
            //No esta autorizado
            callBack(new Error('Error de Cors'))
        }
    }
}
app.use(cors(corsOptions))

//Routing
app.use('/api/usuarios', routerUsuarios);
app.use('/api/proyectos', routerProyectos);
app.use('/api/tareas', routerTareas);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ PORT }`)
})
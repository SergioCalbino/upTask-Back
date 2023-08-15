import express from 'express';
import { autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, pefil, registrar } from '../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

//Area publica de las rutas
router.post('/', registrar);
router.post('/login', autenticar);
//Confirmar es la ruta para el que se registra
router.get('/confirmar/:token', confirmar);

//estas 3 rutas es para el que se olvida el password
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

//Area privada
router.get('/perfil', checkAuth, pefil)

export default router
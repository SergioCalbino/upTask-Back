import  jwt  from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

//Este middleware verifia que el usuario tenga token valido para acceder a su perfil
const checkAuth = async (req, res, next) => {
    let token;
    //El bearer es alog que tiene postman. Por eso luego lo corto con el split
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            //Agrego a la variable de req, el req.usuario para hacerlo disponible
            req.usuario = await Usuario.findById( decoded.id ).select('-password -confirmado -token -createdAt -updatedAt -__v');
            return next()
        } catch (error) {
           return res.status(404).json({ msg: 'Hubo un error' })
        }
   }

   if (!token) {
    const error = new Error('Token no valido');
    return res.status(401).json({ msg: error.message })
    
   }
    next()
};

export default checkAuth;
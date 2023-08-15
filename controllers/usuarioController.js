import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js";


const registrar = async (req, res) => {
    //Evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

   try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save();
        //Enviar el email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        
        return res.json({
            msg: 'Usuario creado correctamente, revisa tu email para confirmar tu cuena', 
            usuarioAlmacenado
        })
   } catch (error) {
    console.log(error.response)
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;
    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    
    if (!usuario) {
        const error = new Error('Usuario no existe')
        return res.status(404).json({ msg: error.message })
    };
    //Comprobar si el usuaruio esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(404).json({ msg: error.message })
    };

    //Comprobar password para loguearse
    //Comporbar password es la funcion que tengo en el modelo de Usuario
    const correctPassword = await usuario.comprobarPassword(password)
    if (correctPassword) {
        return res.status(200).json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error('Password o Usuario incorrecto')
        return res.status(403).json({ msg: error.message })
    }
};

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token });
    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        return res.status(403).json({ msg: error.message });
        
    }
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = '';
        await usuarioConfirmar.save();
        return res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {
        console.log(error)
        
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
        const error = new Error('Usuario no existe')
        return res.status(404).json({ msg: error.message })
    };

    try {
        usuario.token = generarId();
        await usuario.save()

        //Enviar email para recuperra contraseña
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        return res.json({ msg: 'Hemos enviado un email con las instrucciones' })
    } catch (error) {
        console.log(error);
        
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token });
    if (tokenValido) {
        return res.json({ msg: 'Token valido y el usuario existe' })
    }else {
        const error = new Error('Token no valido')
        return res.status(404).json({ msg: error.message })

    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body
    
    const usuario = await Usuario.findOne({ token });
    if (usuario) {
        usuario.password = password;
        usuario.token = '';
        try {
            await usuario.save()
            return res.json({ msg: 'Password modificado correctamente' })
        } catch (error) {
            console.log(error);
        }
    }else {
        const error = new Error('Token no valido')
        return res.status(404).json({ msg: error.message })

    }
};

const pefil = async (req, res) => {
    //el req.usuario lo genere con el middleware de checkauth
    const { usuario } = req;
    return res.status(200).json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    pefil
}
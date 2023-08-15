import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    }
);

//Con esto hasheo el password. El modified es para evitar hacer un doble hasheo
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});

//Comprobamos el password para el logueo
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    //el this.password es de la instancia de usuario que se desea loguear(esta en la db)
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario
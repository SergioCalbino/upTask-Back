
const generarId = () => {
    //Este lo voy a usar para el token de usuario. Que no es el JWT.
    //Lo voy a usar para que al registrarse el usuario, le envio un mail con ese token para que confirme
    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);
    return random + fecha;
}

export default generarId;
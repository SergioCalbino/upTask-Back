import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
   
    const { nombre, email, token } = datos;
    console.log(token)

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Informacion del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'UpTask - Comprueba tu cuenta',
        text: 'Comprueba tu cuenta en UpTask',
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta está casi lista, compruébala en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Comprobar Cuenta</a></p>
    
        <p>Si no creaste esta cuenta puedes ignorar el mensaje</p>
        `
    })
};


export const emailOlvidePassword = async (datos) => {
   
    const { nombre, email, token } = datos;
    console.log(token)

    //TODO: Mover hacia variables de entorno
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
      });

      //Informacion del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'UpTask - Reestablece tu password',
        text: 'Reestablece tu password',
        html: `<p>Hola: ${nombre} Has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}"> Reestablecer Password</a></p>
    
        <p>Si no solicitaste este email puedes ignorar el mensaje</p>
        `
    })
}
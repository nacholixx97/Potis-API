const db = require('../database/config');
const { catchAsync } = require('../helpers/catchAsync');
const { sendOK } = require('../helpers/sendOK');
const nodemailer = require('nodemailer');

const mailController = {};

mailController.recoverPassword = catchAsync(async (req, res, next) => {
    const { sendTo } = req.body;

    mailValidation = await db('user').where({ email: sendTo }).update({ password: '12345'});

    console.log(mailValidation)

    if (mailValidation.length === 0) {
        sendOK(res, { message: 'El Email ingresado no existe.' });
    } else {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: sendTo,
            subject: 'Recuperar Contraseña',
            html: '<p>Hola,</p><p>Hemos recibido una solicitud para recuperar tu contraseña.</p><p>Para continuar, por favor haz click en el siguiente enlace:</p><p><a href="http://localhost:3000/api/recover-password/' + sendTo + '">Recuperar Contraseña</a></p><p>Si no solicitaste recuperar tu contraseña, por favor ignora este mensaje.</p>',
            html: `
                <p>Hola,</p>
                <p>Hemos recibido una solicitud para recuperar su contraseña.</p>
                <p>La reestablecimos a <b>12345</b>.</p>
                <p>Por favor, al loguearse genere una nueva contraseña.</p>
                <p></p>
                <p>Si no solicitaste recuperar tu contraseña, por favor ignora este mensaje.</p>
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });

        sendOK(res)
    }
});

module.exports = mailController;

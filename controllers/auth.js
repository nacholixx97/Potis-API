const jwt = require('jsonwebtoken');
const jwtconfig = require('../jwt.config');
const db = require('../database/config');
const { catchAsync } = require('../helpers/catchAsync');
const { sendOK } = require('../helpers/sendOK');
const errorHandler = require('../helpers/errorHandler');

const authController = {};

authController.validateAuth = catchAsync(async (req, res, next) => {
    let authValidation;
    const validation = await db('user')
        .where({
            username: req.body.username,
            password: req.body.password
        }).first();

    if (validation) {
        const payload = {
            userData: validation,
            check: true
        };

        const token = jwt.sign(payload, jwtconfig.key, {
            expiresIn: "1 day"
        });

        authValidation = {
            mensaje: 'Autenticación correcta',
            token: token,
            user: {
                username: validation.username
            }
        };

        sendOK(res, authValidation);
    } else {
        next(new errorHandler('Autenticación incorrecta'));
    }
});

module.exports = authController;

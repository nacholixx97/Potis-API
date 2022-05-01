const common = require('./common');
const ErrorHandler = require('./errorHandler');

const sendOK = (res, body = '') => {
    // Validación de response vacío.
    // if (!common.isObject(body)) {
    //     throw new ErrorHandler('Response vacío.', 500);
    // }

    res.status(200).send({
        status: 'success',
        body
    });
};

module.exports = { sendOK };

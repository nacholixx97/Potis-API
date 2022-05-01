const router = require('express').Router();
const { authValidator } = require('../middlewares/authValidator')

const {
    recoverPassword
} = require('../controllers/mail');

// En caso de querer validar con JWToken utilizar el middleware authValidator
// Ej. router.get('/', authValidator, getAll);

// POST api/mail/recoverPassword
router.post('/recoverPassword', recoverPassword);

module.exports = router;

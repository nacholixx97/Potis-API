const router = require('express').Router();
const { authValidator } = require('../middlewares/authValidator')

const {
    getList,
    inAction,
    outAction
} = require('../controllers/stock');

// En caso de querer validar con JWToken utilizar el middleware authValidator
// Ej. router.get('/', authValidator, getAll);

// api/stock/
router.put('/', authValidator, getList);

// api/stock/:id/in
router.put('/reposition', authValidator, inAction);

module.exports = router;

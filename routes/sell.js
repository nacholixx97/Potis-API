const router = require('express').Router();
const { authValidator } = require('../middlewares/authValidator')

const {
    newSell,
    getList,
    getById,
    returnSell
} = require('../controllers/sell');

// En caso de querer validar con JWToken utilizar el middleware authValidator
// Ej. router.get('/', authValidator, getAll);

// PUT api/sell/
router.put('/', authValidator, getList);

// POST api/sell/
router.post('/', authValidator, newSell);

// GET api/sell/:id
router.get('/:id', authValidator, getById);

// GET api/sell/:id/return
router.get('/:id/return', authValidator, returnSell);

module.exports = router;

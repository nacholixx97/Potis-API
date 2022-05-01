const router = require('express').Router();
const { authValidator } = require('../middlewares/authValidator')

const {
    getById,
    getList,
    update,
    create,
    deleteUser,
    changePassword
} = require('../controllers/user');

// En caso de querer validar con JWToken utilizar el middleware authValidator
// Ej. router.get('/', authValidator, getAll);

// PUT api/user/changePassword
router.put('/changePassword', authValidator, changePassword);

// PUT api/user
router.put('/', authValidator, getList);

// PUT api/user/{id}
router.put('/:id', authValidator, update);

// DELETE api/user/{id}
router.delete('/:id', authValidator, deleteUser);

// POST api/user/{id}
router.post('/', authValidator, create);

// GET api/user/{id}
router.get('/:id', authValidator, getById);

module.exports = router;

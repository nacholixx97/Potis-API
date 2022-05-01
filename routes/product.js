const router = require('express').Router();
const { authValidator } = require('../middlewares/authValidator')

const {
    getById,
    getList,
    deleteProduct,
    updateProduct,
    getProductsToSell,
    createProduct
} = require('../controllers/product');

// En caso de querer validar con JWToken utilizar el middleware authValidator
// Ej. router.get('/', authValidator, getAll);

// PUT api/product
router.put('/', authValidator, getList);

// PUT api/product/new
router.put('/toSell', authValidator, getProductsToSell);

// POST api/product
router.post('/', authValidator, createProduct);

// GET api/product/{id}
router.get('/:id', authValidator, getById);

// DELETE api/product/{id}
router.delete('/:id', authValidator, deleteProduct);

// PUT api/product/{id}
router.put('/:id', authValidator, updateProduct);

module.exports = router;

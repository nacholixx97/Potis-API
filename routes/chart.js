const router = require('express').Router();
const { authValidator } = require('../middlewares/authValidator')

const {
    mostSelledProducts,
    mostSelledByWaist,
    mostSelledToday,
    totalGenerated
} = require('../controllers/chart');

// En caso de querer validar con JWToken utilizar el middleware authValidator
// Ej. router.get('/', authValidator, getAll);

// GET api/chart/mostSelledToday
router.get('/mostSelledToday', authValidator, mostSelledToday);

// GET api/chart/totalGenerated
router.get('/totalGenerated', authValidator, totalGenerated);

// GET api/chart/mostSelledProducts
router.get('/mostSelledProducts', authValidator, mostSelledProducts);

// GET api/chart/mostSelledByWaist
router.get('/mostSelledByWaist', authValidator, mostSelledByWaist);

module.exports = router;

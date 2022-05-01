const router = require('express').Router();

// Autenticación
router.use('/auth', require('./auth'));

// Datos
router.use('/user', require('./user'));
router.use('/product', require('./product'));
router.use('/stock', require('./stock'));
router.use('/chart', require('./chart'));
router.use('/sell', require('./sell'));
router.use('/mail', require('./mail'));

module.exports = router;

const router = require('express').Router();

const {
    validateAuth
} = require('../controllers/auth');

// api/auth
router.post('/', validateAuth);

module.exports = router;

const jwt = require('jsonwebtoken');
const jwtconfig = require('../jwt.config');

const userByToken = (token) => {
    return jwt.verify(token, jwtconfig.key).userData;
};

module.exports = { 
    userByToken
};
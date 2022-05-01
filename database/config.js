const knex = require('knex');
const knexConfig = require('../knexfile')[process.env.NODE_ENV];

module.exports = knex(knexConfig);

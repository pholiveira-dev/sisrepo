const knex = require('knex');
const knexConfig = require('../knexfile');
const enviroment = process.env.NODE_ENV || 'development';

const connection = knex(knexConfig[enviroment]);

module.exports = connection;
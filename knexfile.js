const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    development: {
        client: 'pg',
        connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
        },
        debug: true,
        useNullAsDefault: true,
        migrations: { directory: './database/migrations' },
        seeds: { directory: './database/seeds' },
        pool: {
        min: 0,
        max: 10
        }
    },
    production: {
        client: 'pg',
        connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
        },
        debug: false,
        useNullAsDefault: true,
        migrations: { directory: './database/migrations' },
        seeds: { directory: './database/seeds' },
        pool: {
        min: 0,
        max: 10
        }
    }
};

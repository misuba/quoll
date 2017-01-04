"use strict";

const config = require('../config.json');

const massive = require("massive");
const connectionString = process.env.HEROKU_POSTGRESQL_BRONZE_URL
    ? process.env.HEROKU_POSTGRESQL_BRONZE_URL
    : `postgres://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}/${config.DB_NAME}`;

const db = massive.connectSync({connectionString});

module.exports = db;

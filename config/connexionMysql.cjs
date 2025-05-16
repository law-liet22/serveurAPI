require('dotenv').config();
const env = process.env
const mysql = require('mysql2');
const connexionSql = {
    host: env.HOST_MYSQL,
    user: env.USER_MYSQL,
    password: env.PASSWORD_MYSQL,
    database: env.DATABASE
};

const db = mysql.createConnection({
    host: connexionSql.host,  // Host MySQL
    user: connexionSql.user, // User MySQL
    password: connexionSql.password, // Mot de passe MySQL
    database: connexionSql.database // BDD
});

module.exports = db;
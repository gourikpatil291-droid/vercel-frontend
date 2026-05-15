const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
async function run() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });
        const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf-8');
        await connection.query(sql);
        console.log("Tables created successfully in service_management1!");
        process.exit(0);
    } catch (err) {
        console.error("Error setting up database:", err);
        process.exit(1);
    }
}
run();
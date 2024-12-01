import { Client } from 'pg';
require("dotenv").config();

const client = new Client({
    user: process.env.DB_USER,
    host: "localhost",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5433 || 5432,          
});

client.connect();

export default client;

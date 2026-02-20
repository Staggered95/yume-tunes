import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

const query = async (sql, params=[]) => {
    try {
        if (process.env.NODE_ENV != "production") {
            console.log("SQL: ", sql);
        }
        return await pool.query(sql, params);
    } catch (err) {
        console.log("DB Error: ", err.message);
        throw err;
    }
};

export { pool, query };
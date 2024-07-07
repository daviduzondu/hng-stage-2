import pg from 'pg';

const pool = new pg.Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    port: Number(process.env.PGPORT) || 5432
});

const client = await pool.connect();

export async function begin() {
    return (client).query('BEGIN');
}

export async function query(text: string, params: any[]) {
    return (client).query(text, params);
}

export async function commit() {
    return (client).query("COMMIT");
}

export async function rollback() {
    return (client).query('ROLLBACK');
}

export async function release() {
    (client).release();
}
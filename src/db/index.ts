import pg from 'pg';

const pool = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    // @ts-ignore
    port: process.env.PGPORT
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
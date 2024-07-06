import pg from 'pg';

const pool = new pg.Pool({
    user: 'david',
    host: 'localhost',
    database: "david",
    password: 'password',
    port: 5432
});

const client = await pool.connect();

export async function begin() {
    return client.query('BEGIN');
}

export async function query(text: string, params: any[], callback?: any) {
    return client.query(text, params, callback);
}

export async function commit() {
    return client.query("COMMIT");
}

export async function rollback() {
    return client.query('ROLLBACK');
}

export async function release() {
    client.release();
}